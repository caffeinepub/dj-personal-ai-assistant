import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  FileText,
  FileType,
  FolderOpen,
  Globe,
  Link,
  Loader2,
  Plus,
  Presentation,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  useAddMemory,
  useDeleteMemory,
  useMemories,
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

export function KnowledgePage() {
  const { data: memories = [] } = useMemories();
  const addMemory = useAddMemory();
  const deleteMemory = useDeleteMemory();

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

  // Website section
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteTitle, setWebsiteTitle] = useState("");
  const [websiteContent, setWebsiteContent] = useState("");
  const [websiteCategory, setWebsiteCategory] = useState("General");
  const [showManualPaste, setShowManualPaste] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  // File upload section
  const [uploadState, setUploadState] = useState<UploadState>({
    stage: "idle",
  });
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [fileCategory, setFileCategory] = useState("General");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Post-save summary card
  const [lastSavedSummary, setLastSavedSummary] = useState<SummaryCard>(null);

  // My sources
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const knowledgeSources: KnowledgeSource[] = memories
    .map(parseKnowledgeSource)
    .filter((s): s is KnowledgeSource => s !== null);

  const searchFiltered = searchKnowledgeSources(knowledgeSources, searchQuery);
  const filteredSources =
    selectedCategory === "All"
      ? searchFiltered
      : searchFiltered.filter((s) => s.category === selectedCategory);

  const storedCategories = Array.from(
    new Set(knowledgeSources.map((s) => s.category).filter(Boolean)),
  );

  const formatTimestamp = (ts: bigint) => {
    const d = new Date(Number(ts) / 1_000_000);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
      toast.success("Website content fetched successfully");
    } catch {
      setShowManualPaste(true);
      if (!websiteTitle.trim()) {
        try {
          setWebsiteTitle(new URL(url).hostname);
        } catch {
          setWebsiteTitle(url);
        }
      }
      toast.info("Couldn't fetch automatically — paste the page content below");
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
    );
    try {
      await addMemory.mutateAsync(encoded);
      const summary = content.replace(/\s+/g, " ").trim().slice(0, 200);
      setLastSavedSummary({ title, summary, sourceType: "website", category });
      toast.success("Website content stored in DJ's memory");
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
      toast.error(
        "No content to save — please paste or review the extracted content",
      );
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
    );
    try {
      await addMemory.mutateAsync(encoded);
      const summary = content.replace(/\s+/g, " ").trim().slice(0, 200);
      setLastSavedSummary({ title, summary, sourceType: fileType, category });
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

  const handleCancelFile = () => {
    setUploadState({ stage: "idle" });
    setEditedContent("");
    setEditedTitle("");
    setFileCategory("General");
  };

  const handleDeleteSource = async (id: bigint, title: string) => {
    try {
      await deleteMemory.mutateAsync(id);
      toast.success(`"${title}" removed from DJ's memory`);
    } catch {
      toast.error("Failed to delete knowledge source");
    }
  };

  // Research
  const [researchTopic, setResearchTopic] = useState("");
  const [researchSuggestions, setResearchSuggestions] = useState<
    { title: string; url: string; description: string }[]
  >([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [fetchingUrls, setFetchingUrls] = useState<Record<string, boolean>>({});
  const [addedUrls, setAddedUrls] = useState<Set<string>>(new Set());

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
      <div className="container mx-auto max-w-4xl space-y-8 px-4 py-8">
        {/* Page Header */}
        <div className="glow-border rounded-xl border border-primary/40 bg-gradient-to-br from-card to-muted/30 p-6">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-primary bg-primary/10"
              style={{ boxShadow: "0 0 20px oklch(0.65 0.25 220 / 0.4)" }}
            >
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="glow-text font-display text-2xl font-bold md:text-3xl">
                Knowledge Sources
              </h1>
              <p className="mt-1 text-muted-foreground">
                Teach DJ from websites, PDFs, Word docs, and presentations — DJ
                will reference these when replying.
              </p>
            </div>
          </div>
          {knowledgeSources.length > 0 && (
            <div className="mt-4 flex items-center gap-3 border-t border-primary/20 pt-4">
              <Badge className="border-primary/40 bg-primary/20 text-primary">
                {knowledgeSources.length} source
                {knowledgeSources.length !== 1 ? "s" : ""}
              </Badge>
              <span className="text-sm text-muted-foreground">
                stored in DJ's memory
              </span>
            </div>
          )}
        </div>

        {/* Auto-summary card after save */}
        {lastSavedSummary && (
          <div
            data-ocid="knowledge.summary_card"
            className="relative rounded-xl border border-primary/50 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-5"
            style={{ boxShadow: "0 0 24px oklch(0.65 0.25 220 / 0.2)" }}
          >
            <button
              type="button"
              onClick={() => setLastSavedSummary(null)}
              className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3 pr-8">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary/20">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display font-semibold text-foreground">
                    {lastSavedSummary.title}
                  </p>
                  <SourceTypeBadge type={lastSavedSummary.sourceType} />
                  <Badge className="border-secondary/40 bg-secondary/20 text-secondary text-xs">
                    <FolderOpen className="mr-1 h-3 w-3" />
                    {lastSavedSummary.category}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3">
                  {lastSavedSummary.summary}
                  {lastSavedSummary.summary.length >= 200 ? "…" : ""}
                </p>
                <p className="mt-2 text-xs text-primary/60">
                  ✓ Saved to DJ's memory
                </p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="research">
          <TabsList className="mb-6 grid w-full grid-cols-3 border border-primary/30 bg-card/80">
            <TabsTrigger
              value="research"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              Research
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add Source
            </TabsTrigger>
            <TabsTrigger
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
                  Type any topic and DJ will suggest 5 trusted sources to add to
                  its memory instantly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
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
                    onClick={generateResearchSources}
                    disabled={isGeneratingSuggestions || !researchTopic.trim()}
                    className="shrink-0 bg-secondary/20 border border-secondary/40 text-secondary hover:bg-secondary/30"
                  >
                    {isGeneratingSuggestions ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Sources
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
                      {researchSuggestions.length} sources found — tap to add to
                      DJ's memory:
                    </p>
                    {researchSuggestions.map((source) => {
                      const isAdded = addedUrls.has(source.url);
                      const isFetching = fetchingUrls[source.url];
                      return (
                        <div
                          key={source.url}
                          className={`flex items-start gap-3 rounded-xl border p-4 transition-all ${isAdded ? "border-green-500/40 bg-green-500/5" : "border-primary/30 bg-card/50 hover:border-primary/60"}`}
                        >
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                            <Globe className="h-4 w-4 text-blue-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-foreground truncate">
                              {source.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                              {source.description}
                            </p>
                            <p className="mt-1 truncate text-xs text-primary/60">
                              {source.url}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleFetchResearchSource(source)}
                            disabled={isFetching || isAdded}
                            className={`shrink-0 ${isAdded ? "bg-green-500/20 border-green-500/40 text-green-400" : "bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30"}`}
                            variant="outline"
                          >
                            {isFetching ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : isAdded ? (
                              <>
                                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                                Added
                              </>
                            ) : (
                              <>
                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                Add
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                    {addedUrls.size > 0 && (
                      <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3 text-center text-sm text-green-400">
                        {addedUrls.size} source{addedUrls.size !== 1 ? "s" : ""}{" "}
                        added to DJ's memory. Ask DJ: "What do you know about{" "}
                        {researchTopic}?"
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ADD SOURCE TAB */}
          <TabsContent value="add" className="space-y-6">
            {/* Website */}
            <Card className="glow-border border-primary/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display">
                  <Globe className="h-5 w-5 text-blue-400" />
                  Add Website
                </CardTitle>
                <CardDescription>
                  Enter a URL and DJ will fetch and store the content from that
                  page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website-url" className="text-foreground">
                    Website URL
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="website-url"
                        placeholder="https://example.com/article"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="border-primary/30 bg-card/50 pl-9"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleFetchWebsite()
                        }
                      />
                    </div>
                    <Button
                      onClick={handleFetchWebsite}
                      disabled={isFetchingUrl || !websiteUrl.trim()}
                      className="shrink-0 bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30"
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
                <div className="space-y-2">
                  <Label htmlFor="website-title">Title (optional)</Label>
                  <Input
                    id="website-title"
                    placeholder="Auto-detected from URL"
                    value={websiteTitle}
                    onChange={(e) => setWebsiteTitle(e.target.value)}
                    className="border-primary/30 bg-card/50"
                  />
                </div>
                {(websiteContent || showManualPaste) && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="website-content">
                        {showManualPaste ? (
                          <span className="text-amber-400">
                            Couldn't fetch automatically — paste the page
                            content below:
                          </span>
                        ) : (
                          "Fetched Content (review before saving):"
                        )}
                      </Label>
                      <Textarea
                        id="website-content"
                        placeholder="Paste the website content here..."
                        value={websiteContent}
                        onChange={(e) => setWebsiteContent(e.target.value)}
                        className="min-h-32 border-primary/30 bg-card/50 font-mono text-xs"
                        rows={6}
                      />
                      <p className="text-xs text-muted-foreground">
                        {websiteContent.length}/2000 characters
                      </p>
                    </div>
                    <CategorySelector
                      value={websiteCategory}
                      onChange={setWebsiteCategory}
                      allCategories={allCategories}
                      onAddCustom={handleAddCustomCategory}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveWebsite}
                        disabled={addMemory.isPending || !websiteContent.trim()}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {addMemory.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Save to DJ's Memory
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setWebsiteContent("");
                          setShowManualPaste(false);
                        }}
                        className="text-muted-foreground"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="glow-border border-primary/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload File
                </CardTitle>
                <CardDescription>
                  Upload a PDF, Word document, PowerPoint, or text file. DJ will
                  extract and store the content.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadState.stage === "idle" && (
                  // biome-ignore lint/a11y/useSemanticElements: drag-and-drop zone requires div for drag events
                  <div
                    role="button"
                    tabIndex={0}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    data-ocid="knowledge.dropzone"
                    className={`cursor-pointer rounded-xl border-2 border-dashed transition-all ${isDragging ? "border-primary bg-primary/10 shadow-[0_0_20px_oklch(0.65_0.25_220_/_0.3)]" : "border-primary/30 hover:border-primary/60 hover:bg-primary/5"} p-10 text-center`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10 transition-all ${isDragging ? "scale-110" : ""}`}
                      >
                        <Upload
                          className={`h-8 w-8 transition-all ${isDragging ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <div>
                        <p className="font-display text-base font-semibold text-foreground">
                          {isDragging
                            ? "Drop your file here"
                            : "Drag & drop a file"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          or click to browse
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["PDF", "DOCX", "PPTX", "TXT"].map((type) => (
                          <Badge
                            key={type}
                            variant="outline"
                            className="border-primary/30 text-muted-foreground text-xs"
                          >
                            .{type.toLowerCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.pptx,.txt,.md"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                )}
                {uploadState.stage === "reading" && (
                  <div className="flex flex-col items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                      Reading file content...
                    </p>
                  </div>
                )}
                {uploadState.stage === "review" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <SourceTypeIcon type={uploadState.fileType} />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">
                          {uploadState.filename}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Review and edit before saving
                        </p>
                      </div>
                      <SourceTypeBadge type={uploadState.fileType} />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="border-primary/30 bg-card/50"
                        placeholder="File title"
                      />
                    </div>
                    <CategorySelector
                      value={fileCategory}
                      onChange={setFileCategory}
                      allCategories={allCategories}
                      onAddCustom={handleAddCustomCategory}
                    />
                    <div className="space-y-2">
                      <Label>
                        Extracted Content{" "}
                        <span className="text-muted-foreground text-xs">
                          (review and edit before saving)
                        </span>
                      </Label>
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="min-h-40 border-primary/30 bg-card/50 font-mono text-xs"
                        placeholder="Paste or edit the content DJ should learn from..."
                        rows={8}
                      />
                      <p className="text-xs text-muted-foreground">
                        {editedContent.length}/2000 characters
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveFile}
                        disabled={!editedContent.trim()}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Save to DJ's Memory
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handleCancelFile}
                        className="text-muted-foreground"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                {uploadState.stage === "saving" && (
                  <div className="flex flex-col items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                      Saving to DJ's memory...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-secondary/5">
              <CardContent className="pt-5">
                <p className="mb-3 text-sm font-semibold text-secondary">
                  💡 Tips for best results
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>
                    • DJ references stored knowledge when relevant to your chat
                    questions
                  </li>
                  <li>
                    • For websites with CORS restrictions, copy-paste key
                    paragraphs
                  </li>
                  <li>
                    • Focus on specific sections of long documents — under 2000
                    chars works best
                  </li>
                  <li>
                    • Try: "DJ, what do you know about [topic]" to search your
                    knowledge base
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MY SOURCES TAB */}
          <TabsContent value="sources" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                data-ocid="knowledge.search_input"
                placeholder="Search titles, content, and summaries…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-primary/30 bg-card/50 pl-9"
              />
            </div>

            {knowledgeSources.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {["All", ...storedCategories].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    data-ocid="knowledge.category_filter.tab"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? "border-primary bg-primary/20 text-primary shadow-[0_0_10px_oklch(0.65_0.25_220_/_0.3)]"
                        : "border-primary/20 bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-primary/80"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {cat === "All" ? (
                        <BookOpen className="h-3 w-3" />
                      ) : (
                        <FolderOpen className="h-3 w-3" />
                      )}
                      {cat === "All"
                        ? `All (${knowledgeSources.length})`
                        : `${cat} (${knowledgeSources.filter((s) => s.category === cat).length})`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {knowledgeSources.length === 0 ? (
              <div
                data-ocid="knowledge.empty_state"
                className="flex flex-col items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 py-16 text-center"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">
                    No knowledge sources yet
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add a website or upload a file to get started.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-primary/40 text-primary"
                  onClick={() => {
                    const t = document.querySelector(
                      '[value="add"]',
                    ) as HTMLButtonElement | null;
                    t?.click();
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first source
                </Button>
              </div>
            ) : filteredSources.length === 0 ? (
              <div className="rounded-xl border border-primary/20 bg-primary/5 py-12 text-center">
                <p className="font-display text-lg font-semibold">
                  No results found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term or category.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSources.map((source, idx) => (
                  <Card
                    key={source.id.toString()}
                    data-ocid={`knowledge.source_card.${idx + 1}`}
                    className="glow-border group border-primary/30 transition-all hover:border-primary/60"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                          <SourceTypeIcon type={source.sourceType} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-display font-semibold text-foreground truncate">
                              {source.title}
                            </p>
                            <SourceTypeBadge type={source.sourceType} />
                            <Badge className="border-secondary/30 bg-secondary/10 text-secondary/80 text-xs">
                              <FolderOpen className="mr-1 h-3 w-3" />
                              {source.category}
                            </Badge>
                          </div>
                          {source.url && source.sourceType === "website" && (
                            <p className="mt-0.5 truncate text-xs text-primary/70">
                              {source.url}
                            </p>
                          )}
                          {source.summary && (
                            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                              {source.summary}
                              {source.summary.length >= 200 ? "…" : ""}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-muted-foreground/60">
                            Added {formatTimestamp(source.timestamp)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDeleteSource(source.id, source.title)
                          }
                          disabled={deleteMemory.isPending}
                          className="shrink-0 transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
