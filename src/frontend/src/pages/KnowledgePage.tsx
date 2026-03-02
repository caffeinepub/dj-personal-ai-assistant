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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  FileText,
  FileType,
  Globe,
  Link,
  Loader2,
  Plus,
  Presentation,
  Search,
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

export function KnowledgePage() {
  const { data: memories = [] } = useMemories();
  const addMemory = useAddMemory();
  const deleteMemory = useDeleteMemory();

  // Website section
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteTitle, setWebsiteTitle] = useState("");
  const [websiteContent, setWebsiteContent] = useState("");
  const [showManualPaste, setShowManualPaste] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  // File upload section
  const [uploadState, setUploadState] = useState<UploadState>({
    stage: "idle",
  });
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // My sources section
  const [searchQuery, setSearchQuery] = useState("");

  const knowledgeSources: KnowledgeSource[] = memories
    .map(parseKnowledgeSource)
    .filter((s): s is KnowledgeSource => s !== null);

  const filteredSources = searchKnowledgeSources(knowledgeSources, searchQuery);

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
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

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
          const hostname = new URL(url).hostname;
          setWebsiteTitle(hostname);
        } catch {
          setWebsiteTitle(url);
        }
      }
      toast.success("Website content fetched successfully");
    } catch {
      // CORS or fetch error — ask user to paste
      setShowManualPaste(true);
      if (!websiteTitle.trim()) {
        try {
          const hostname = new URL(url).hostname;
          setWebsiteTitle(hostname);
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
    const title = websiteTitle.trim() || new URL(websiteUrl).hostname;
    const encoded = encodeKnowledgeSource(
      "website",
      title,
      websiteUrl,
      content,
    );
    try {
      await addMemory.mutateAsync(encoded);
      toast.success("Website content stored in DJ's memory");
      setWebsiteUrl("");
      setWebsiteTitle("");
      setWebsiteContent("");
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
        // Try to extract some text from PDF binary — show textarea for review
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        // Attempt naive text extraction from PDF (works for simple PDFs)
        let extracted = "";
        const decoder = new TextDecoder("latin1");
        const raw = decoder.decode(bytes);
        // Extract text between BT/ET markers (basic PDF text extraction)
        const btEtMatches = raw.match(/BT[\s\S]*?ET/g) || [];
        for (const block of btEtMatches) {
          const strMatches = block.match(/\(([^)]+)\)/g) || [];
          for (const str of strMatches) {
            extracted += `${str.slice(1, -1)} `;
          }
        }
        // If nothing extracted, look for readable ASCII sequences
        if (!extracted.trim()) {
          extracted = raw
            .replace(/[^\x20-\x7E\n\r\t]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 2000);
        }
        setEditedContent(extracted.slice(0, 2000));
        setUploadState({
          stage: "review",
          filename: file.name,
          extractedText: extracted.slice(0, 2000),
          fileType: "pdf",
        });
      } else if (ext === "docx" || ext === "pptx") {
        const fileType = ext === "docx" ? "word" : "pptx";
        // DOCX/PPTX are ZIP files — try to extract XML text
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const decoder = new TextDecoder("utf-8", { fatal: false });
        const raw = decoder.decode(bytes);
        // Extract visible text from XML content
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
      // Reset input so same file can be re-selected
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
    const encoded = encodeKnowledgeSource(
      fileType,
      title,
      uploadState.filename,
      content,
    );
    try {
      await addMemory.mutateAsync(encoded);
      toast.success(`${title} stored in DJ's memory`);
      setUploadState({ stage: "idle" });
      setEditedContent("");
      setEditedTitle("");
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
  };

  const handleDeleteSource = async (id: bigint, title: string) => {
    try {
      await deleteMemory.mutateAsync(id);
      toast.success(`"${title}" removed from DJ's memory`);
    } catch {
      toast.error("Failed to delete knowledge source");
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

        <Tabs defaultValue="add">
          <TabsList className="mb-6 grid w-full grid-cols-2 border border-primary/30 bg-card/80">
            <TabsTrigger
              value="add"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Source
            </TabsTrigger>
            <TabsTrigger
              value="sources"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              My Sources
              {knowledgeSources.length > 0 && (
                <Badge className="ml-2 border-primary/30 bg-primary/20 text-primary text-xs">
                  {knowledgeSources.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ─── ADD SOURCE TAB ─── */}
          <TabsContent value="add" className="space-y-6">
            {/* Website Section */}
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

                {/* Content area — shown after fetch or if CORS fails */}
                {(websiteContent || showManualPaste) && (
                  <div className="space-y-2">
                    <Label htmlFor="website-content">
                      {showManualPaste ? (
                        <span className="text-amber-400">
                          Couldn't fetch automatically — paste the page content
                          below:
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
                )}

                {(websiteContent || showManualPaste) && (
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
                )}
              </CardContent>
            </Card>

            {/* File Upload Section */}
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
                  <>
                    {/* Drag & Drop Zone */}
                    {/* biome-ignore lint/a11y/useSemanticElements: drag-and-drop zone requires div for drag events */}
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
                      className={`cursor-pointer rounded-xl border-2 border-dashed transition-all ${
                        isDragging
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_oklch(0.65_0.25_220_/_0.3)]"
                          : "border-primary/30 hover:border-primary/60 hover:bg-primary/5"
                      } p-10 text-center`}
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
                  </>
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

            {/* Tips */}
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

          {/* ─── MY SOURCES TAB ─── */}
          <TabsContent value="sources" className="space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search knowledge sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-primary/30 bg-card/50 pl-9"
              />
            </div>

            {knowledgeSources.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 py-16 text-center">
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
                    // Switch to add tab
                    const addTrigger = document.querySelector(
                      '[value="add"]',
                    ) as HTMLButtonElement | null;
                    addTrigger?.click();
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
                  Try a different search term.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSources.map((source) => (
                  <Card
                    key={source.id.toString()}
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
                          </div>
                          {source.url && source.sourceType === "website" && (
                            <p className="mt-0.5 truncate text-xs text-primary/70">
                              {source.url}
                            </p>
                          )}
                          {source.content && (
                            <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                              {source.content.slice(0, 150)}
                              {source.content.length > 150 ? "…" : ""}
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
                          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive"
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
