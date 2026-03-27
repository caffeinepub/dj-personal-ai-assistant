import { a3 as usePlans, a7 as useSavePlan, a8 as useUpdatePlan, a9 as useDeletePlan, j as jsxRuntimeExports, r as reactExports, k as ue } from "./index-D4lUgCCM.js";
import { B as Badge } from "./badge-BMXMPn3_.js";
import { c as createLucideIcon, B as Button } from "./createLucideIcon-a11X8bAo.js";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-BpTMTJ9f.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { S as ScrollArea } from "./scroll-area-D1D6khfo.js";
import { S as Skeleton } from "./skeleton-BKksus4V.js";
import { g as generatePlanFromGoal } from "./planGenerator-FraClx5b.js";
import { L as Layout, k as Map } from "./Layout-y-fTRwTO.js";
import { m as motion, A as AnimatePresence } from "./proxy-CDDWEtkX.js";
import { P as Plus } from "./plus-D6lHqroT.js";
import { Z as Zap } from "./zap-CRDejI0C.js";
import { a as ChevronUp, C as ChevronDown } from "./chevron-up-QZ-Q9T3F.js";
import { T as Trash2 } from "./trash-2-BvljEyqY.js";
import { C as Clock } from "./clock-CE-TFw6V.js";
import "./index-DREpW-Gk.js";
import "./index-IXOTxK3N.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
];
const Pause = createLucideIcon("pause", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
];
const Target = createLucideIcon("target", __iconNode);
const QUICK_STARTS = [
  { label: "Learn Networking", goal: "learn networking" },
  { label: "Build a Website", goal: "build a website" },
  { label: "Improve Fitness", goal: "start a fitness routine" },
  { label: "Launch a Project", goal: "launch a personal project" }
];
function StepIcon({ status }) {
  if (status === "done")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-green-400" });
  if (status === "in_progress")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-cyan-400 animate-pulse" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-4 w-4 text-white/20" });
}
function statusBadgeClass(status) {
  if (status === "active")
    return "border-cyan-500/40 bg-cyan-500/10 text-cyan-300";
  if (status === "completed")
    return "border-green-500/40 bg-green-500/10 text-green-300";
  return "border-amber-500/40 bg-amber-500/10 text-amber-300";
}
function PlanCard({
  plan,
  index,
  onTogglePause,
  onDelete,
  onMarkStep,
  isUpdating,
  isDeleting
}) {
  const [expanded, setExpanded] = reactExports.useState(true);
  const [confirmDelete, setConfirmDelete] = reactExports.useState(false);
  const done = plan.steps.filter((s) => s.status === "done").length;
  const progress = plan.steps.length > 0 ? done / plan.steps.length * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      "data-ocid": `plans.item.${index}`,
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -12 },
      transition: { duration: 0.35, delay: index * 0.07 },
      className: "group relative overflow-hidden rounded-xl border border-white/8 bg-[#0a1628]/60 backdrop-blur-sm",
      style: { boxShadow: "0 0 20px rgba(0,212,255,0.04)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-400/70" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-semibold text-white/90", children: plan.goal }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-[10px] ${statusBadgeClass(plan.status)}`, children: plan.status.toUpperCase() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-1 overflow-hidden rounded-full bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500",
                initial: { width: 0 },
                animate: { width: `${progress}%` },
                transition: { duration: 0.6, ease: "easeOut" }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] text-white/30", children: [
              done,
              "/",
              plan.steps.length,
              " steps completed"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `plans.item.${index}.toggle`,
                className: "rounded-lg p-1.5 text-white/30 transition-colors hover:text-cyan-400",
                onClick: () => setExpanded((v) => !v),
                children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
              }
            ),
            plan.status !== "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `plans.item.${index}.toggle`,
                className: "rounded-lg p-1.5 text-white/30 transition-colors hover:text-amber-400",
                onClick: () => onTogglePause(plan),
                disabled: isUpdating,
                title: plan.status === "paused" ? "Resume plan" : "Pause plan",
                children: plan.status === "paused" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4" })
              }
            ),
            !confirmDelete ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `plans.item.${index}.delete_button`,
                className: "rounded-lg p-1.5 text-white/20 transition-colors hover:text-red-400",
                onClick: () => setConfirmDelete(true),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `plans.item.${index}.confirm_button`,
                  className: "rounded px-2 py-0.5 text-[11px] text-red-400 ring-1 ring-red-500/40 hover:bg-red-500/10",
                  onClick: () => {
                    onDelete(plan.id);
                    setConfirmDelete(false);
                  },
                  disabled: isDeleting,
                  children: "Delete"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `plans.item.${index}.cancel_button`,
                  className: "rounded px-2 py-0.5 text-[11px] text-white/40 hover:text-white/60",
                  onClick: () => setConfirmDelete(false),
                  children: "Cancel"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.25 },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/5 px-4 pb-4 pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: plan.steps.map((step, si) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                "data-ocid": `plans.item.${index}.row`,
                className: "flex items-start gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StepIcon, { status: step.status }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `flex-1 text-sm ${step.status === "done" ? "text-white/30 line-through" : "text-white/70"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mr-1 text-xs text-white/20", children: [
                          si + 1,
                          "."
                        ] }),
                        step.description
                      ]
                    }
                  ),
                  step.status !== "done" && plan.status !== "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `plans.item.${index}.save_button`,
                      className: "flex-shrink-0 rounded px-2 py-0.5 text-[10px] text-cyan-400/70 ring-1 ring-cyan-500/20 hover:bg-cyan-500/10 hover:text-cyan-400",
                      onClick: () => onMarkStep(plan, step.id),
                      disabled: isUpdating,
                      children: "Done"
                    }
                  )
                ]
              },
              step.id
            )) }) })
          }
        ) })
      ]
    }
  );
}
function NewPlanDialog({ onSave }) {
  const [open, setOpen] = reactExports.useState(false);
  const [goalInput, setGoalInput] = reactExports.useState("");
  const [preview, setPreview] = reactExports.useState(null);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dialog,
    {
      open,
      onOpenChange: (v) => {
        setOpen(v);
        if (!v) {
          setPreview(null);
          setGoalInput("");
        }
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "plans.open_modal_button",
            className: "gap-2 bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40 hover:bg-cyan-500/30",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "New Plan"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            "data-ocid": "plans.dialog",
            className: "border-white/10 bg-[#060b14] text-white sm:max-w-lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-cyan-300", children: "Create a New Plan" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "plans.input",
                      placeholder: "e.g. learn networking, build a website...",
                      value: goalInput,
                      onChange: (e) => {
                        setGoalInput(e.target.value);
                        setPreview(null);
                      },
                      onKeyDown: (e) => e.key === "Enter" && handlePreview(),
                      className: "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-cyan-500/50"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      "data-ocid": "plans.secondary_button",
                      variant: "outline",
                      onClick: handlePreview,
                      disabled: !goalInput.trim(),
                      className: "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                      children: "Preview"
                    }
                  )
                ] }),
                preview && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 8 },
                    animate: { opacity: 1, y: 0 },
                    className: "rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 text-xs font-medium text-cyan-400/80", children: [
                        "Plan preview — ",
                        preview.steps.length,
                        " steps"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-1", children: preview.steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-xs text-white/60", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/30", children: [
                          i + 1,
                          "."
                        ] }),
                        s.description
                      ] }, s.id)) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "plans.cancel_button",
                    variant: "ghost",
                    onClick: () => setOpen(false),
                    className: "text-white/50 hover:text-white/70",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "plans.submit_button",
                    onClick: handleSave,
                    disabled: !goalInput.trim(),
                    className: "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40 hover:bg-cyan-500/30",
                    children: "Create Plan"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
function EmptyState({
  onQuickStart
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      "data-ocid": "plans.empty_state",
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "flex flex-col items-center py-16 text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "h-7 w-7 text-cyan-400/60" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-1 font-display text-lg text-white/70", children: "No plans yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-6 max-w-xs text-sm text-white/30", children: "Convert your goals into structured action plans. DJ will break them into clear, manageable steps." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-xs font-medium uppercase tracking-widest text-white/20", children: "Quick start" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: QUICK_STARTS.map((qs) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "plans.secondary_button",
            onClick: () => onQuickStart(qs.goal),
            className: "rounded-lg border border-white/8 bg-white/3 px-4 py-2.5 text-left text-sm text-white/50 transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-white/80",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "mb-1 h-3.5 w-3.5 text-cyan-400/50" }),
              qs.label
            ]
          },
          qs.goal
        )) })
      ]
    }
  );
}
function PlansPage() {
  const { data: plans = [], isLoading } = usePlans();
  const savePlanMutation = useSavePlan();
  const updatePlanMutation = useUpdatePlan();
  const deletePlanMutation = useDeletePlan();
  async function handleCreate(goal) {
    const plan = generatePlanFromGoal(goal);
    try {
      await savePlanMutation.mutateAsync(plan);
      ue.success(`Plan created: ${plan.goal}`);
    } catch {
      ue.error("Failed to save plan. Please try again.");
    }
  }
  async function handleTogglePause(plan) {
    const newStatus = plan.status === "paused" ? "active" : "paused";
    try {
      await updatePlanMutation.mutateAsync({ ...plan, status: newStatus });
    } catch {
      ue.error("Failed to update plan.");
    }
  }
  async function handleDelete(id) {
    try {
      await deletePlanMutation.mutateAsync(id);
      ue.success("Plan deleted.");
    } catch {
      ue.error("Failed to delete plan.");
    }
  }
  async function handleMarkStep(plan, stepId) {
    const updated = {
      ...plan,
      steps: plan.steps.map(
        (s) => s.id === stepId ? { ...s, status: "done" } : s
      )
    };
    if (updated.steps.every((s) => s.status === "done")) {
      updated.status = "completed";
    }
    try {
      await updatePlanMutation.mutateAsync(updated);
      ue.success("Step completed!");
    } catch {
      ue.error("Failed to update step.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen px-4 pb-24 pt-6 md:px-6 md:pt-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -16 },
        animate: { opacity: 1, y: 0 },
        className: "mb-6 flex items-start justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "h-5 w-5 text-cyan-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-white", children: "Cognitive Plans" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/30", children: "Goal-to-Action Engine" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(NewPlanDialog, { onSave: handleCreate })
        ]
      }
    ),
    plans.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.1 },
        className: "mb-5 flex gap-3 text-center",
        children: [
          [
            "Active",
            plans.filter((p) => p.status === "active").length,
            "text-cyan-400"
          ],
          [
            "Paused",
            plans.filter((p) => p.status === "paused").length,
            "text-amber-400"
          ],
          [
            "Completed",
            plans.filter((p) => p.status === "completed").length,
            "text-green-400"
          ]
        ].map(([label, count, cls]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-1 rounded-lg border border-white/5 bg-white/3 py-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-display text-xl font-bold ${cls}`, children: count }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-white/30", children: label })
            ]
          },
          label
        ))
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "plans.loading_state", className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl bg-white/5" }, i)) }) : plans.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { onQuickStart: handleCreate }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[calc(100vh-220px)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: plans.map((plan, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlanCard,
      {
        plan,
        index: idx + 1,
        onTogglePause: handleTogglePause,
        onDelete: handleDelete,
        onMarkStep: handleMarkStep,
        isUpdating: updatePlanMutation.isPending,
        isDeleting: deletePlanMutation.isPending
      },
      plan.id
    )) }) }) })
  ] }) });
}
export {
  PlansPage
};
