import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Brain, Circle, Edit2, Search, Star, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { MemoryNode, MemoryType } from "../assistant/memory/memoryGraph";
import {
  deleteMemoryNode,
  parseMemoryNodes,
  saveMemoryNode,
  updateMemoryNode,
} from "../assistant/memory/memoryStore";
import { HudBackground } from "../components/HudBackground";
import { Layout } from "../components/Layout";
import { useActor } from "../hooks/useActor";

// ── Type helpers ──────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<MemoryType, string> = {
  user_profile: "Profile",
  user_goal: "Goals",
  user_preference: "Preferences",
  fact: "Facts",
  project: "Projects",
  habit: "Habits",
  knowledge_topic: "Knowledge",
};

const TYPE_COLORS: Record<MemoryType, string> = {
  user_profile: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  user_goal: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  user_preference: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  fact: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  project: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  habit: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  knowledge_topic: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

const TAB_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "user_profile", label: "Profile" },
  { value: "user_goal", label: "Goals" },
  { value: "user_preference", label: "Preferences" },
  { value: "habit", label: "Habits" },
  { value: "fact", label: "Facts" },
  { value: "project", label: "Projects" },
  { value: "knowledge_topic", label: "Knowledge" },
];

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ImportanceDots({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((dot) => (
        <Star
          key={dot}
          className={`h-3 w-3 ${dot <= value ? "fill-cyan-400 text-cyan-400" : "text-white/20"}`}
        />
      ))}
    </div>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useMemoryNodes() {
  const { actor, isFetching } = useActor();
  return useQuery<MemoryNode[]>({
    queryKey: ["memoryNodes"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await (actor as any).getMemories();
      return parseMemoryNodes(raw);
    },
    enabled: !!actor && !isFetching,
  });
}

function useDeleteMemoryNode() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (backendId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await deleteMemoryNode(actor, backendId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["memoryNodes"] });
      qc.invalidateQueries({ queryKey: ["memories"] });
    },
  });
}

function useUpdateMemoryNode() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (node: MemoryNode) => {
      if (!actor) throw new Error("Actor not available");
      await updateMemoryNode(actor, node);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["memoryNodes"] });
      qc.invalidateQueries({ queryKey: ["memories"] });
    },
  });
}

function useSaveNewMemoryNode() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Omit<
        MemoryNode,
        "id" | "backendId" | "createdAt" | "lastAccessed" | "archived"
      >,
    ) => {
      if (!actor) throw new Error("Actor not available");
      return saveMemoryNode(actor, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["memoryNodes"] });
      qc.invalidateQueries({ queryKey: ["memories"] });
    },
  });
}

// ── Edit Dialog ───────────────────────────────────────────────────────────────

function EditDialog({
  node,
  onClose,
}: {
  node: MemoryNode;
  onClose: () => void;
}) {
  const [content, setContent] = useState(node.content);
  const [tags, setTags] = useState(node.tags.join(", "));
  const [importance, setImportance] = useState(String(node.importance));
  const update = useUpdateMemoryNode();

  async function handleSave() {
    const updated: MemoryNode = {
      ...node,
      content,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      importance: Math.min(5, Math.max(1, Number(importance))),
      lastAccessed: Date.now(),
    };
    await update.mutateAsync(updated);
    toast.success("Memory updated");
    onClose();
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="memory.edit_dialog"
        className="border-cyan-500/30 bg-[#0a0e1a] text-white"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-cyan-300">
            Edit Memory
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-white/70">Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-white/20 bg-white/5 text-white focus:border-cyan-400"
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70">Tags (comma-separated)</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border-white/20 bg-white/5 text-white focus:border-cyan-400"
              placeholder="goal, work, health"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70">Importance (1–5)</Label>
            <Select value={importance} onValueChange={setImportance}>
              <SelectTrigger className="border-white/20 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/20 bg-[#0a0e1a] text-white">
                {[1, 2, 3, 4, 5].map((v) => (
                  <SelectItem key={v} value={String(v)}>
                    {v} {v === 5 ? "— Critical" : v === 1 ? "— Low" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            data-ocid="memory.cancel_button"
            className="text-white/60 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={update.isPending}
            data-ocid="memory.save_button"
            className="bg-cyan-600 text-white hover:bg-cyan-500"
          >
            {update.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Add Dialog ────────────────────────────────────────────────────────────────

function AddMemoryDialog({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState("");
  const [type, setType] = useState<MemoryType>("fact");
  const [tags, setTags] = useState("");
  const [importance, setImportance] = useState("3");
  const save = useSaveNewMemoryNode();

  async function handleSave() {
    if (!content.trim()) return;
    await save.mutateAsync({
      type,
      content: content.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      importance: Number(importance),
    });
    toast.success("Memory saved");
    onClose();
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-cyan-500/30 bg-[#0a0e1a] text-white">
        <DialogHeader>
          <DialogTitle className="font-display text-cyan-300">
            Add Memory
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-white/70">Type</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as MemoryType)}
            >
              <SelectTrigger className="border-white/20 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/20 bg-[#0a0e1a] text-white">
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70">Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-white/20 bg-white/5 text-white focus:border-cyan-400"
              placeholder="What should DJ remember?"
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70">Tags (comma-separated)</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border-white/20 bg-white/5 text-white"
              placeholder="goal, work, health"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70">Importance (1–5)</Label>
            <Select value={importance} onValueChange={setImportance}>
              <SelectTrigger className="border-white/20 bg-white/5 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/20 bg-[#0a0e1a] text-white">
                {[1, 2, 3, 4, 5].map((v) => (
                  <SelectItem key={v} value={String(v)}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={save.isPending || !content.trim()}
            className="bg-cyan-600 text-white hover:bg-cyan-500"
          >
            {save.isPending ? "Saving…" : "Save Memory"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Memory Card ───────────────────────────────────────────────────────────────

function MemoryCard({
  node,
  index,
  onEdit,
  onDelete,
}: {
  node: MemoryNode;
  index: number;
  onEdit: (n: MemoryNode) => void;
  onDelete: (n: MemoryNode) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = node.content.length > 100;
  const displayContent =
    isLong && !expanded ? `${node.content.slice(0, 100)}…` : node.content;

  return (
    <motion.div
      data-ocid={`memory.item.${index}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-colors hover:border-cyan-500/30 hover:bg-white/[0.06]"
    >
      {/* Type badge + importance */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[node.type]}`}
        >
          {TYPE_LABELS[node.type]}
        </span>
        <ImportanceDots value={node.importance} />
      </div>

      {/* Content */}
      <p className="mb-3 text-sm leading-relaxed text-white/80">
        {displayContent}
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="ml-1 text-xs text-cyan-400 hover:text-cyan-300"
          >
            {expanded ? "less" : "more"}
          </button>
        )}
      </p>

      {/* Tags */}
      {node.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {node.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-white/20 px-1.5 py-0 text-[10px] text-white/50"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-white/30">
          {formatDate(node.createdAt)}
        </span>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(node)}
            data-ocid={`memory.edit_button.${index}`}
            className="h-7 w-7 text-white/40 hover:text-cyan-300"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(node)}
            data-ocid={`memory.delete_button.${index}`}
            className="h-7 w-7 text-white/40 hover:text-rose-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteConfirm({
  node,
  onConfirm,
  onCancel,
  isPending,
}: {
  node: MemoryNode;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog open onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="border-rose-500/30 bg-[#0a0e1a] text-white">
        <DialogHeader>
          <DialogTitle className="text-rose-300">Delete Memory?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-white/60">
          This will permanently remove the memory:{" "}
          <span className="text-white">
            "{node.content.slice(0, 80)}
            {node.content.length > 80 ? "…" : ""}"
          </span>
        </p>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            data-ocid="memory.cancel_button"
            className="text-white/60 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            data-ocid="memory.confirm_button"
            className="bg-rose-600 text-white hover:bg-rose-500"
          >
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function MemoryPage() {
  const { data: nodes = [], isLoading, isError } = useMemoryNodes();
  const deleteNode = useDeleteMemoryNode();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [editingNode, setEditingNode] = useState<MemoryNode | null>(null);
  const [deletingNode, setDeletingNode] = useState<MemoryNode | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filtered = useMemo(() => {
    let result = nodes;
    if (activeTab !== "all") {
      result = result.filter((n) => n.type === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [nodes, activeTab, search]);

  async function handleDelete() {
    if (!deletingNode?.backendId) return;
    await deleteNode.mutateAsync(deletingNode.backendId);
    toast.success("Memory deleted");
    setDeletingNode(null);
  }

  return (
    <Layout>
      <div className="relative min-h-screen">
        <HudBackground />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-6 pb-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10">
                <Brain className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-wide text-white">
                  Memory Graph
                </h1>
                <p className="text-sm text-white/40">
                  {nodes.length} stored{" "}
                  {nodes.length === 1 ? "memory" : "memories"}
                </p>
              </div>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="ml-auto bg-cyan-600/80 text-white hover:bg-cyan-500"
                data-ocid="memory.primary_button"
              >
                + Add Memory
              </Button>
            </div>
          </motion.div>

          {/* Search */}
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search memories…"
              data-ocid="memory.search_input"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-white/30 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <ScrollArea className="mb-6 pb-1" style={{ overflowX: "auto" }}>
            <div className="flex gap-2">
              {TAB_FILTERS.map(({ value, label }) => (
                <button
                  type="button"
                  key={value}
                  data-ocid="memory.tab"
                  onClick={() => setActiveTab(value)}
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    activeTab === value
                      ? "border-cyan-500/60 bg-cyan-500/20 text-cyan-300"
                      : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* Content */}
          {isLoading && (
            <div
              data-ocid="memory.loading_state"
              className="grid gap-3 sm:grid-cols-2"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Skeleton key={n} className="h-36 rounded-xl bg-white/5" />
              ))}
            </div>
          )}

          {isError && (
            <div
              data-ocid="memory.error_state"
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-rose-300"
            >
              Failed to load memories. Please try again.
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <motion.div
              data-ocid="memory.empty_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <Brain className="h-8 w-8 text-white/20" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-white/40">
                {search || activeTab !== "all"
                  ? "No memories match"
                  : "No memories yet"}
              </h3>
              <p className="text-sm text-white/20">
                {search || activeTab !== "all"
                  ? "Try a different search or filter"
                  : 'Teach DJ by chatting — say "DJ remember I\'m a developer"'}
              </p>
            </motion.div>
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <AnimatePresence mode="popLayout">
              <div className="grid gap-3 sm:grid-cols-2">
                {filtered.map((node, i) => (
                  <MemoryCard
                    key={node.id}
                    node={node}
                    index={i + 1}
                    onEdit={setEditingNode}
                    onDelete={setDeletingNode}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Dialogs */}
        {editingNode && (
          <EditDialog node={editingNode} onClose={() => setEditingNode(null)} />
        )}
        {deletingNode && (
          <DeleteConfirm
            node={deletingNode}
            onConfirm={handleDelete}
            onCancel={() => setDeletingNode(null)}
            isPending={deleteNode.isPending}
          />
        )}
        {showAddDialog && (
          <AddMemoryDialog onClose={() => setShowAddDialog(false)} />
        )}
      </div>
    </Layout>
  );
}
