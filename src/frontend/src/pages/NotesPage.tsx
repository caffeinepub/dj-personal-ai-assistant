import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Edit2,
  Loader2,
  Plus,
  Search,
  StickyNote,
  Tag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  type Note,
  useAddNote,
  useDeleteNote,
  useNotes,
  useUpdateNote,
} from "../hooks/useQueries";

function generateSummary(content: string): string {
  if (!content.trim()) return "";
  const firstSentence = content.split(/[.!?\n]/)[0].trim();
  if (firstSentence.length > 10 && firstSentence.length <= 120)
    return firstSentence;
  return content.slice(0, 100).trim() + (content.length > 100 ? "..." : "");
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function NotesPage() {
  const { data: notes = [], isLoading } = useNotes();
  const addNote = useAddNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const [viewNote, setViewNote] = useState<Note | null>(null);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");

  const filteredNotes = notes.filter((n) => {
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleAdd = async () => {
    if (!title.trim()) {
      toast.error("Please enter a note title");
      return;
    }
    const summary = generateSummary(content);
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      await addNote.mutateAsync({ title, content, summary, tags: tagList });
      setTitle("");
      setContent("");
      setTags("");
      toast.success("Note saved");
    } catch {
      toast.error("Failed to save note");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteNote.mutateAsync(id);
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const openEdit = (note: Note) => {
    setEditNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(", "));
  };

  const handleUpdate = async () => {
    if (!editNote) return;
    const summary = generateSummary(editContent);
    const tagList = editTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      await updateNote.mutateAsync({
        id: editNote.id,
        title: editTitle,
        content: editContent,
        summary,
        tags: tagList,
      });
      setEditNote(null);
      toast.success("Note updated");
    } catch {
      toast.error("Failed to update note");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto space-y-6 px-4 py-8">
        <div className="flex items-center gap-3">
          <StickyNote className="h-8 w-8 text-primary" />
          <h1 className="glow-text font-display text-3xl font-bold">Notes</h1>
        </div>

        <Card className="glow-border border-primary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Plus className="h-5 w-5 text-primary" /> Capture a Note
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                data-ocid="notes.input"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="note-content">Content</Label>
              <Textarea
                id="note-content"
                data-ocid="notes.textarea"
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="note-tags">
                  <Tag className="mr-1 inline h-3.5 w-3.5" />
                  Tags (comma-separated)
                </Label>
                <Input
                  id="note-tags"
                  data-ocid="notes.input"
                  placeholder="work, ideas, personal..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <Button
                data-ocid="notes.primary_button"
                onClick={handleAdd}
                disabled={addNote.isPending}
                className="shrink-0 bg-primary hover:bg-primary/80"
              >
                {addNote.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Save Note
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            data-ocid="notes.search_input"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div
            data-ocid="notes.loading_state"
            className="py-12 text-center text-muted-foreground"
          >
            Loading notes...
          </div>
        ) : filteredNotes.length === 0 ? (
          <div data-ocid="notes.empty_state" className="py-16 text-center">
            <StickyNote className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">
              {search
                ? "No notes match your search."
                : "No notes yet. Start capturing your thoughts!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note, idx) => (
              <Card
                key={note.id.toString()}
                data-ocid={`notes.item.${idx + 1}`}
                className="group flex cursor-pointer flex-col border-primary/30 transition-all hover:border-primary/60"
                onClick={() => setViewNote(note)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1 text-base font-semibold">
                    {note.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(note.updatedAt)}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 pb-2">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {note.summary || note.content || "No content"}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {note.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="border border-primary/30 bg-primary/15 text-xs text-primary"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="gap-2 pb-3 pt-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    data-ocid={`notes.edit_button.${idx + 1}`}
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(note);
                    }}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="mr-1 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    data-ocid={`notes.delete_button.${idx + 1}`}
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* View Note Dialog */}
        <Dialog open={!!viewNote} onOpenChange={(o) => !o && setViewNote(null)}>
          <DialogContent
            data-ocid="notes.dialog"
            className="max-w-2xl border-primary/40"
          >
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {viewNote?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {viewNote?.content}
              </p>
              {viewNote?.tags && viewNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {viewNote.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="border border-primary/30 bg-primary/15 text-xs text-primary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Updated {viewNote && formatDate(viewNote.updatedAt)}
              </p>
            </div>
            <DialogFooter>
              <Button
                data-ocid="notes.edit_button"
                variant="outline"
                onClick={() => {
                  if (viewNote) {
                    openEdit(viewNote);
                    setViewNote(null);
                  }
                }}
                className="border-primary/40 text-primary"
              >
                <Edit2 className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                data-ocid="notes.close_button"
                variant="ghost"
                onClick={() => setViewNote(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Note Dialog */}
        <Dialog open={!!editNote} onOpenChange={(o) => !o && setEditNote(null)}>
          <DialogContent
            data-ocid="notes.dialog"
            className="max-w-2xl border-primary/40"
          >
            <DialogHeader>
              <DialogTitle className="font-display">Edit Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  data-ocid="notes.input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Content</Label>
                <Textarea
                  data-ocid="notes.textarea"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={6}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tags (comma-separated)</Label>
                <Input
                  data-ocid="notes.input"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="tag1, tag2..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                data-ocid="notes.cancel_button"
                variant="ghost"
                onClick={() => setEditNote(null)}
              >
                Cancel
              </Button>
              <Button
                data-ocid="notes.save_button"
                onClick={handleUpdate}
                disabled={updateNote.isPending}
                className="bg-primary hover:bg-primary/80"
              >
                {updateNote.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="h-4" />
      </div>
    </Layout>
  );
}
