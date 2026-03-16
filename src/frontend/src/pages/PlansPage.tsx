import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  Loader2,
  Map as MapIcon,
  Pause,
  Play,
  Plus,
  Target,
  Trash2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { generatePlanFromGoal } from "../assistant/planner/planGenerator";
import type {
  Plan,
  PlanStep,
  StepStatus,
} from "../assistant/planner/planTypes";
import { Layout } from "../components/Layout";
import {
  useDeletePlan,
  usePlans,
  useSavePlan,
  useUpdatePlan,
} from "../hooks/useQueries";

// ── Quick-start templates ────────────────────────────────────────────────────
const QUICK_STARTS = [
  { label: "Learn Networking", goal: "learn networking" },
  { label: "Build a Website", goal: "build a website" },
  { label: "Improve Fitness", goal: "start a fitness routine" },
  { label: "Launch a Project", goal: "launch a personal project" },
];

// ── Status helpers ───────────────────────────────────────────────────────────
function StepIcon({ status }: { status: StepStatus }) {
  if (status === "done")
    return <CheckCircle2 className="h-4 w-4 text-green-400" />;
  if (status === "in_progress")
    return <Clock className="h-4 w-4 text-cyan-400 animate-pulse" />;
  return <Circle className="h-4 w-4 text-white/20" />;
}

function statusBadgeClass(status: Plan["status"]) {
  if (status === "active")
    return "border-cyan-500/40 bg-cyan-500/10 text-cyan-300";
  if (status === "completed")
    return "border-green-500/40 bg-green-500/10 text-green-300";
  return "border-amber-500/40 bg-amber-500/10 text-amber-300";
}

// ── Plan Card ────────────────────────────────────────────────────────────────
function PlanCard({
  plan,
  index,
  onTogglePause,
  onDelete,
  onMarkStep,
  isUpdating,
  isDeleting,
}: {
  plan: Plan;
  index: number;
  onTogglePause: (plan: Plan) => void;
  onDelete: (id: string) => void;
  onMarkStep: (plan: Plan, stepId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const done = plan.steps.filter((s) => s.status === "done").length;
  const progress = plan.steps.length > 0 ? (done / plan.steps.length) * 100 : 0;

  return (
    <motion.div
      data-ocid={`plans.item.${index}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="group relative overflow-hidden rounded-xl border border-white/8 bg-[#0a1628]/60 backdrop-blur-sm"
      style={{ boxShadow: "0 0 20px rgba(0,212,255,0.04)" }}
    >
      {/* Cyan top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      {/* Card header */}
      <div className="flex items-start gap-3 p-4">
        <Target className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-400/70" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-base font-semibold text-white/90">
              {plan.goal}
            </h3>
            <Badge className={`text-[10px] ${statusBadgeClass(plan.status)}`}>
              {plan.status.toUpperCase()}
            </Badge>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p className="mt-1 text-[11px] text-white/30">
            {done}/{plan.steps.length} steps completed
          </p>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            data-ocid={`plans.item.${index}.toggle`}
            className="rounded-lg p-1.5 text-white/30 transition-colors hover:text-cyan-400"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {plan.status !== "completed" && (
            <button
              type="button"
              data-ocid={`plans.item.${index}.toggle`}
              className="rounded-lg p-1.5 text-white/30 transition-colors hover:text-amber-400"
              onClick={() => onTogglePause(plan)}
              disabled={isUpdating}
              title={plan.status === "paused" ? "Resume plan" : "Pause plan"}
            >
              {plan.status === "paused" ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </button>
          )}
          {!confirmDelete ? (
            <button
              type="button"
              data-ocid={`plans.item.${index}.delete_button`}
              className="rounded-lg p-1.5 text-white/20 transition-colors hover:text-red-400"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                data-ocid={`plans.item.${index}.confirm_button`}
                className="rounded px-2 py-0.5 text-[11px] text-red-400 ring-1 ring-red-500/40 hover:bg-red-500/10"
                onClick={() => {
                  onDelete(plan.id);
                  setConfirmDelete(false);
                }}
                disabled={isDeleting}
              >
                Delete
              </button>
              <button
                type="button"
                data-ocid={`plans.item.${index}.cancel_button`}
                className="rounded px-2 py-0.5 text-[11px] text-white/40 hover:text-white/60"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Steps accordion */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 px-4 pb-4 pt-3">
              <ul className="space-y-2">
                {plan.steps.map((step, si) => (
                  <li
                    key={step.id}
                    data-ocid={`plans.item.${index}.row`}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <StepIcon status={step.status} />
                    </div>
                    <span
                      className={`flex-1 text-sm ${
                        step.status === "done"
                          ? "text-white/30 line-through"
                          : "text-white/70"
                      }`}
                    >
                      <span className="mr-1 text-xs text-white/20">
                        {si + 1}.
                      </span>
                      {step.description}
                    </span>
                    {step.status !== "done" && plan.status !== "completed" && (
                      <button
                        type="button"
                        data-ocid={`plans.item.${index}.save_button`}
                        className="flex-shrink-0 rounded px-2 py-0.5 text-[10px] text-cyan-400/70 ring-1 ring-cyan-500/20 hover:bg-cyan-500/10 hover:text-cyan-400"
                        onClick={() => onMarkStep(plan, step.id)}
                        disabled={isUpdating}
                      >
                        Done
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── New Plan Dialog ──────────────────────────────────────────────────────────
function NewPlanDialog({ onSave }: { onSave: (goal: string) => void }) {
  const [open, setOpen] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [preview, setPreview] = useState<Plan | null>(null);

  function handlePreview() {
    if (!goalInput.trim()) return;
    setPreview(generatePlanFromGoal(goalInput.trim()));
  }

  function handleSave() {
    if (!goalInput.trim()) return;
    onSave(goalInput.trim());
    setOpen(false);
    setGoalInput("");
    setPreview(null);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setPreview(null);
          setGoalInput("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          data-ocid="plans.open_modal_button"
          className="gap-2 bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40 hover:bg-cyan-500/30"
        >
          <Plus className="h-4 w-4" />
          New Plan
        </Button>
      </DialogTrigger>
      <DialogContent
        data-ocid="plans.dialog"
        className="border-white/10 bg-[#060b14] text-white sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-cyan-300">
            Create a New Plan
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="flex gap-2">
            <Input
              data-ocid="plans.input"
              placeholder="e.g. learn networking, build a website..."
              value={goalInput}
              onChange={(e) => {
                setGoalInput(e.target.value);
                setPreview(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handlePreview()}
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-cyan-500/50"
            />
            <Button
              type="button"
              data-ocid="plans.secondary_button"
              variant="outline"
              onClick={handlePreview}
              disabled={!goalInput.trim()}
              className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            >
              Preview
            </Button>
          </div>

          {/* Steps preview */}
          {preview && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3"
            >
              <p className="mb-2 text-xs font-medium text-cyan-400/80">
                Plan preview — {preview.steps.length} steps
              </p>
              <ol className="space-y-1">
                {preview.steps.map((s, i) => (
                  <li key={s.id} className="flex gap-2 text-xs text-white/60">
                    <span className="text-white/30">{i + 1}.</span>
                    {s.description}
                  </li>
                ))}
              </ol>
            </motion.div>
          )}
        </div>
        <DialogFooter>
          <Button
            data-ocid="plans.cancel_button"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-white/50 hover:text-white/70"
          >
            Cancel
          </Button>
          <Button
            data-ocid="plans.submit_button"
            onClick={handleSave}
            disabled={!goalInput.trim()}
            className="bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40 hover:bg-cyan-500/30"
          >
            Create Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({
  onQuickStart,
}: { onQuickStart: (goal: string) => void }) {
  return (
    <motion.div
      data-ocid="plans.empty_state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-16 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/5">
        <MapIcon className="h-7 w-7 text-cyan-400/60" />
      </div>
      <h3 className="mb-1 font-display text-lg text-white/70">No plans yet</h3>
      <p className="mb-6 max-w-xs text-sm text-white/30">
        Convert your goals into structured action plans. DJ will break them into
        clear, manageable steps.
      </p>
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/20">
        Quick start
      </p>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_STARTS.map((qs) => (
          <button
            key={qs.goal}
            type="button"
            data-ocid="plans.secondary_button"
            onClick={() => onQuickStart(qs.goal)}
            className="rounded-lg border border-white/8 bg-white/3 px-4 py-2.5 text-left text-sm text-white/50 transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-white/80"
          >
            <Zap className="mb-1 h-3.5 w-3.5 text-cyan-400/50" />
            {qs.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export function PlansPage() {
  const { data: plans = [], isLoading } = usePlans();
  const savePlanMutation = useSavePlan();
  const updatePlanMutation = useUpdatePlan();
  const deletePlanMutation = useDeletePlan();

  async function handleCreate(goal: string) {
    const plan = generatePlanFromGoal(goal);
    try {
      await savePlanMutation.mutateAsync(plan);
      toast.success(`Plan created: ${plan.goal}`);
    } catch {
      toast.error("Failed to save plan. Please try again.");
    }
  }

  async function handleTogglePause(plan: Plan) {
    const newStatus = plan.status === "paused" ? "active" : "paused";
    try {
      await updatePlanMutation.mutateAsync({ ...plan, status: newStatus });
    } catch {
      toast.error("Failed to update plan.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePlanMutation.mutateAsync(id);
      toast.success("Plan deleted.");
    } catch {
      toast.error("Failed to delete plan.");
    }
  }

  async function handleMarkStep(plan: Plan, stepId: string) {
    const updated: Plan = {
      ...plan,
      steps: plan.steps.map((s) =>
        s.id === stepId ? { ...s, status: "done" as StepStatus } : s,
      ),
    };
    if (updated.steps.every((s) => s.status === "done")) {
      updated.status = "completed";
    }
    try {
      await updatePlanMutation.mutateAsync(updated);
      toast.success("Step completed!");
    } catch {
      toast.error("Failed to update step.");
    }
  }

  return (
    <Layout>
      <div className="min-h-screen px-4 pb-24 pt-6 md:px-6 md:pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start justify-between"
        >
          <div>
            <div className="mb-1 flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-cyan-400" />
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                Cognitive Plans
              </h1>
            </div>
            <p className="text-sm text-white/30">Goal-to-Action Engine</p>
          </div>
          <NewPlanDialog onSave={handleCreate} />
        </motion.div>

        {/* Stats row */}
        {plans.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-5 flex gap-3 text-center"
          >
            {(
              [
                [
                  "Active",
                  plans.filter((p) => p.status === "active").length,
                  "text-cyan-400",
                ],
                [
                  "Paused",
                  plans.filter((p) => p.status === "paused").length,
                  "text-amber-400",
                ],
                [
                  "Completed",
                  plans.filter((p) => p.status === "completed").length,
                  "text-green-400",
                ],
              ] as [string, number, string][]
            ).map(([label, count, cls]) => (
              <div
                key={label}
                className="flex-1 rounded-lg border border-white/5 bg-white/3 py-2"
              >
                <div className={`font-display text-xl font-bold ${cls}`}>
                  {count}
                </div>
                <div className="text-[10px] text-white/30">{label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Content */}
        {isLoading ? (
          <div data-ocid="plans.loading_state" className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl bg-white/5" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <EmptyState onQuickStart={handleCreate} />
        ) : (
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-3 pr-2">
              <AnimatePresence>
                {plans.map((plan, idx) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    index={idx + 1}
                    onTogglePause={handleTogglePause}
                    onDelete={handleDelete}
                    onMarkStep={handleMarkStep}
                    isUpdating={updatePlanMutation.isPending}
                    isDeleting={deletePlanMutation.isPending}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </div>
    </Layout>
  );
}
