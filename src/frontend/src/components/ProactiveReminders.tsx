import { Button } from "@/components/ui/button";
import { AlertTriangle, Bell, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTasks } from "../hooks/useQueries";

interface ReminderBanner {
  taskId: string;
  taskTitle: string;
  dueTime: Date;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProactiveReminders() {
  const { data: tasks = [] } = useTasks();
  const [banners, setBanners] = useState<ReminderBanner[]>([]);
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  useEffect(() => {
    const checkReminders = () => {
      const currentTasks = tasksRef.current;
      const now = Date.now();
      const thirtyMin = 30 * 60 * 1000;

      for (const task of currentTasks) {
        if (task.completed || !task.deadline) continue;
        const deadlineMs = Number(task.deadline) / 1_000_000;
        const taskId = task.id.toString();
        const firedKey = `dj_reminder_fired_${taskId}`;
        const ackKey = `dj_reminder_ack_${taskId}`;
        const followupKey = `dj_followup_fired_${taskId}`;
        const ackVal = localStorage.getItem(ackKey);

        if (now >= deadlineMs && now < deadlineMs + thirtyMin) {
          if (!localStorage.getItem(firedKey)) {
            localStorage.setItem(firedKey, "1");
            const dueTime = new Date(deadlineMs);
            setBanners((prev) => {
              if (prev.some((b) => b.taskId === taskId)) return prev;
              return [...prev, { taskId, taskTitle: task.title, dueTime }];
            });
            window.dispatchEvent(
              new CustomEvent("dj-proactive-message", {
                detail: {
                  content: `\u23f0 **Reminder:** ${task.title} is due now (${formatTime(dueTime)})`,
                  type: "reminder",
                  taskId,
                },
              }),
            );
          }
        }

        if (
          now >= deadlineMs + thirtyMin &&
          localStorage.getItem(firedKey) &&
          !ackVal &&
          !localStorage.getItem(followupKey)
        ) {
          localStorage.setItem(followupKey, "1");
          const dueTime = new Date(deadlineMs);
          window.dispatchEvent(
            new CustomEvent("dj-proactive-message", {
              detail: {
                content: `You had **${task.title}** at ${formatTime(dueTime)} \u2014 did it happen?`,
                type: "followup",
                taskId,
              },
            }),
          );
          toast(`Missed reminder: ${task.title}`, {
            description: `You had this at ${formatTime(dueTime)}. Did it happen?`,
            action: {
              label: "Yes",
              onClick: () => localStorage.setItem(ackKey, "yes"),
            },
          });
        }
      }
    };

    checkReminders();
    const intervalRef = setInterval(checkReminders, 60_000);
    return () => clearInterval(intervalRef);
  }, []);

  const dismissBanner = (taskId: string) => {
    localStorage.setItem(`dj_reminder_ack_${taskId}`, "acknowledged");
    setBanners((prev) => prev.filter((b) => b.taskId !== taskId));
  };

  if (banners.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 p-2">
      {banners.map((banner) => (
        <div
          key={banner.taskId}
          data-ocid="reminder.banner"
          className="flex items-center justify-between gap-3 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-2.5 shadow-lg backdrop-blur"
          style={{ boxShadow: "0 0 20px oklch(0.85 0.18 85 / 0.3)" }}
        >
          <div className="flex items-center gap-2.5">
            <Bell className="h-4 w-4 shrink-0 text-yellow-400 animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-yellow-300">
                Reminder: {banner.taskTitle}
              </p>
              <p className="text-xs text-yellow-400/80">
                Was due at {formatTime(banner.dueTime)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              data-ocid="reminder.acknowledge_button"
              onClick={() => dismissBanner(banner.taskId)}
              className="h-7 border border-yellow-500/40 bg-yellow-500/20 px-3 text-xs text-yellow-300 hover:bg-yellow-500/30"
            >
              <AlertTriangle className="mr-1 h-3 w-3" />
              Acknowledge
            </Button>
            <button
              type="button"
              onClick={() =>
                setBanners((prev) =>
                  prev.filter((b) => b.taskId !== banner.taskId),
                )
              }
              className="text-yellow-400/60 hover:text-yellow-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
