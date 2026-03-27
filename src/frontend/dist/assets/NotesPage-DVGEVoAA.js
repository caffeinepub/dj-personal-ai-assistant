import { T as useNotes, o as useContextEngine, U as useAddNote, V as useUpdateNote, W as useDeleteNote, r as reactExports, j as jsxRuntimeExports, k as ue } from "./index-D4lUgCCM.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D6TXgbbC.js";
import { B as Badge } from "./badge-BMXMPn3_.js";
import { B as Button } from "./createLucideIcon-a11X8bAo.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, e as CardFooter } from "./card-iyETJf1A.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-BpTMTJ9f.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { L as Label } from "./label-Bf9_XisY.js";
import { T as Textarea } from "./textarea-a_o-YPgo.js";
import { L as Layout, c as StickyNote } from "./Layout-y-fTRwTO.js";
import { P as Plus } from "./plus-D6lHqroT.js";
import { T as Tag } from "./tag-DDum-gjq.js";
import { L as LoaderCircle } from "./loader-circle-Tr-8VCUp.js";
import { S as Search } from "./search-CJp6NNRy.js";
import { P as Pen } from "./pen-_5-h5YDk.js";
import { T as Trash2 } from "./trash-2-BvljEyqY.js";
import "./index-DREpW-Gk.js";
import "./proxy-CDDWEtkX.js";
function generateSummary(content) {
  if (!content.trim()) return "";
  const firstSentence = content.split(/[.!?\n]/)[0].trim();
  if (firstSentence.length > 10 && firstSentence.length <= 120)
    return firstSentence;
  return content.slice(0, 100).trim() + (content.length > 100 ? "..." : "");
}
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function NotesPage() {
  const { data: notes = [], isLoading } = useNotes();
  const { logAction } = useContextEngine();
  const addNote = useAddNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const [search, setSearch] = reactExports.useState("");
  const [title, setTitle] = reactExports.useState("");
  const [content, setContent] = reactExports.useState("");
  const [tags, setTags] = reactExports.useState("");
  const [viewNote, setViewNote] = reactExports.useState(null);
  const [editNote, setEditNote] = reactExports.useState(null);
  const [editTitle, setEditTitle] = reactExports.useState("");
  const [editContent, setEditContent] = reactExports.useState("");
  const [editTags, setEditTags] = reactExports.useState("");
  const [deleteNoteId, setDeleteNoteId] = reactExports.useState(null);
  const filteredNotes = notes.filter((n) => {
    const q = search.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q));
  });
  const handleAdd = async () => {
    if (!title.trim()) {
      ue.error("Please enter a note title");
      return;
    }
    const summary = generateSummary(content);
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    try {
      await addNote.mutateAsync({ title, content, summary, tags: tagList });
      setTitle("");
      setContent("");
      setTags("");
      logAction("note_added", title);
      ue.success("Note saved");
    } catch {
      ue.error("Failed to save note");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteNote.mutateAsync(id);
      ue.success("Note deleted");
    } catch {
      ue.error("I'm having trouble deleting that note. Please try again.");
    } finally {
      setDeleteNoteId(null);
    }
  };
  const openEdit = (note) => {
    setEditNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(", "));
  };
  const handleUpdate = async () => {
    if (!editNote) return;
    const summary = generateSummary(editContent);
    const tagList = editTags.split(",").map((t) => t.trim()).filter(Boolean);
    try {
      await updateNote.mutateAsync({
        id: editNote.id,
        title: editTitle,
        content: editContent,
        summary,
        tags: tagList
      });
      setEditNote(null);
      ue.success("Note updated");
    } catch {
      ue.error("Failed to update note");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto space-y-6 px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "h-8 w-8 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "glow-text font-display text-3xl font-bold", children: "Notes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-primary/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 text-primary" }),
          " Capture a Note"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "note-title", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "note-title",
                "data-ocid": "notes.input",
                placeholder: "Note title...",
                value: title,
                onChange: (e) => setTitle(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "note-content", children: "Content" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "note-content",
                "data-ocid": "notes.textarea",
                placeholder: "Write your thoughts...",
                value: content,
                onChange: (e) => setContent(e.target.value),
                rows: 4
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "note-tags", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "mr-1 inline h-3.5 w-3.5" }),
                "Tags (comma-separated)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "note-tags",
                  "data-ocid": "notes.input",
                  placeholder: "work, ideas, personal...",
                  value: tags,
                  onChange: (e) => setTags(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "notes.primary_button",
                onClick: handleAdd,
                disabled: addNote.isPending,
                className: "shrink-0 bg-primary hover:bg-primary/80",
                children: [
                  addNote.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                  "Save Note"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "notes.search_input",
            placeholder: "Search notes...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-10"
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "notes.loading_state",
          className: "py-12 text-center text-muted-foreground",
          children: "Loading notes..."
        }
      ) : filteredNotes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "notes.empty_state", className: "py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "mx-auto mb-3 h-12 w-12 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: search ? "No notes match your search." : "No notes yet. Start capturing your thoughts!" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: filteredNotes.map((note, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": `notes.item.${idx + 1}`,
          className: "group flex cursor-pointer flex-col border-primary/30 transition-all hover:border-primary/60",
          onClick: () => setViewNote(note),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "line-clamp-1 text-base font-semibold", children: note.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatDate(note.updatedAt) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex-1 pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-3 text-sm text-muted-foreground", children: note.summary || note.content || "No content" }),
              note.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1.5", children: note.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "border border-primary/30 bg-primary/15 text-xs text-primary",
                  children: tag
                },
                tag
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { className: "gap-2 pb-3 pt-0 opacity-0 transition-opacity group-hover:opacity-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": `notes.edit_button.${idx + 1}`,
                  variant: "ghost",
                  size: "sm",
                  onClick: (e) => {
                    e.stopPropagation();
                    openEdit(note);
                  },
                  className: "text-primary hover:bg-primary/10",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "mr-1 h-3.5 w-3.5" }),
                    " Edit"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": `notes.delete_button.${idx + 1}`,
                  variant: "ghost",
                  size: "sm",
                  onClick: (e) => {
                    e.stopPropagation();
                    setDeleteNoteId(note.id);
                  },
                  className: "text-destructive hover:bg-destructive/10 min-h-[44px]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1 h-3.5 w-3.5" }),
                    " Delete"
                  ]
                }
              )
            ] })
          ]
        },
        note.id.toString()
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!viewNote, onOpenChange: (o) => !o && setViewNote(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          "data-ocid": "notes.dialog",
          className: "max-w-2xl border-primary/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl", children: viewNote == null ? void 0 : viewNote.title }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-sm leading-relaxed", children: viewNote == null ? void 0 : viewNote.content }),
              (viewNote == null ? void 0 : viewNote.tags) && viewNote.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: viewNote.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: "border border-primary/30 bg-primary/15 text-xs text-primary",
                  children: tag
                },
                tag
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Updated ",
                viewNote && formatDate(viewNote.updatedAt)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "notes.edit_button",
                  variant: "outline",
                  onClick: () => {
                    if (viewNote) {
                      openEdit(viewNote);
                      setViewNote(null);
                    }
                  },
                  className: "border-primary/40 text-primary",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "mr-2 h-4 w-4" }),
                    " Edit"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "notes.close_button",
                  variant: "ghost",
                  onClick: () => setViewNote(null),
                  children: "Close"
                }
              )
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editNote, onOpenChange: (o) => !o && setEditNote(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          "data-ocid": "notes.dialog",
          className: "max-w-2xl border-primary/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Edit Note" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "notes.input",
                    value: editTitle,
                    onChange: (e) => setEditTitle(e.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Content" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    "data-ocid": "notes.textarea",
                    value: editContent,
                    onChange: (e) => setEditContent(e.target.value),
                    rows: 6
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tags (comma-separated)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "notes.input",
                    value: editTags,
                    onChange: (e) => setEditTags(e.target.value),
                    placeholder: "tag1, tag2..."
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "notes.cancel_button",
                  variant: "ghost",
                  onClick: () => setEditNote(null),
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "notes.save_button",
                  onClick: handleUpdate,
                  disabled: updateNote.isPending,
                  className: "bg-primary hover:bg-primary/80",
                  children: [
                    updateNote.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                    "Save Changes"
                  ]
                }
              )
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: deleteNoteId !== null,
        onOpenChange: (open) => {
          if (!open) setDeleteNoteId(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "notes.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this note?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This action cannot be undone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogCancel,
              {
                "data-ocid": "notes.cancel_button",
                onClick: () => setDeleteNoteId(null),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                "data-ocid": "notes.confirm_button",
                onClick: () => deleteNoteId !== null && handleDelete(deleteNoteId),
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
  NotesPage
};
