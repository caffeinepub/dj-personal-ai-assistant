import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Edit3,
  FileText,
  FileType,
  Folder,
  FolderOpen,
  Globe,
  Layers,
  Link,
  Loader2,
  Plus,
  Presentation,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  Wand2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import type { KnowledgeFolder } from "../hooks/useQueries";
import {
  useAddMemory,
  useCreateKnowledgeFolder,
  useDeleteKnowledgeFolder,
  useDeleteMemory,
  useKnowledgeFolders,
  useMemories,
  useSaveWikiPage,
  useWikiPageByFolder,
} from "../hooks/useQueries";
import {
  type KnowledgeSource,
  encodeKnowledgeSource,
  extractTextFromHtml,
  parseKnowledgeSource,
  searchKnowledgeSources,
} from "../utils/knowledgeSources";

const PRESET_CATEGORIES = [
  "Work",
  "Personal",
  "Technical",
  "Research",
  "Other",
];

type UploadState =
  | { stage: "idle" }
  | { stage: "reading" }
  | {
      stage: "review";
      filename: string;
      extractedText: string;
      fileType: string;
    }
  | { stage: "saving" };

type SummaryCard = {
  title: string;
  summary: string;
  sourceType: string;
  category: string;
} | null;

// ─── Utility Components ───────────────────────────────────────────────────────

function SourceTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "website":
      return <Globe className="h-4 w-4" />;
    case "pdf":
      return <FileText className="h-4 w-4" />;
    case "word":
      return <FileType className="h-4 w-4" />;
    case "pptx":
      return <Presentation className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

function SourceTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    website: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    pdf: "bg-red-500/20 text-red-300 border-red-500/40",
    word: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    pptx: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    txt: "bg-green-500/20 text-green-300 border-green-500/40",
  };
  const labels: Record<string, string> = {
    website: "Website",
    pdf: "PDF",
    word: "Word",
    pptx: "PowerPoint",
    txt: "Text",
  };
  const cls =
    styles[type] || "bg-muted/20 text-muted-foreground border-muted/40";
  return (
    <Badge
      className={`flex items-center gap-1 border text-xs font-medium ${cls}`}
    >
      <SourceTypeIcon type={type} />
      {labels[type] || type.toUpperCase()}
    </Badge>
  );
}

function CategorySelector({
  value,
  onChange,
  allCategories,
  onAddCustom,
}: {
  value: string;
  onChange: (v: string) => void;
  allCategories: string[];
  onAddCustom: (name: string) => void;
}) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const handleAdd = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    onAddCustom(trimmed);
    onChange(trimmed);
    setCustomInput("");
    setShowCustomInput(false);
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1.5">
        <Tag className="h-3.5 w-3.5" />
        Category
      </Label>
      <Select
        value={value}
        onValueChange={(v) => {
          if (v === "__custom__") {
            setShowCustomInput(true);
          } else {
            onChange(v);
            setShowCustomInput(false);
          }
        }}
      >
        <SelectTrigger
          data-ocid="knowledge.category_select"
          className="border-primary/30 bg-card/50"
        >
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="border-primary/30 bg-card">
          {allCategories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
          <SelectItem value="__custom__" className="text-primary">
            <span className="flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add custom category...
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
      {showCustomInput && (
        <div className="flex gap-2">
          <Input
            data-ocid="knowledge.custom_category_input"
            placeholder="New category name"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="border-primary/30 bg-card/50 text-sm"
            autoFocus
          />
          <Button
            data-ocid="knowledge.custom_category_button"
            size="sm"
            onClick={handleAdd}
            disabled={!customInput.trim()}
            className="shrink-0 bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setShowCustomInput(false);
              setCustomInput("");
            }}
            className="shrink-0 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Folder Picker ────────────────────────────────────────────────────────────

function FolderPicker({
  folders,
  value,
  onChange,
}: {
  folders: KnowledgeFolder[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const buildPath = (id: bigint): string => {
    const folder = folders.find((f) => f.id === id);
    if (!folder) return "";
    if (folder.parentId === null) return folder.name;
    return `${buildPath(folder.parentId)} > ${folder.name}`;
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1.5">
        <Folder className="h-3.5 w-3.5" />
        Save to Folder
      </Label>
      <Select
        value={value ?? "__root__"}
        onValueChange={(v) => onChange(v === "__root__" ? null : v)}
      >
        <SelectTrigger
          data-ocid="knowledge.folder_select"
          className="border-primary/30 bg-card/50"
        >
          <SelectValue placeholder="No folder (root)" />
        </SelectTrigger>
        <SelectContent className="border-primary/30 bg-card">
          <SelectItem value="__root__">No folder (root)</SelectItem>
          {folders.map((f) => (
            <SelectItem key={String(f.id)} value={String(f.id)}>
              {buildPath(f.id)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Folder Tree ──────────────────────────────────────────────────────────────

type FolderNode = KnowledgeFolder & { children: FolderNode[] };

function buildTree(folders: KnowledgeFolder[]): FolderNode[] {
  const map = new Map<string, FolderNode>();
  for (const f of folders) {
    map.set(String(f.id), { ...f, children: [] });
  }
  const roots: FolderNode[] = [];
  for (const node of map.values()) {
    if (node.parentId === null) {
      roots.push(node);
    } else {
      const parent = map.get(String(node.parentId));
      if (parent) parent.children.push(node);
      else roots.push(node);
    }
  }
  return roots;
}

function FolderTreeNode({
  node,
  depth,
  selectedFolderId,
  onSelect,
  onDelete,
  sourceCounts,
}: {
  node: FolderNode;
  depth: number;
  selectedFolderId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: bigint, name: string) => void;
  sourceCounts: Record<string, number>;
}) {
  const [expanded, setExpanded] = useState(true);
  const isSelected = selectedFolderId === String(node.id);
  const count = sourceCounts[String(node.id)] ?? 0;
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div
        className={`group flex items-center gap-1 rounded-lg px-2 py-1.5 transition-all cursor-pointer ${
          isSelected
            ? "bg-primary/20 border border-primary/50 text-primary"
            : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className="shrink-0 rounded p-0.5 hover:bg-white/10"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}

        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-1.5"
          onClick={() => onSelect(String(node.id))}
        >
          {isSelected ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
          ) : (
            <Folder className="h-4 w-4 shrink-0" />
          )}
          <span className="truncate text-sm font-medium">{node.name}</span>
          {count > 0 && (
            <Badge className="ml-auto shrink-0 border-primary/30 bg-primary/10 text-primary text-xs">
              {count}
            </Badge>
          )}
        </button>

        <button
          type="button"
          data-ocid="knowledge.folder.delete_button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id, node.name);
          }}
          className="ml-1 shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-all hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100"
          title={`Delete "${node.name}"`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {hasChildren && expanded && (
        <div>
          {node.children.map((child) => (
            <FolderTreeNode
              key={String(child.id)}
              node={child}
              depth={depth + 1}
              selectedFolderId={selectedFolderId}
              onSelect={onSelect}
              onDelete={onDelete}
              sourceCounts={sourceCounts}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FolderTree({
  folders,
  selectedFolderId,
  onSelect,
  onDelete,
  onCreate,
  sourceCounts,
}: {
  folders: KnowledgeFolder[];
  selectedFolderId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: bigint, name: string) => void;
  onCreate: (name: string, parentId: bigint | null) => void;
  sourceCounts: Record<string, number>;
}) {
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderParent, setNewFolderParent] = useState<string>("__root__");
  const tree = buildTree(folders);

  const handleCreate = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const parentId =
      newFolderParent === "__root__" ? null : BigInt(newFolderParent);
    onCreate(name, parentId);
    setNewFolderName("");
    setNewFolderParent("__root__");
    setShowNewFolder(false);
  };

  return (
    <div className="space-y-1">
      {/* All Sources */}
      <button
        type="button"
        data-ocid="knowledge.all_sources.button"
        onClick={() => onSelect(null)}
        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
          selectedFolderId === null
            ? "bg-primary/20 border border-primary/50 text-primary"
            : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
        }`}
      >
        <Layers className="h-4 w-4 shrink-0" />
        <span>All Sources</span>
        <Badge className="ml-auto border-primary/30 bg-primary/10 text-primary text-xs">
          {Object.values(sourceCounts).reduce((a, b) => a + b, 0)}
        </Badge>
      </button>

      {/* Folder tree */}
      {tree.length === 0 && (
        <p className="px-3 py-2 text-xs text-muted-foreground/60">
          No folders yet
        </p>
      )}
      {tree.map((node) => (
        <FolderTreeNode
          key={String(node.id)}
          node={node}
          depth={0}
          selectedFolderId={selectedFolderId}
          onSelect={onSelect}
          onDelete={onDelete}
          sourceCounts={sourceCounts}
        />
      ))}

      {/* New Folder */}
      {showNewFolder ? (
        <div className="mt-2 space-y-2 rounded-lg border border-primary/30 bg-card/50 p-3">
          <Input
            data-ocid="knowledge.new_folder.input"
            autoFocus
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="border-primary/30 bg-background/50 text-sm h-8"
          />
          {folders.length > 0 && (
            <Select value={newFolderParent} onValueChange={setNewFolderParent}>
              <SelectTrigger className="border-primary/30 bg-background/50 text-xs h-8">
                <SelectValue placeholder="Parent folder (optional)" />
              </SelectTrigger>
              <SelectContent className="border-primary/30 bg-card">
                <SelectItem value="__root__">No parent (root)</SelectItem>
                {folders.map((f) => (
                  <SelectItem key={String(f.id)} value={String(f.id)}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="flex gap-2">
            <Button
              data-ocid="knowledge.new_folder.submit_button"
              size="sm"
              onClick={handleCreate}
              disabled={!newFolderName.trim()}
              className="flex-1 h-7 text-xs bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30"
            >
              Create
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowNewFolder(false);
                setNewFolderName("");
              }}
              className="h-7 text-xs text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          data-ocid="knowledge.new_folder.button"
          onClick={() => setShowNewFolder(true)}
          className="mt-1 flex w-full items-center gap-2 rounded-lg border border-dashed border-primary/30 px-3 py-1.5 text-xs text-primary/60 transition-all hover:border-primary/60 hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          New Folder
        </button>
      )}
    </div>
  );
}

// ─── Wiki Page Component ──────────────────────────────────────────────────────

function WikiPageEditor({
  folderId,
  folderName,
  sources,
}: {
  folderId: bigint;
  folderName: string;
  sources: KnowledgeSource[];
}) {
  const { data: existingWiki, isLoading } = useWikiPageByFolder(folderId);
  const saveWiki = useSaveWikiPage();

  const [overview, setOverview] = useState("");
  const [keyConcepts, setKeyConcepts] = useState("");
  const [tips, setTips] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (existingWiki) {
      setOverview(existingWiki.overviewSection);
      setKeyConcepts(existingWiki.keyConceptsSection);
      setTips(existingWiki.tipsSection);
      setIsDirty(false);
    }
  }, [existingWiki]);

  const generateFromSources = () => {
    if (sources.length === 0) {
      toast.error("Add some sources to this folder first");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      // Overview: synthesize from titles and summaries
      const titles = sources.map((s) => s.title).join(", ");
      const summaries = sources
        .map((s) => s.summary || s.content.slice(0, 150))
        .filter(Boolean)
        .join(" ");
      const generatedOverview = `This folder contains ${sources.length} source${sources.length !== 1 ? "s" : ""} related to ${folderName}. Key resources include: ${titles}. ${summaries.slice(0, 300)}`;

      // Key concepts: extract key terms from content
      const allText = sources
        .map((s) => `${s.title} ${s.summary} ${s.content.slice(0, 500)}`)
        .join(" ")
        .toLowerCase();
      const stopWords = new Set([
        "the",
        "a",
        "an",
        "and",
        "or",
        "but",
        "in",
        "on",
        "at",
        "to",
        "for",
        "of",
        "with",
        "is",
        "are",
        "was",
        "were",
        "be",
        "been",
        "has",
        "have",
        "had",
        "do",
        "does",
        "did",
        "this",
        "that",
        "it",
        "its",
        "as",
        "by",
        "from",
        "can",
        "will",
        "not",
        "no",
        "so",
        "if",
      ]);
      const words = allText.match(/\b[a-z][a-z]{3,}\b/g) ?? [];
      const freq = new Map<string, number>();
      for (const w of words) {
        if (!stopWords.has(w)) freq.set(w, (freq.get(w) ?? 0) + 1);
      }
      const topTerms = [...freq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([w]) => `• ${w.charAt(0).toUpperCase() + w.slice(1)}`);

      // Source-title-based concepts
      const sourceConcepts = sources.map((s) => `• ${s.title}`);
      const allConcepts = [...sourceConcepts, ...topTerms].slice(0, 12);
      const generatedKeyConcepts = allConcepts.join("\n");

      // Tips: extract from summaries
      const tipLines = sources
        .flatMap((s) => {
          const sentences = (s.summary || s.content.slice(0, 400))
            .split(/[.!?]/)
            .map((s) => s.trim())
            .filter((s) => s.length > 30);
          return sentences.slice(0, 2).map((t) => `• ${t}.`);
        })
        .slice(0, 6);
      const generatedTips =
        tipLines.length > 0
          ? tipLines.join("\n")
          : `• Review all ${sources.length} sources in this folder for comprehensive knowledge.\n• Use DJ's chat to ask questions about ${folderName} — it will reference these sources.`;

      setOverview(generatedOverview);
      setKeyConcepts(generatedKeyConcepts);
      setTips(generatedTips);
      setIsDirty(true);
      setIsGenerating(false);
      toast.success("Wiki page generated from sources");
    }, 800);
  };

  const handleSave = async () => {
    try {
      await saveWiki.mutateAsync({ folderId, overview, keyConcepts, tips });
      setIsDirty(false);
      toast.success("Wiki page saved");
    } catch {
      toast.error("Failed to save wiki page");
    }
  };

  if (isLoading) {
    return (
      <div
        data-ocid="knowledge.wiki.loading_state"
        className="flex items-center justify-center py-16"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            Auto-generated from {sources.length} source
            {sources.length !== 1 ? "s" : ""} · editable
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            data-ocid="knowledge.wiki.generate_button"
            size="sm"
            onClick={generateFromSources}
            disabled={isGenerating || sources.length === 0}
            className="border border-secondary/40 bg-secondary/10 text-secondary hover:bg-secondary/20"
          >
            {isGenerating ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Wand2 className="mr-1.5 h-3.5 w-3.5" />
            )}
            Generate from Sources
          </Button>
          <Button
            data-ocid="knowledge.wiki.save_button"
            size="sm"
            onClick={handleSave}
            disabled={
              saveWiki.isPending || (!overview && !keyConcepts && !tips)
            }
            className={`border ${
              isDirty
                ? "border-primary/60 bg-primary/20 text-primary hover:bg-primary/30"
                : "border-primary/30 bg-primary/10 text-primary/70 hover:bg-primary/20"
            }`}
          >
            {saveWiki.isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Edit3 className="mr-1.5 h-3.5 w-3.5" />
            )}
            Save Wiki Page
          </Button>
        </div>
      </div>

      {/* Overview */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-primary/20 text-primary text-xs">
            ①
          </span>
          Overview
        </Label>
        <Textarea
          data-ocid="knowledge.wiki.overview.textarea"
          placeholder="Write a 2-3 sentence overview of what this folder is about..."
          value={overview}
          onChange={(e) => {
            setOverview(e.target.value);
            setIsDirty(true);
          }}
          rows={4}
          className="border-primary/30 bg-card/50 text-sm resize-none focus:border-primary/70"
        />
      </div>

      {/* Key Concepts */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-secondary/20 text-secondary text-xs">
            ②
          </span>
          Key Concepts
        </Label>
        <Textarea
          data-ocid="knowledge.wiki.key_concepts.textarea"
          placeholder="List key terms, concepts, and topics (one per line, use • for bullets)..."
          value={keyConcepts}
          onChange={(e) => {
            setKeyConcepts(e.target.value);
            setIsDirty(true);
          }}
          rows={6}
          className="border-primary/30 bg-card/50 text-sm resize-none font-mono focus:border-primary/70"
        />
      </div>

      {/* Tips */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-accent/20 text-accent text-xs">
            ③
          </span>
          Tips
        </Label>
        <Textarea
          data-ocid="knowledge.wiki.tips.textarea"
          placeholder="Practical tips, best practices, and insights from your sources..."
          value={tips}
          onChange={(e) => {
            setTips(e.target.value);
            setIsDirty(true);
          }}
          rows={5}
          className="border-primary/30 bg-card/50 text-sm resize-none focus:border-primary/70"
        />
      </div>

      {!overview && !keyConcepts && !tips && (
        <div
          data-ocid="knowledge.wiki.empty_state"
          className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/30 py-10 text-center"
        >
          <BookOpen className="h-10 w-10 text-primary/30" />
          <div>
            <p className="font-medium text-muted-foreground">
              No wiki page yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground/60">
              Click "Generate from Sources" to auto-fill, then edit and save.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Folder Breadcrumb ────────────────────────────────────────────────────────

function FolderBreadcrumb({
  folderId,
  folders,
  onNavigate,
}: {
  folderId: string;
  folders: KnowledgeFolder[];
  onNavigate: (id: string | null) => void;
}) {
  const buildPath = (id: string): KnowledgeFolder[] => {
    const folder = folders.find((f) => String(f.id) === id);
    if (!folder) return [];
    if (folder.parentId === null) return [folder];
    return [...buildPath(String(folder.parentId)), folder];
  };

  const path = buildPath(folderId);

  return (
    <div className="flex flex-wrap items-center gap-1 text-sm">
      <button
        type="button"
        onClick={() => onNavigate(null)}
        className="text-muted-foreground transition-colors hover:text-primary"
      >
        All Sources
      </button>
      {path.map((folder) => (
        <div key={String(folder.id)} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <button
            type="button"
            onClick={() => onNavigate(String(folder.id))}
            className={`transition-colors ${
              String(folder.id) === folderId
                ? "font-semibold text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {folder.name}
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Source Card ──────────────────────────────────────────────────────────────

function SourceCard({
  source,
  onDelete,
  index,
}: {
  source: KnowledgeSource;
  onDelete: (id: bigint, title: string) => void;
  index: number;
}) {
  const formatTs = (ts: bigint) => {
    const d = new Date(Number(ts) / 1_000_000);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      data-ocid={`knowledge.sources.item.${index}`}
      className="group relative flex items-start gap-3 rounded-xl border border-primary/20 bg-card/50 p-4 transition-all hover:border-primary/40 hover:bg-card/80"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
        <SourceTypeIcon type={source.sourceType} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start gap-2">
          <p className="font-semibold text-sm text-foreground truncate flex-1">
            {source.title}
          </p>
          <SourceTypeBadge type={source.sourceType} />
          {source.category && (
            <Badge className="border-secondary/30 bg-secondary/10 text-secondary text-xs">
              {source.category}
            </Badge>
          )}
        </div>
        {source.url && (
          <p className="mt-0.5 text-xs text-muted-foreground/60 truncate">
            {source.url}
          </p>
        )}
        {source.summary && (
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
            {source.summary}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground/50">
          {formatTs(source.timestamp)}
        </p>
      </div>
      <button
        type="button"
        data-ocid={`knowledge.sources.delete_button.${index}`}
        onClick={() => onDelete(source.id, source.title)}
        className="ml-1 shrink-0 rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100"
        title="Remove from memory"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Delete Folder Dialog ─────────────────────────────────────────────────────

function DeleteFolderDialog({
  folderName,
  open,
  onConfirm,
  onCancel,
}: {
  folderName: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent
        data-ocid="knowledge.delete_folder.dialog"
        className="border-primary/30 bg-card"
      >
        <DialogHeader>
          <DialogTitle className="font-display">Delete Folder</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Delete <strong className="text-foreground">"{folderName}"</strong>?
          Sources inside won't be deleted, but they'll no longer be organized
          under this folder.
        </p>
        <DialogFooter className="gap-2">
          <Button
            data-ocid="knowledge.delete_folder.cancel_button"
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            data-ocid="knowledge.delete_folder.confirm_button"
            onClick={onConfirm}
            className="bg-destructive/20 border border-destructive/40 text-destructive hover:bg-destructive/30"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add Source Form ──────────────────────────────────────────────────────────

function AddSourceForm({
  allCategories,
  folders,
  onAddCustomCategory,
  defaultFolderId,
}: {
  allCategories: string[];
  folders: KnowledgeFolder[];
  onAddCustomCategory: (name: string) => void;
  defaultFolderId: string | null;
}) {
  const addMemory = useAddMemory();
  const [tab, setTab] = useState<"website" | "file">("website");

  // Website
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteTitle, setWebsiteTitle] = useState("");
  const [websiteContent, setWebsiteContent] = useState("");
  const [websiteCategory, setWebsiteCategory] = useState("General");
  const [websiteFolderId, setWebsiteFolderId] = useState<string | null>(
    defaultFolderId,
  );
  const [showManualPaste, setShowManualPaste] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  // File
  const [uploadState, setUploadState] = useState<UploadState>({
    stage: "idle",
  });
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [fileCategory, setFileCategory] = useState("General");
  const [fileFolderId, setFileFolderId] = useState<string | null>(
    defaultFolderId,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Summary card
  const [lastSaved, setLastSaved] = useState<SummaryCard>(null);

  // Sync default folder when it changes
  useEffect(() => {
    setWebsiteFolderId(defaultFolderId);
    setFileFolderId(defaultFolderId);
  }, [defaultFolderId]);

  const handleFetchWebsite = async () => {
    if (!websiteUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    let url = websiteUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://"))
      url = `https://${url}`;
    setIsFetchingUrl(true);
    setShowManualPaste(false);
    setWebsiteContent("");
    try {
      const resp = await fetch(url);
      const html = await resp.text();
      const text = extractTextFromHtml(html);
      setWebsiteContent(text.slice(0, 2000));
      if (!websiteTitle.trim()) {
        try {
          setWebsiteTitle(new URL(url).hostname);
        } catch {
          setWebsiteTitle(url);
        }
      }
      toast.success("Website content fetched");
    } catch {
      setShowManualPaste(true);
      if (!websiteTitle.trim()) {
        try {
          setWebsiteTitle(new URL(url).hostname);
        } catch {
          setWebsiteTitle(url);
        }
      }
      toast.info("Couldn't fetch automatically — paste content below");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleSaveWebsite = async () => {
    if (!websiteUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    const content = websiteContent.trim();
    if (!content) {
      toast.error("No content to save — please paste the website content");
      return;
    }
    let hostname = websiteUrl;
    try {
      hostname = new URL(
        websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`,
      ).hostname;
    } catch {
      /* keep */
    }
    const title = websiteTitle.trim() || hostname;
    const category = websiteCategory || "General";
    const encoded = encodeKnowledgeSource(
      "website",
      title,
      websiteUrl,
      content,
      category,
      websiteFolderId ?? undefined,
    );
    try {
      await addMemory.mutateAsync(encoded);
      const summary = content.replace(/\s+/g, " ").trim().slice(0, 200);
      setLastSaved({ title, summary, sourceType: "website", category });
      toast.success("Website stored in DJ's memory");
      setWebsiteUrl("");
      setWebsiteTitle("");
      setWebsiteContent("");
      setWebsiteCategory("General");
      setShowManualPaste(false);
    } catch {
      toast.error("Failed to save website content");
    }
  };

  const processFile = useCallback(async (file: File) => {
    setUploadState({ stage: "reading" });
    setEditedTitle(file.name.replace(/\.[^.]+$/, ""));
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    try {
      if (ext === "txt" || ext === "md") {
        const text = await file.text();
        setEditedContent(text.slice(0, 2000));
        setUploadState({
          stage: "review",
          filename: file.name,
          extractedText: text.slice(0, 2000),
          fileType: "txt",
        });
      } else if (ext === "pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const decoder = new TextDecoder("latin1");
        const raw = decoder.decode(bytes);
        const btEtMatches = raw.match(/BT[\s\S]*?ET/g) || [];
        let extracted = "";
        for (const block of btEtMatches) {
          const strMatches = block.match(/\(([^)]+)\)/g) || [];
          for (const str of strMatches) extracted += `${str.slice(1, -1)} `;
        }
        if (!extracted.trim())
          extracted = raw
            .replace(/[^\x20-\x7E\n\r\t]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 2000);
        setEditedContent(extracted.slice(0, 2000));
        setUploadState({
          stage: "review",
          filename: file.name,
          extractedText: extracted.slice(0, 2000),
          fileType: "pdf",
        });
      } else if (ext === "docx" || ext === "pptx") {
        const fileType = ext === "docx" ? "word" : "pptx";
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const decoder = new TextDecoder("utf-8", { fatal: false });
        const raw = decoder.decode(bytes);
        const xmlText = raw
          .replace(/<[^>]+>/g, " ")
          .replace(/[^\x20-\x7E\n\r\t]/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 2000);
        setEditedContent(xmlText);
        setUploadState({
          stage: "review",
          filename: file.name,
          extractedText: xmlText,
          fileType,
        });
      } else {
        toast.error(`Unsupported file type: .${ext}`);
        setUploadState({ stage: "idle" });
      }
    } catch {
      toast.error("Failed to read file");
      setUploadState({ stage: "idle" });
    }
  }, []);

  const handleFileDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [processFile],
  );

  const handleSaveFile = async () => {
    if (uploadState.stage !== "review") return;
    const content = editedContent.trim();
    if (!content) {
      toast.error("No content to save");
      return;
    }
    setUploadState({ stage: "saving" });
    const fileType = uploadState.fileType as "pdf" | "word" | "pptx" | "txt";
    const title = editedTitle.trim() || uploadState.filename;
    const category = fileCategory || "General";
    const encoded = encodeKnowledgeSource(
      fileType,
      title,
      uploadState.filename,
      content,
      category,
      fileFolderId ?? undefined,
    );
    try {
      await addMemory.mutateAsync(encoded);
      const summary = content.replace(/\s+/g, " ").trim().slice(0, 200);
      setLastSaved({ title, summary, sourceType: fileType, category });
      toast.success(`${title} stored in DJ's memory`);
      setUploadState({ stage: "idle" });
      setEditedContent("");
      setEditedTitle("");
      setFileCategory("General");
    } catch {
      toast.error("Failed to save file content");
      setUploadState({
        stage: "review",
        filename: uploadState.filename,
        extractedText: uploadState.extractedText,
        fileType: uploadState.fileType,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary card */}
      {lastSaved && (
        <div
          data-ocid="knowledge.summary_card"
          className="relative rounded-xl border border-primary/50 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-4"
        >
          <button
            type="button"
            onClick={() => setLastSaved(null)}
            className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3 pr-6">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-sm">{lastSaved.title}</p>
                <SourceTypeBadge type={lastSaved.sourceType} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {lastSaved.summary}
              </p>
              <p className="mt-1.5 text-xs text-primary/60">
                ✓ Saved to DJ's memory
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Website / File tabs */}
      <div className="flex gap-2 border-b border-primary/20 pb-1">
        <button
          type="button"
          onClick={() => setTab("website")}
          className={`flex items-center gap-1.5 rounded-t-lg px-3 py-1.5 text-sm font-medium transition-all ${
            tab === "website"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Globe className="h-4 w-4" />
          Website URL
        </button>
        <button
          type="button"
          onClick={() => setTab("file")}
          className={`flex items-center gap-1.5 rounded-t-lg px-3 py-1.5 text-sm font-medium transition-all ${
            tab === "file"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="h-4 w-4" />
          Upload File
        </button>
      </div>

      {/* Website tab */}
      {tab === "website" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Link className="h-3.5 w-3.5" />
              Website URL
            </Label>
            <div className="flex gap-2">
              <Input
                data-ocid="knowledge.website_url.input"
                placeholder="https://example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetchWebsite()}
                className="border-primary/30 bg-card/50"
              />
              <Button
                data-ocid="knowledge.website_fetch.button"
                onClick={handleFetchWebsite}
                disabled={isFetchingUrl || !websiteUrl.trim()}
                className="shrink-0 border border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"
              >
                {isFetchingUrl ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Globe className="mr-2 h-4 w-4" />
                )}
                Fetch
              </Button>
            </div>
          </div>
          {(websiteContent || showManualPaste) && (
            <>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  data-ocid="knowledge.website_title.input"
                  placeholder="Source title"
                  value={websiteTitle}
                  onChange={(e) => setWebsiteTitle(e.target.value)}
                  className="border-primary/30 bg-card/50"
                />
              </div>
              {showManualPaste && (
                <div className="space-y-2">
                  <Label>Paste Content Manually</Label>
                  <Textarea
                    data-ocid="knowledge.website_content.textarea"
                    placeholder="Paste the page content here..."
                    value={websiteContent}
                    onChange={(e) => setWebsiteContent(e.target.value)}
                    rows={5}
                    className="border-primary/30 bg-card/50 text-sm"
                  />
                </div>
              )}
              <CategorySelector
                value={websiteCategory}
                onChange={setWebsiteCategory}
                allCategories={allCategories}
                onAddCustom={onAddCustomCategory}
              />
              {folders.length > 0 && (
                <FolderPicker
                  folders={folders}
                  value={websiteFolderId}
                  onChange={setWebsiteFolderId}
                />
              )}
              <Button
                data-ocid="knowledge.website_save.button"
                onClick={handleSaveWebsite}
                disabled={addMemory.isPending || !websiteContent.trim()}
                className="w-full border border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"
              >
                {addMemory.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BookOpen className="mr-2 h-4 w-4" />
                )}
                Save to DJ's Memory
              </Button>
            </>
          )}
        </div>
      )}

      {/* File tab */}
      {tab === "file" && (
        <div className="space-y-4">
          {uploadState.stage === "idle" || uploadState.stage === "reading" ? (
            <div
              data-ocid="knowledge.file.dropzone"
              onDrop={handleFileDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-primary/30 hover:border-primary/60 hover:bg-primary/5"
              }`}
              onKeyDown={(e) =>
                e.key === "Enter" && fileInputRef.current?.click()
              }
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadState.stage === "reading" ? (
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              ) : (
                <Upload className="h-10 w-10 text-primary/40" />
              )}
              <div>
                <p className="font-medium text-sm">
                  {uploadState.stage === "reading"
                    ? "Reading file..."
                    : "Drop file or click to upload"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PDF, Word (.docx), PowerPoint (.pptx), .txt, .md
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.pptx,.txt,.md"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {uploadState.stage !== "saving" && uploadState.filename}
                </span>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  data-ocid="knowledge.file_title.input"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="border-primary/30 bg-card/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Extracted Content (edit if needed)</Label>
                <Textarea
                  data-ocid="knowledge.file_content.textarea"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={5}
                  className="border-primary/30 bg-card/50 text-sm"
                />
              </div>
              <CategorySelector
                value={fileCategory}
                onChange={setFileCategory}
                allCategories={allCategories}
                onAddCustom={onAddCustomCategory}
              />
              {folders.length > 0 && (
                <FolderPicker
                  folders={folders}
                  value={fileFolderId}
                  onChange={setFileFolderId}
                />
              )}
              <div className="flex gap-2">
                <Button
                  data-ocid="knowledge.file_save.button"
                  onClick={handleSaveFile}
                  disabled={
                    uploadState.stage === "saving" || !editedContent.trim()
                  }
                  className="flex-1 border border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"
                >
                  {uploadState.stage === "saving" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BookOpen className="mr-2 h-4 w-4" />
                  )}
                  Save to DJ's Memory
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setUploadState({ stage: "idle" });
                    setEditedContent("");
                    setEditedTitle("");
                  }}
                  className="text-muted-foreground"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Knowledge Page ──────────────────────────────────────────────────────

export function KnowledgePage() {
  const { data: memories = [] } = useMemories();
  const { data: folders = [] } = useKnowledgeFolders();
  const deleteMemory = useDeleteMemory();
  const createFolder = useCreateKnowledgeFolder();
  const deleteFolder = useDeleteKnowledgeFolder();

  // Selected folder (null = All Sources)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Mobile folder panel
  const [folderPanelOpen, setFolderPanelOpen] = useState(false);

  // Delete folder confirmation
  const [deletingFolder, setDeletingFolder] = useState<{
    id: bigint;
    name: string;
  } | null>(null);

  // Categories
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("dj_custom_categories") || "[]");
    } catch {
      return [];
    }
  });
  const allCategories = [...PRESET_CATEGORIES, ...customCategories];

  const handleAddCustomCategory = (name: string) => {
    if (allCategories.includes(name)) return;
    const updated = [...customCategories, name];
    setCustomCategories(updated);
    localStorage.setItem("dj_custom_categories", JSON.stringify(updated));
  };

  // My sources
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const knowledgeSources: KnowledgeSource[] = memories
    .map(parseKnowledgeSource)
    .filter((s): s is KnowledgeSource => s !== null);

  // Build source counts per folder
  const sourceCounts: Record<string, number> = {};
  for (const s of knowledgeSources) {
    if (s.folderId) {
      sourceCounts[s.folderId] = (sourceCounts[s.folderId] ?? 0) + 1;
    }
  }

  // Filter sources based on selected folder
  const folderFilteredSources =
    selectedFolderId === null
      ? knowledgeSources
      : knowledgeSources.filter((s) => s.folderId === selectedFolderId);

  const searchFiltered = searchKnowledgeSources(
    folderFilteredSources,
    searchQuery,
  );
  const filteredSources =
    selectedCategory === "All"
      ? searchFiltered
      : searchFiltered.filter((s) => s.category === selectedCategory);

  const storedCategories = Array.from(
    new Set(folderFilteredSources.map((s) => s.category).filter(Boolean)),
  );

  const handleDeleteSource = async (id: bigint, title: string) => {
    try {
      await deleteMemory.mutateAsync(id);
      toast.success(`"${title}" removed from DJ's memory`);
    } catch {
      toast.error("Failed to delete knowledge source");
    }
  };

  const handleCreateFolder = async (name: string, parentId: bigint | null) => {
    try {
      await createFolder.mutateAsync({ name, parentId });
      toast.success(`Folder "${name}" created`);
    } catch {
      toast.error("Failed to create folder");
    }
  };

  const handleDeleteFolderConfirm = async () => {
    if (!deletingFolder) return;
    try {
      await deleteFolder.mutateAsync(deletingFolder.id);
      toast.success(`Folder "${deletingFolder.name}" deleted`);
      if (selectedFolderId === String(deletingFolder.id)) {
        setSelectedFolderId(null);
      }
    } catch {
      toast.error("Failed to delete folder");
    } finally {
      setDeletingFolder(null);
    }
  };

  const selectedFolder = folders.find((f) => String(f.id) === selectedFolderId);

  // Research state (lifted here for all-sources view)
  const [researchTopic, setResearchTopic] = useState("");
  const [researchSuggestions, setResearchSuggestions] = useState<
    { title: string; url: string; description: string }[]
  >([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [fetchingUrls, setFetchingUrls] = useState<Record<string, boolean>>({});
  const [addedUrls, setAddedUrls] = useState<Set<string>>(new Set());
  const addMemory = useAddMemory();

  const CURATED_SOURCES: Record<
    string,
    { title: string; url: string; description: string }[]
  > = {
    bitcoin: [
      {
        title: "Bitcoin - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Bitcoin",
        description:
          "Comprehensive overview of Bitcoin, history, and technology",
      },
      {
        title: "Bitcoin.org",
        url: "https://bitcoin.org/en/",
        description: "Official Bitcoin project homepage",
      },
      {
        title: "Bitcoin - Investopedia",
        url: "https://www.investopedia.com/terms/b/bitcoin.asp",
        description: "Financial guide to Bitcoin investing and trading",
      },
      {
        title: "Bitcoin Whitepaper",
        url: "https://bitcoin.org/bitcoin.pdf",
        description: "Satoshi Nakamoto's original Bitcoin whitepaper",
      },
      {
        title: "CoinDesk Bitcoin News",
        url: "https://www.coindesk.com/tag/bitcoin/",
        description: "Latest Bitcoin news and analysis",
      },
    ],
    "icp internet computer": [
      {
        title: "Internet Computer - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Internet_Computer",
        description: "Overview of the Internet Computer blockchain",
      },
      {
        title: "DFINITY Foundation",
        url: "https://dfinity.org/",
        description: "The organization behind ICP development",
      },
      {
        title: "ICP Developer Docs",
        url: "https://internetcomputer.org/docs/current/developer-docs/",
        description: "Official ICP developer documentation",
      },
      {
        title: "ICP Overview",
        url: "https://internetcomputer.org/",
        description: "Internet Computer Protocol official site",
      },
      {
        title: "ICP on CoinGecko",
        url: "https://www.coingecko.com/en/coins/internet-computer",
        description: "ICP token price and market data",
      },
    ],
    ethereum: [
      {
        title: "Ethereum - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Ethereum",
        description: "Complete guide to Ethereum blockchain",
      },
      {
        title: "Ethereum.org",
        url: "https://ethereum.org/en/",
        description: "Official Ethereum foundation site",
      },
      {
        title: "Ethereum Docs",
        url: "https://ethereum.org/en/developers/docs/",
        description: "Official Ethereum developer documentation",
      },
      {
        title: "Ethereum - Investopedia",
        url: "https://www.investopedia.com/terms/e/ethereum.asp",
        description: "Ethereum investing guide",
      },
      {
        title: "Etherscan",
        url: "https://etherscan.io/",
        description: "Ethereum blockchain explorer",
      },
    ],
    "artificial intelligence": [
      {
        title: "Artificial Intelligence - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
        description: "Comprehensive overview of AI",
      },
      {
        title: "AI - Britannica",
        url: "https://www.britannica.com/technology/artificial-intelligence",
        description: "Encyclopedia article on AI",
      },
      {
        title: "MIT AI Lab",
        url: "https://www.csail.mit.edu/research/artificial-intelligence",
        description: "MIT's AI research overview",
      },
      {
        title: "AI News - BBC",
        url: "https://www.bbc.com/news/topics/ce1qrvleleqt/artificial-intelligence",
        description: "Latest AI news from BBC",
      },
      {
        title: "AI - Stanford",
        url: "https://ai.stanford.edu/",
        description: "Stanford University AI research",
      },
    ],
  };

  const generateResearchSources = () => {
    if (!researchTopic.trim()) {
      toast.error("Please enter a topic to research");
      return;
    }
    setIsGeneratingSuggestions(true);
    setResearchSuggestions([]);
    setAddedUrls(new Set());
    setTimeout(() => {
      const key = researchTopic.trim().toLowerCase();
      const exact = CURATED_SOURCES[key];
      if (exact) {
        setResearchSuggestions(exact);
      } else {
        const encoded = encodeURIComponent(researchTopic.trim());
        setResearchSuggestions([
          {
            title: `${researchTopic} - Wikipedia`,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(researchTopic.trim().replace(/\s+/g, "_"))}`,
            description: `Wikipedia article about ${researchTopic}`,
          },
          {
            title: `${researchTopic} - Britannica`,
            url: `https://www.britannica.com/search?query=${encoded}`,
            description: `Encyclopaedia Britannica on ${researchTopic}`,
          },
          {
            title: `${researchTopic} - BBC News`,
            url: `https://www.bbc.com/search?q=${encoded}`,
            description: `Latest BBC news about ${researchTopic}`,
          },
          {
            title: `${researchTopic} - Investopedia`,
            url: `https://www.investopedia.com/search#q=${encoded}`,
            description: `Investopedia financial guide on ${researchTopic}`,
          },
          {
            title: `${researchTopic} - MIT News`,
            url: `https://news.mit.edu/search/node/${encoded}`,
            description: `MIT academic articles about ${researchTopic}`,
          },
        ]);
      }
      setIsGeneratingSuggestions(false);
      toast.success(`5 sources found for "${researchTopic}"`);
    }, 1200);
  };

  const handleFetchResearchSource = async (source: {
    title: string;
    url: string;
    description: string;
  }) => {
    setFetchingUrls((prev) => ({ ...prev, [source.url]: true }));
    try {
      let content = "";
      try {
        const resp = await fetch(source.url);
        const html = await resp.text();
        content = extractTextFromHtml(html).slice(0, 2000);
      } catch {
        content = `${source.title}\n\n${source.description}\n\nSource: ${source.url}`;
      }
      const encoded = encodeKnowledgeSource(
        "website",
        source.title,
        source.url,
        content || source.description,
        "Research",
      );
      await addMemory.mutateAsync(encoded);
      setAddedUrls((prev) => new Set([...prev, source.url]));
      toast.success(`"${source.title}" added to DJ's memory`);
    } catch {
      toast.error(`Failed to add "${source.title}"`);
    } finally {
      setFetchingUrls((prev) => ({ ...prev, [source.url]: false }));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Page Header */}
        <div className="glow-border mb-6 rounded-xl border border-primary/40 bg-gradient-to-br from-card to-muted/30 p-5">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-primary bg-primary/10"
              style={{ boxShadow: "0 0 20px oklch(0.65 0.25 220 / 0.4)" }}
            >
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="glow-text font-display text-2xl font-bold">
                Knowledge Base
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Teach DJ from websites, PDFs, and documents. Organize with
                folders and create wiki pages.
              </p>
            </div>
            <Badge className="shrink-0 border-primary/40 bg-primary/20 text-primary">
              {knowledgeSources.length} source
              {knowledgeSources.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        {/* Mobile folder toggle */}
        <button
          type="button"
          data-ocid="knowledge.folder_panel.toggle"
          onClick={() => setFolderPanelOpen((v) => !v)}
          className="mb-4 flex w-full items-center justify-between rounded-xl border border-primary/30 bg-card/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card/80 md:hidden"
        >
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-primary" />
            <span>
              {selectedFolder ? selectedFolder.name : "All Sources"}
              {selectedFolder && (
                <span className="ml-1.5 text-muted-foreground">· Folder</span>
              )}
            </span>
          </div>
          {folderPanelOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        <div className="flex gap-6">
          {/* Folder Sidebar (desktop always visible, mobile collapsible) */}
          <aside
            className={`${
              folderPanelOpen ? "block" : "hidden"
            } w-full md:block md:w-56 lg:w-64 shrink-0`}
          >
            <div className="rounded-xl border border-primary/30 bg-card/50 p-3">
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Folders
              </p>
              <FolderTree
                folders={folders}
                selectedFolderId={selectedFolderId}
                onSelect={(id) => {
                  setSelectedFolderId(id);
                  setFolderPanelOpen(false);
                }}
                onDelete={(id, name) => setDeletingFolder({ id, name })}
                onCreate={handleCreateFolder}
                sourceCounts={sourceCounts}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1">
            {/* Breadcrumb when folder selected */}
            {selectedFolderId && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/20 bg-card/30 px-3 py-2">
                <FolderBreadcrumb
                  folderId={selectedFolderId}
                  folders={folders}
                  onNavigate={setSelectedFolderId}
                />
              </div>
            )}

            {/* Folder view: Sources + Wiki tabs */}
            {selectedFolderId && selectedFolder ? (
              <div className="space-y-4">
                <Tabs defaultValue="sources">
                  <TabsList className="border border-primary/30 bg-card/80 w-full">
                    <TabsTrigger
                      data-ocid="knowledge.folder.sources.tab"
                      value="sources"
                      className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <BookOpen className="mr-1.5 h-4 w-4" />
                      Sources
                      {folderFilteredSources.length > 0 && (
                        <Badge className="ml-1.5 border-primary/30 bg-primary/10 text-primary text-xs">
                          {folderFilteredSources.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      data-ocid="knowledge.folder.wiki.tab"
                      value="wiki"
                      className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <Edit3 className="mr-1.5 h-4 w-4" />
                      Wiki Page
                    </TabsTrigger>
                    <TabsTrigger
                      data-ocid="knowledge.folder.add.tab"
                      value="add"
                      className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <Plus className="mr-1.5 h-4 w-4" />
                      Add Source
                    </TabsTrigger>
                  </TabsList>

                  {/* Folder Sources */}
                  <TabsContent value="sources" className="space-y-4 pt-2">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        data-ocid="knowledge.folder.search_input"
                        placeholder="Search sources in this folder..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-primary/30 bg-card/50 pl-9"
                      />
                    </div>

                    {filteredSources.length === 0 ? (
                      <div
                        data-ocid="knowledge.folder.sources.empty_state"
                        className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/30 py-12 text-center"
                      >
                        <FolderOpen className="h-10 w-10 text-primary/30" />
                        <div>
                          <p className="font-medium text-muted-foreground">
                            No sources in this folder
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground/60">
                            Add sources using the "Add Source" tab above.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredSources.map((s, i) => (
                          <SourceCard
                            key={String(s.id)}
                            source={s}
                            onDelete={handleDeleteSource}
                            index={i + 1}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Wiki Page */}
                  <TabsContent value="wiki" className="pt-2">
                    <Card className="border-primary/30 bg-card/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 font-display text-base">
                          <Edit3 className="h-4 w-4 text-primary" />
                          Wiki — {selectedFolder.name}
                        </CardTitle>
                        <CardDescription>
                          A structured knowledge page for this folder. Generate
                          from sources or write manually.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <WikiPageEditor
                          folderId={selectedFolder.id}
                          folderName={selectedFolder.name}
                          sources={folderFilteredSources}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Add Source (in folder context) */}
                  <TabsContent value="add" className="pt-2">
                    <Card className="border-primary/30 bg-card/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 font-display text-base">
                          <Plus className="h-4 w-4 text-primary" />
                          Add to {selectedFolder.name}
                        </CardTitle>
                        <CardDescription>
                          Sources added here will be automatically filed in this
                          folder.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AddSourceForm
                          allCategories={allCategories}
                          folders={folders}
                          onAddCustomCategory={handleAddCustomCategory}
                          defaultFolderId={selectedFolderId}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              /* All Sources view */
              <Tabs defaultValue="research">
                <TabsList className="mb-4 grid w-full grid-cols-3 border border-primary/30 bg-card/80">
                  <TabsTrigger
                    data-ocid="knowledge.research.tab"
                    value="research"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <Sparkles className="mr-1.5 h-4 w-4" />
                    Research
                  </TabsTrigger>
                  <TabsTrigger
                    data-ocid="knowledge.add.tab"
                    value="add"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add Source
                  </TabsTrigger>
                  <TabsTrigger
                    data-ocid="knowledge.sources.tab"
                    value="sources"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <BookOpen className="mr-1.5 h-4 w-4" />
                    My Sources
                    {knowledgeSources.length > 0 && (
                      <Badge className="ml-1.5 border-primary/30 bg-primary/20 text-primary text-xs">
                        {knowledgeSources.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* RESEARCH TAB */}
                <TabsContent value="research" className="space-y-6">
                  <Card className="glow-border border-primary/40">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-display">
                        <Sparkles className="h-5 w-5 text-secondary" />
                        Research a Topic
                      </CardTitle>
                      <CardDescription>
                        Type any topic and DJ will suggest 5 trusted sources to
                        add to its memory instantly.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            data-ocid="knowledge.research.search_input"
                            placeholder='e.g. "Bitcoin", "ICP Internet Computer", "AI"'
                            value={researchTopic}
                            onChange={(e) => setResearchTopic(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && generateResearchSources()
                            }
                            className="border-primary/30 bg-card/50 pl-9"
                          />
                        </div>
                        <Button
                          data-ocid="knowledge.research.generate_button"
                          onClick={generateResearchSources}
                          disabled={
                            isGeneratingSuggestions || !researchTopic.trim()
                          }
                          className="shrink-0 bg-secondary/20 border border-secondary/40 text-secondary hover:bg-secondary/30"
                        >
                          {isGeneratingSuggestions ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                          )}
                          Generate
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Bitcoin",
                          "ICP Internet Computer",
                          "Ethereum",
                          "Artificial Intelligence",
                        ].map((topic) => (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => setResearchTopic(topic)}
                            className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary transition-all hover:bg-primary/20 hover:border-primary/60"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                      {isGeneratingSuggestions && (
                        <div className="flex flex-col items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 py-10">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">
                            Finding the best sources for "{researchTopic}"...
                          </p>
                        </div>
                      )}
                      {researchSuggestions.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-muted-foreground">
                            {researchSuggestions.length} sources found — tap to
                            add:
                          </p>
                          {researchSuggestions.map((source) => {
                            const isAdded = addedUrls.has(source.url);
                            const isFetching = fetchingUrls[source.url];
                            return (
                              <div
                                key={source.url}
                                className={`flex items-start gap-3 rounded-xl border p-4 transition-all ${
                                  isAdded
                                    ? "border-green-500/40 bg-green-500/5"
                                    : "border-primary/30 bg-card/50 hover:border-primary/60"
                                }`}
                              >
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                                  <Globe className="h-4 w-4 text-blue-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-sm text-foreground truncate">
                                    {source.title}
                                  </p>
                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    {source.description}
                                  </p>
                                  <p className="mt-1 text-xs text-primary/50 truncate">
                                    {source.url}
                                  </p>
                                </div>
                                <Button
                                  data-ocid="knowledge.research.add_source.button"
                                  size="sm"
                                  disabled={isAdded || isFetching}
                                  onClick={() =>
                                    handleFetchResearchSource(source)
                                  }
                                  className={`shrink-0 ${
                                    isAdded
                                      ? "border-green-500/40 bg-green-500/10 text-green-400"
                                      : "border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"
                                  }`}
                                >
                                  {isFetching ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : isAdded ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Plus className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ADD SOURCE TAB */}
                <TabsContent value="add">
                  <Card className="border-primary/40">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-display">
                        <Plus className="h-5 w-5 text-primary" />
                        Add Knowledge Source
                      </CardTitle>
                      <CardDescription>
                        Add a website URL or upload a file to teach DJ new
                        knowledge.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AddSourceForm
                        allCategories={allCategories}
                        folders={folders}
                        onAddCustomCategory={handleAddCustomCategory}
                        defaultFolderId={null}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* MY SOURCES TAB */}
                <TabsContent value="sources" className="space-y-4">
                  {/* Search and filter */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        data-ocid="knowledge.sources.search_input"
                        placeholder="Search knowledge sources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-primary/30 bg-card/50 pl-9"
                      />
                    </div>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger
                        data-ocid="knowledge.sources.category_filter.select"
                        className="border-primary/30 bg-card/50 sm:w-40"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-primary/30 bg-card">
                        <SelectItem value="All">All categories</SelectItem>
                        {storedCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {knowledgeSources.length === 0 ? (
                    <div
                      data-ocid="knowledge.sources.empty_state"
                      className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-primary/30 py-16 text-center"
                    >
                      <BookOpen className="h-12 w-12 text-primary/20" />
                      <div>
                        <p className="font-display text-lg font-semibold text-muted-foreground">
                          No knowledge sources yet
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground/60">
                          Add websites, PDFs, or documents for DJ to learn from.
                        </p>
                      </div>
                    </div>
                  ) : filteredSources.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/20 py-12 text-center">
                      <Search className="h-8 w-8 text-muted-foreground/30" />
                      <p className="text-muted-foreground">
                        No results for "{searchQuery}"
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredSources.map((s, i) => (
                        <SourceCard
                          key={String(s.id)}
                          source={s}
                          onDelete={handleDeleteSource}
                          index={i + 1}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </main>
        </div>
      </div>

      {/* Delete Folder Confirmation */}
      {deletingFolder && (
        <DeleteFolderDialog
          folderName={deletingFolder.name}
          open={true}
          onConfirm={handleDeleteFolderConfirm}
          onCancel={() => setDeletingFolder(null)}
        />
      )}
    </Layout>
  );
}
