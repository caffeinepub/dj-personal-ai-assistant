import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckSquare, Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  type Task,
  useAddTask,
  useDeleteTask,
  useTasks,
  useUpdateTaskCompletion,
} from "../hooks/useQueries";

function formatRelativeTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const now = Date.now();
  const diff = ms - now;
  const absDiff = Math.abs(diff);
  const days = Math.floor(absDiff / 86400000);
  const hours = Math.floor((absDiff % 86400000) / 3600000);
  if (diff < 0) {
    if (days > 0) return `${days}d overdue`;
    if (hours > 0) return `${hours}h overdue`;
    return "Just overdue";
  }
  if (days > 0) return `in ${days}d`;
  if (hours > 0) return `in ${hours}h`;
  return "Due soon";
}

function getPriorityColor(priority: string) {
  if (priority === "High")
    return "bg-destructive/20 text-destructive border-destructive/50";
  if (priority === "Medium")
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
  return "bg-green-500/20 text-green-400 border-green-500/50";
}

function isOverdue(task: Task): boolean {
  if (!task.deadline || task.completed) return false;
  return Number(task.deadline) / 1_000_000 < Date.now();
}

function isDueToday(task: Task): boolean {
  if (!task.deadline || task.completed) return false;
  const deadlineMs = Number(task.deadline) / 1_000_000;
  const today = new Date();
  const deadline = new Date(deadlineMs);
  return (
    deadline.getFullYear() === today.getFullYear() &&
    deadline.getMonth() === today.getMonth() &&
    deadline.getDate() === today.getDate()
  );
}

export function TasksPage() {
  const { data: tasks = [], isLoading } = useTasks();
  const addTask = useAddTask();
  const deleteTask = useDeleteTask();
  const updateCompletion = useUpdateTaskCompletion();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("all");

  const overdueCount = tasks.filter(isOverdue).length;
  const dueTodayCount = tasks.filter(isDueToday).length;

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "pending") return !t.completed;
      if (filter === "completed") return t.completed;
      if (filter === "overdue") return isOverdue(t);
      return true;
    })
    .sort((a, b) => {
      if (isOverdue(a) && !isOverdue(b)) return -1;
      if (!isOverdue(a) && isOverdue(b)) return 1;
      if (!a.completed && b.completed) return -1;
      if (a.completed && !b.completed) return 1;
      if (a.deadline && b.deadline) return Number(a.deadline - b.deadline);
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return 0;
    });

  const handleAdd = async () => {
    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    try {
      const deadlineBigint = deadline
        ? BigInt(new Date(deadline).getTime()) * 1_000_000n
        : null;
      await addTask.mutateAsync({
        title,
        description,
        deadline: deadlineBigint,
        priority,
      });
      setTitle("");
      setDescription("");
      setDeadline("");
      setPriority("Medium");
      toast.success("Task added");
    } catch {
      toast.error("Failed to add task");
    }
  };

  const handleToggle = async (id: bigint, completed: boolean) => {
    try {
      await updateCompletion.mutateAsync({ id, completed: !completed });
      toast.success(!completed ? "Task completed!" : "Task reopened");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteTask.mutateAsync(id);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto space-y-6 px-4 py-8">
        <div className="flex items-center gap-3">
          <CheckSquare className="h-8 w-8 text-primary" />
          <h1 className="glow-text font-display text-3xl font-bold">
            Tasks & Reminders
          </h1>
        </div>

        {(overdueCount > 0 || dueTodayCount > 0) && (
          <Card
            data-ocid="tasks.error_state"
            className="border-destructive/50 bg-destructive/10"
          >
            <CardContent className="flex items-center gap-3 py-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
              <div className="text-sm">
                {overdueCount > 0 && (
                  <span className="font-semibold text-destructive">
                    {overdueCount} overdue task{overdueCount > 1 ? "s" : ""}
                  </span>
                )}
                {overdueCount > 0 && dueTodayCount > 0 && (
                  <span className="mx-2 text-muted-foreground">&middot;</span>
                )}
                {dueTodayCount > 0 && (
                  <span className="font-semibold text-yellow-400">
                    {dueTodayCount} due today
                  </span>
                )}
                <span className="ml-2 text-muted-foreground">
                  &mdash; DJ recommends addressing these first.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="glow-border border-primary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Plus className="h-5 w-5 text-primary" /> Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  data-ocid="tasks.input"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="task-deadline">Deadline</Label>
                <Input
                  id="task-deadline"
                  data-ocid="tasks.input"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="[color-scheme:dark]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-desc">Description</Label>
              <Textarea
                id="task-desc"
                data-ocid="tasks.textarea"
                placeholder="Optional details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-1.5">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger data-ocid="tasks.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                data-ocid="tasks.primary_button"
                onClick={handleAdd}
                disabled={addTask.isPending}
                className="shrink-0 bg-primary hover:bg-primary/80"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList data-ocid="tasks.tab" className="bg-muted/50">
            <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({tasks.filter((t) => !t.completed).length})
            </TabsTrigger>
            <TabsTrigger value="overdue">Overdue ({overdueCount})</TabsTrigger>
            <TabsTrigger value="completed">
              Done ({tasks.filter((t) => t.completed).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div
            data-ocid="tasks.loading_state"
            className="py-12 text-center text-muted-foreground"
          >
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div data-ocid="tasks.empty_state" className="py-16 text-center">
            <CheckSquare className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">
              No tasks here. Add one above!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task, idx) => {
              const overdue = isOverdue(task);
              return (
                <Card
                  key={task.id.toString()}
                  data-ocid={`tasks.item.${idx + 1}`}
                  className={`transition-all ${
                    overdue
                      ? "border-l-4 border-destructive border-l-destructive bg-destructive/5"
                      : task.completed
                        ? "border-muted opacity-60"
                        : "border-primary/30 hover:border-primary/50"
                  }`}
                >
                  <CardContent className="flex items-start gap-4 py-4">
                    <Checkbox
                      data-ocid={`tasks.checkbox.${idx + 1}`}
                      checked={task.completed}
                      onCheckedChange={() =>
                        handleToggle(task.id, task.completed)
                      }
                      className="mt-0.5 border-primary"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-medium ${
                            task.completed
                              ? "text-muted-foreground line-through"
                              : ""
                          }`}
                        >
                          {task.title}
                        </span>
                        <Badge
                          className={`border text-xs ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </Badge>
                        {overdue && (
                          <Badge className="border border-destructive/50 bg-destructive/20 text-xs text-destructive">
                            Overdue
                          </Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      {task.deadline && (
                        <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(
                            Number(task.deadline) / 1_000_000,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          <span
                            className={`ml-1 ${overdue ? "text-destructive" : "text-primary"}`}
                          >
                            ({formatRelativeTime(task.deadline)})
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      data-ocid={`tasks.delete_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(task.id)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="h-4" />
      </div>
    </Layout>
  );
}
