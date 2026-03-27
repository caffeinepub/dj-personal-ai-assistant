import { r as reactExports, j as jsxRuntimeExports, f as useTasks, o as useContextEngine, P as useAddTask, Q as useDeleteTask, S as useUpdateTaskCompletion, k as ue } from "./index-D4lUgCCM.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D6TXgbbC.js";
import { B as Badge } from "./badge-BMXMPn3_.js";
import { u as useComposedRefs, a as cn, B as Button } from "./createLucideIcon-a11X8bAo.js";
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle } from "./card-iyETJf1A.js";
import { d as createContextScope, P as Presence, u as useControllableState, e as composeEventHandlers, f as useSize, L as Layout, b as SquareCheckBig, T as TriangleAlert } from "./Layout-y-fTRwTO.js";
import { u as usePrevious } from "./index-Cj4N10C2.js";
import { P as Primitive } from "./proxy-CDDWEtkX.js";
import { C as Check } from "./check-CyKGSNZc.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { L as Label } from "./label-Bf9_XisY.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C5iF8xTu.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-eotKpg0e.js";
import { T as Textarea } from "./textarea-a_o-YPgo.js";
import { P as Plus } from "./plus-D6lHqroT.js";
import { C as Clock } from "./clock-CE-TFw6V.js";
import { T as Trash2 } from "./trash-2-BvljEyqY.js";
import "./index-DREpW-Gk.js";
import "./index-IXOTxK3N.js";
import "./chevron-up-QZ-Q9T3F.js";
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control == null ? void 0 : control.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Checkbox$1,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxIndicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" })
        }
      )
    }
  );
}
function formatRelativeTime(timestamp) {
  const ms = Number(timestamp) / 1e6;
  const now = Date.now();
  const diff = ms - now;
  const absDiff = Math.abs(diff);
  const days = Math.floor(absDiff / 864e5);
  const hours = Math.floor(absDiff % 864e5 / 36e5);
  if (diff < 0) {
    if (days > 0) return `${days}d overdue`;
    if (hours > 0) return `${hours}h overdue`;
    return "Just overdue";
  }
  if (days > 0) return `in ${days}d`;
  if (hours > 0) return `in ${hours}h`;
  return "Due soon";
}
function getPriorityColor(priority) {
  if (priority === "High")
    return "bg-destructive/20 text-destructive border-destructive/50";
  if (priority === "Medium")
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
  return "bg-green-500/20 text-green-400 border-green-500/50";
}
function isOverdue(task) {
  if (!task.deadline || task.completed) return false;
  return Number(task.deadline) / 1e6 < Date.now();
}
function isDueToday(task) {
  if (!task.deadline || task.completed) return false;
  const deadlineMs = Number(task.deadline) / 1e6;
  const today = /* @__PURE__ */ new Date();
  const deadline = new Date(deadlineMs);
  return deadline.getFullYear() === today.getFullYear() && deadline.getMonth() === today.getMonth() && deadline.getDate() === today.getDate();
}
function TasksPage() {
  const { data: tasks = [], isLoading } = useTasks();
  const { logAction } = useContextEngine();
  const addTask = useAddTask();
  const deleteTask = useDeleteTask();
  const updateCompletion = useUpdateTaskCompletion();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [deadline, setDeadline] = reactExports.useState("");
  const [priority, setPriority] = reactExports.useState("Medium");
  const [filter, setFilter] = reactExports.useState("all");
  const [deleteTaskId, setDeleteTaskId] = reactExports.useState(null);
  const overdueCount = tasks.filter(isOverdue).length;
  const dueTodayCount = tasks.filter(isDueToday).length;
  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    if (filter === "overdue") return isOverdue(t);
    return true;
  }).sort((a, b) => {
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
      ue.error("Please enter a task title");
      return;
    }
    try {
      const deadlineBigint = deadline ? BigInt(new Date(deadline).getTime()) * 1000000n : null;
      await addTask.mutateAsync({
        title,
        description,
        deadline: deadlineBigint,
        priority
      });
      setTitle("");
      setDescription("");
      setDeadline("");
      setPriority("Medium");
      logAction("task_added", title);
      ue.success("Task added");
    } catch {
      ue.error("I'm having trouble adding that task. Please try again.");
    }
  };
  const handleToggle = async (id, completed) => {
    try {
      await updateCompletion.mutateAsync({ id, completed: !completed });
      ue.success(!completed ? "Task completed!" : "Task reopened");
    } catch {
      ue.error("I'm having trouble updating that task. Please try again.");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteTask.mutateAsync(id);
      ue.success("Task deleted");
    } catch {
      ue.error("I'm having trouble deleting that task. Please try again.");
    } finally {
      setDeleteTaskId(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto space-y-6 px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-8 w-8 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "glow-text font-display text-3xl font-bold", children: "Tasks & Reminders" })
      ] }),
      (overdueCount > 0 || dueTodayCount > 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          "data-ocid": "tasks.error_state",
          className: "border-destructive/50 bg-destructive/10",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 shrink-0 text-destructive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
              overdueCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-destructive", children: [
                overdueCount,
                " overdue task",
                overdueCount > 1 ? "s" : ""
              ] }),
              overdueCount > 0 && dueTodayCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-2 text-muted-foreground", children: "·" }),
              dueTodayCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-yellow-400", children: [
                dueTodayCount,
                " due today"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-muted-foreground", children: "— DJ recommends addressing these first." })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-primary/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 text-primary" }),
          " Add New Task"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "task-title", children: "Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "task-title",
                  "data-ocid": "tasks.input",
                  placeholder: "What needs to be done?",
                  value: title,
                  onChange: (e) => setTitle(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && handleAdd()
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "task-deadline", children: "Deadline" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "task-deadline",
                  "data-ocid": "tasks.input",
                  type: "datetime-local",
                  value: deadline,
                  onChange: (e) => setDeadline(e.target.value),
                  className: "[color-scheme:dark]"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "task-desc", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "task-desc",
                "data-ocid": "tasks.textarea",
                placeholder: "Optional details...",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                rows: 2
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Priority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: priority, onValueChange: setPriority, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "tasks.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Low", children: "Low" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Medium", children: "Medium" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "High", children: "High" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "tasks.primary_button",
                onClick: handleAdd,
                disabled: addTask.isPending,
                className: "shrink-0 bg-primary hover:bg-primary/80",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                  "Add Task"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: filter, onValueChange: setFilter, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { "data-ocid": "tasks.tab", className: "bg-muted/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "all", children: [
          "All (",
          tasks.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "pending", children: [
          "Pending (",
          tasks.filter((t) => !t.completed).length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "overdue", children: [
          "Overdue (",
          overdueCount,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "completed", children: [
          "Done (",
          tasks.filter((t) => t.completed).length,
          ")"
        ] })
      ] }) }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "tasks.loading_state",
          className: "py-12 text-center text-muted-foreground",
          children: "Loading tasks..."
        }
      ) : filteredTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "tasks.empty_state", className: "py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "mx-auto mb-3 h-12 w-12 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "No tasks yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Say “add task [name]” in Chat, or tap + above to create one." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredTasks.map((task, idx) => {
        const overdue = isOverdue(task);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            "data-ocid": `tasks.item.${idx + 1}`,
            className: `transition-all ${overdue ? "border-l-4 border-destructive border-l-destructive bg-destructive/5" : task.completed ? "border-muted opacity-60" : "border-primary/30 hover:border-primary/50"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-start gap-4 py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  "data-ocid": `tasks.checkbox.${idx + 1}`,
                  checked: task.completed,
                  onCheckedChange: () => handleToggle(task.id, task.completed),
                  className: "mt-0.5 border-primary"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `font-medium ${task.completed ? "text-muted-foreground line-through" : ""}`,
                      children: task.title
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: `border text-xs ${getPriorityColor(task.priority)}`,
                      children: task.priority
                    }
                  ),
                  overdue && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border border-destructive/50 bg-destructive/20 text-xs text-destructive", children: "Overdue" })
                ] }),
                task.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: task.description }),
                task.deadline && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-1 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                  new Date(
                    Number(task.deadline) / 1e6
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `ml-1 ${overdue ? "text-destructive" : "text-primary"}`,
                      children: [
                        "(",
                        formatRelativeTime(task.deadline),
                        ")"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `tasks.delete_button.${idx + 1}`,
                  variant: "ghost",
                  size: "icon",
                  onClick: () => setDeleteTaskId(task.id),
                  className: "min-h-[44px] min-w-[44px] shrink-0 text-muted-foreground hover:text-destructive",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                }
              )
            ] })
          },
          task.id.toString()
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: deleteTaskId !== null,
        onOpenChange: (open) => {
          if (!open) setDeleteTaskId(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "tasks.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this task?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This action cannot be undone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogCancel,
              {
                "data-ocid": "tasks.cancel_button",
                onClick: () => setDeleteTaskId(null),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                "data-ocid": "tasks.confirm_button",
                onClick: () => deleteTaskId !== null && handleDelete(deleteTaskId),
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                children: "Delete"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  TasksPage
};
