import { r as reactExports, j as jsxRuntimeExports, n as useActor, a4 as useQuery, p as useQueryClient, a5 as useMutation, k as ue } from "./index-D4lUgCCM.js";
import { B as Badge } from "./badge-BMXMPn3_.js";
import { c as createLucideIcon, B as Button } from "./createLucideIcon-a11X8bAo.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-BpTMTJ9f.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { L as Label } from "./label-Bf9_XisY.js";
import { S as ScrollArea } from "./scroll-area-D1D6khfo.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C5iF8xTu.js";
import { S as Skeleton } from "./skeleton-BKksus4V.js";
import { T as Textarea } from "./textarea-a_o-YPgo.js";
import { u as updateMemoryNode, s as saveMemoryNode, a as deleteMemoryNode, p as parseMemoryNodes } from "./memoryStore-Bzrl9ll5.js";
import { L as Layout, H as HudBackground, B as Brain, X } from "./Layout-y-fTRwTO.js";
import { m as motion, A as AnimatePresence } from "./proxy-CDDWEtkX.js";
import { S as Search } from "./search-CJp6NNRy.js";
import { P as Pen } from "./pen-_5-h5YDk.js";
import { T as Trash2 } from "./trash-2-BvljEyqY.js";
import "./index-DREpW-Gk.js";
import "./index-IXOTxK3N.js";
import "./index-Cj4N10C2.js";
import "./chevron-up-QZ-Q9T3F.js";
import "./check-CyKGSNZc.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
const TYPE_LABELS = {
  user_profile: "Profile",
  user_goal: "Goals",
  user_preference: "Preferences",
  fact: "Facts",
  project: "Projects",
  habit: "Habits",
  knowledge_topic: "Knowledge"
};
const TYPE_COLORS = {
  user_profile: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  user_goal: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  user_preference: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  fact: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  project: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  habit: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  knowledge_topic: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
};
const TAB_FILTERS = [
  { value: "all", label: "All" },
  { value: "user_profile", label: "Profile" },
  { value: "user_goal", label: "Goals" },
  { value: "user_preference", label: "Preferences" },
  { value: "habit", label: "Habits" },
  { value: "fact", label: "Facts" },
  { value: "project", label: "Projects" },
  { value: "knowledge_topic", label: "Knowledge" }
];
function formatDate(ms) {
  return new Date(ms).toLocaleDateString(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function ImportanceDots({ value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5", children: [1, 2, 3, 4, 5].map((dot) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Star,
    {
      className: `h-3 w-3 ${dot <= value ? "fill-cyan-400 text-cyan-400" : "text-white/20"}`
    },
    dot
  )) });
}
function useMemoryNodes() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["memoryNodes"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getMemories();
      return parseMemoryNodes(raw);
    },
    enabled: !!actor && !isFetching
  });
}
function useDeleteMemoryNode() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (backendId) => {
      if (!actor) throw new Error("Actor not available");
      await deleteMemoryNode(actor, backendId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["memoryNodes"] });
      qc.invalidateQueries({ queryKey: ["memories"] });
    }
  });
}
function useUpdateMemoryNode() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (node) => {
      if (!actor) throw new Error("Actor not available");
      await updateMemoryNode(actor, node);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["memoryNodes"] });
      qc.invalidateQueries({ queryKey: ["memories"] });
    }
  });
}
function useSaveNewMemoryNode() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Actor not available");
      return saveMemoryNode(actor, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["memoryNodes"] });
      qc.invalidateQueries({ queryKey: ["memories"] });
    }
  });
}
function EditDialog({
  node,
  onClose
}) {
  const [content, setContent] = reactExports.useState(node.content);
  const [tags, setTags] = reactExports.useState(node.tags.join(", "));
  const [importance, setImportance] = reactExports.useState(String(node.importance));
  const update = useUpdateMemoryNode();
  async function handleSave() {
    const updated = {
      ...node,
      content,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      importance: Math.min(5, Math.max(1, Number(importance))),
      lastAccessed: Date.now()
    };
    await update.mutateAsync(updated);
    ue.success("Memory updated");
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      "data-ocid": "memory.edit_dialog",
      className: "border-cyan-500/30 bg-[#0a0e1a] text-white",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-cyan-300", children: "Edit Memory" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70", children: "Content" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: content,
                onChange: (e) => setContent(e.target.value),
                className: "border-white/20 bg-white/5 text-white focus:border-cyan-400",
                rows: 3
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70", children: "Tags (comma-separated)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: tags,
                onChange: (e) => setTags(e.target.value),
                className: "border-white/20 bg-white/5 text-white focus:border-cyan-400",
                placeholder: "goal, work, health"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70", children: "Importance (1–5)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: importance, onValueChange: setImportance, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "border-white/20 bg-white/5 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "border-white/20 bg-[#0a0e1a] text-white", children: [1, 2, 3, 4, 5].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: String(v), children: [
                v,
                " ",
                v === 5 ? "— Critical" : v === 1 ? "— Low" : ""
              ] }, v)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              onClick: onClose,
              "data-ocid": "memory.cancel_button",
              className: "text-white/60 hover:text-white",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: update.isPending,
              "data-ocid": "memory.save_button",
              className: "bg-cyan-600 text-white hover:bg-cyan-500",
              children: update.isPending ? "Saving…" : "Save Changes"
            }
          )
        ] })
      ]
    }
  ) });
}
function AddMemoryDialog({ onClose }) {
  const [content, setContent] = reactExports.useState("");
  const [type, setType] = reactExports.useState("fact");
  const [tags, setTags] = reactExports.useState("");
  const [importance, setImportance] = reactExports.useState("3");
  const save = useSaveNewMemoryNode();
  async function handleSave() {
    if (!content.trim()) return;
    await save.mutateAsync({
      type,
      content: content.trim(),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      importance: Number(importance)
    });
    ue.success("Memory saved");
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "border-cyan-500/30 bg-[#0a0e1a] text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-cyan-300", children: "Add Memory" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: type,
            onValueChange: (v) => setType(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "border-white/20 bg-white/5 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "border-white/20 bg-[#0a0e1a] text-white", children: Object.entries(TYPE_LABELS).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: k, children: v }, k)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70", children: "Content" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: content,
            onChange: (e) => setContent(e.target.value),
            className: "border-white/20 bg-white/5 text-white focus:border-cyan-400",
            placeholder: "What should DJ remember?",
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70", children: "Tags (comma-separated)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: tags,
            onChange: (e) => setTags(e.target.value),
            className: "border-white/20 bg-white/5 text-white",
            placeholder: "goal, work, health"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70", children: "Importance (1–5)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: importance, onValueChange: setImportance, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "border-white/20 bg-white/5 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "border-white/20 bg-[#0a0e1a] text-white", children: [1, 2, 3, 4, 5].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(v), children: v }, v)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: onClose,
          className: "text-white/60 hover:text-white",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleSave,
          disabled: save.isPending || !content.trim(),
          className: "bg-cyan-600 text-white hover:bg-cyan-500",
          children: save.isPending ? "Saving…" : "Save Memory"
        }
      )
    ] })
  ] }) });
}
function MemoryCard({
  node,
  index,
  onEdit,
  onDelete
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const isLong = node.content.length > 100;
  const displayContent = isLong && !expanded ? `${node.content.slice(0, 100)}…` : node.content;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      "data-ocid": `memory.item.${index}`,
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, scale: 0.96 },
      transition: { duration: 0.2 },
      className: "group relative rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-colors hover:border-cyan-500/30 hover:bg-white/[0.06]",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `rounded-full border px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[node.type]}`,
              children: TYPE_LABELS[node.type]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ImportanceDots, { value: node.importance })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-3 text-sm leading-relaxed text-white/80", children: [
          displayContent,
          isLong && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setExpanded((v) => !v),
              className: "ml-1 text-xs text-cyan-400 hover:text-cyan-300",
              children: expanded ? "less" : "more"
            }
          )
        ] }),
        node.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex flex-wrap gap-1", children: node.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "border-white/20 px-1.5 py-0 text-[10px] text-white/50",
            children: tag
          },
          tag
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-white/30", children: formatDate(node.createdAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 opacity-0 transition-opacity group-hover:opacity-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                onClick: () => onEdit(node),
                "data-ocid": `memory.edit_button.${index}`,
                className: "h-7 w-7 text-white/40 hover:text-cyan-300",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                onClick: () => onDelete(node),
                "data-ocid": `memory.delete_button.${index}`,
                className: "h-7 w-7 text-white/40 hover:text-rose-400",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function DeleteConfirm({
  node,
  onConfirm,
  onCancel,
  isPending
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "border-rose-500/30 bg-[#0a0e1a] text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-rose-300", children: "Delete Memory?" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-white/60", children: [
      "This will permanently remove the memory:",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
        '"',
        node.content.slice(0, 80),
        node.content.length > 80 ? "…" : "",
        '"'
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: onCancel,
          "data-ocid": "memory.cancel_button",
          className: "text-white/60 hover:text-white",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onConfirm,
          disabled: isPending,
          "data-ocid": "memory.confirm_button",
          className: "bg-rose-600 text-white hover:bg-rose-500",
          children: isPending ? "Deleting…" : "Delete"
        }
      )
    ] })
  ] }) });
}
function MemoryPage() {
  const { data: nodes = [], isLoading, isError } = useMemoryNodes();
  const deleteNode = useDeleteMemoryNode();
  const [search, setSearch] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [editingNode, setEditingNode] = reactExports.useState(null);
  const [deletingNode, setDeletingNode] = reactExports.useState(null);
  const [showAddDialog, setShowAddDialog] = reactExports.useState(false);
  const filtered = reactExports.useMemo(() => {
    let result = nodes;
    if (activeTab !== "all") {
      result = result.filter((n) => n.type === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) => n.content.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [nodes, activeTab, search]);
  async function handleDelete() {
    if (!(deletingNode == null ? void 0 : deletingNode.backendId)) return;
    await deleteNode.mutateAsync(deletingNode.backendId);
    ue.success("Memory deleted");
    setDeletingNode(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HudBackground, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 mx-auto max-w-4xl px-4 py-6 pb-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: -16 },
          animate: { opacity: 1, y: 0 },
          className: "mb-8",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-5 w-5 text-cyan-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-wide text-white", children: "Memory Graph" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-white/40", children: [
                nodes.length,
                " stored",
                " ",
                nodes.length === 1 ? "memory" : "memories"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => setShowAddDialog(true),
                className: "ml-auto bg-cyan-600/80 text-white hover:bg-cyan-500",
                "data-ocid": "memory.primary_button",
                children: "+ Add Memory"
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 shrink-0 text-white/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search memories…",
            "data-ocid": "memory.search_input",
            className: "w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
          }
        ),
        search && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSearch(""),
            className: "text-white/30 hover:text-white",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "mb-6 pb-1", style: { overflowX: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: TAB_FILTERS.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "memory.tab",
          onClick: () => setActiveTab(value),
          className: `shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all ${activeTab === value ? "border-cyan-500/60 bg-cyan-500/20 text-cyan-300" : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"}`,
          children: label
        },
        value
      )) }) }),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "memory.loading_state",
          className: "grid gap-3 sm:grid-cols-2",
          children: [1, 2, 3, 4, 5, 6].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 rounded-xl bg-white/5" }, n))
        }
      ),
      isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "memory.error_state",
          className: "rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-rose-300",
          children: "Failed to load memories. Please try again."
        }
      ),
      !isLoading && !isError && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          "data-ocid": "memory.empty_state",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "py-20 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "h-8 w-8 text-white/20" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 text-lg font-medium text-white/40", children: search || activeTab !== "all" ? "No memories match" : "No memories yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/20", children: search || activeTab !== "all" ? "Try a different search or filter" : `Teach DJ by chatting — say "DJ remember I'm a developer"` })
          ]
        }
      ),
      !isLoading && !isError && filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: filtered.map((node, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        MemoryCard,
        {
          node,
          index: i + 1,
          onEdit: setEditingNode,
          onDelete: setDeletingNode
        },
        node.id
      )) }) })
    ] }),
    editingNode && /* @__PURE__ */ jsxRuntimeExports.jsx(EditDialog, { node: editingNode, onClose: () => setEditingNode(null) }),
    deletingNode && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirm,
      {
        node: deletingNode,
        onConfirm: handleDelete,
        onCancel: () => setDeletingNode(null),
        isPending: deleteNode.isPending
      }
    ),
    showAddDialog && /* @__PURE__ */ jsxRuntimeExports.jsx(AddMemoryDialog, { onClose: () => setShowAddDialog(false) })
  ] }) });
}
export {
  MemoryPage
};
