import { b as useMemories, J as useKnowledgeFolders, x as useDeleteMemory, K as useCreateKnowledgeFolder, M as useDeleteKnowledgeFolder, r as reactExports, w as useAddMemory, j as jsxRuntimeExports, k as ue, N as useWikiPageByFolder, O as useSaveWikiPage } from "./index-D4lUgCCM.js";
import { B as Badge } from "./badge-BMXMPn3_.js";
import { c as createLucideIcon, B as Button } from "./createLucideIcon-a11X8bAo.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-iyETJf1A.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-BpTMTJ9f.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { L as Label } from "./label-Bf9_XisY.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C5iF8xTu.js";
import { S as Sheet, a as SheetContent } from "./sheet-C7--ZfiQ.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-eotKpg0e.js";
import { T as Textarea } from "./textarea-a_o-YPgo.js";
import { L as Layout, a as BookOpen, G as Globe, X } from "./Layout-y-fTRwTO.js";
import { p as parseKnowledgeSource, s as searchKnowledgeSources, a as getStaleSourceIds, b as getFollowedTopics, c as setRefreshMeta, d as getRefreshMeta, e as isSourceStale, f as extractTextFromHtml, h as encodeKnowledgeSource, j as generateTopicSuggestions, k as addFollowedTopic, r as removeFollowedTopic } from "./knowledgeSources-u_u5fZVB.js";
import { L as LoaderCircle } from "./loader-circle-Tr-8VCUp.js";
import { C as ChevronDown } from "./chevron-up-QZ-Q9T3F.js";
import { C as ChevronRight } from "./chevron-right-v95zRAxR.js";
import { P as Plus } from "./plus-D6lHqroT.js";
import { S as Search } from "./search-CJp6NNRy.js";
import { S as Sparkles } from "./sparkles-DIDRgt7x.js";
import { T as Trash2 } from "./trash-2-BvljEyqY.js";
import { U as Upload } from "./upload-BakjCDt6.js";
import { T as Tag } from "./tag-DDum-gjq.js";
import "./index-DREpW-Gk.js";
import "./proxy-CDDWEtkX.js";
import "./index-IXOTxK3N.js";
import "./index-Cj4N10C2.js";
import "./check-CyKGSNZc.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$b);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$a);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M9 13v-1h6v1", key: "1bb014" }],
  ["path", { d: "M12 12v6", key: "3ahymv" }],
  ["path", { d: "M11 18h2", key: "12mj7e" }]
];
const FileType = createLucideIcon("file-type", __iconNode$9);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
];
const FolderOpen = createLucideIcon("folder-open", __iconNode$8);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
];
const Folder = createLucideIcon("folder", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", key: "1cjeqo" }],
  ["path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", key: "19qd67" }]
];
const Link = createLucideIcon("link", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M12 20h9", key: "t2du7b" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
      key: "1ykcvy"
    }
  ]
];
const PenLine = createLucideIcon("pen-line", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M2 3h20", key: "91anmk" }],
  ["path", { d: "M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3", key: "2k9sn8" }],
  ["path", { d: "m7 21 5-5 5 5", key: "bip4we" }]
];
const Presentation = createLucideIcon("presentation", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "14sxne" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16", key: "1hlbsb" }],
  ["path", { d: "M16 16h5v5", key: "ccwih5" }]
];
const RefreshCcw = createLucideIcon("refresh-ccw", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M4 11a9 9 0 0 1 9 9", key: "pv89mb" }],
  ["path", { d: "M4 4a16 16 0 0 1 16 16", key: "k0647b" }],
  ["circle", { cx: "5", cy: "19", r: "1", key: "bfqh0e" }]
];
const Rss = createLucideIcon("rss", __iconNode$1);
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
      d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
      key: "ul74o6"
    }
  ],
  ["path", { d: "m14 7 3 3", key: "1r5n42" }],
  ["path", { d: "M5 6v4", key: "ilb8ba" }],
  ["path", { d: "M19 14v4", key: "blhpug" }],
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M7 8H3", key: "zfb6yr" }],
  ["path", { d: "M21 16h-4", key: "1cnmox" }],
  ["path", { d: "M11 3H9", key: "1obp7u" }]
];
const WandSparkles = createLucideIcon("wand-sparkles", __iconNode);
const PRESET_CATEGORIES = [
  "Work",
  "Personal",
  "Technical",
  "Research",
  "Other"
];
function SourceTypeIcon({ type }) {
  switch (type) {
    case "website":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" });
    case "pdf":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" });
    case "word":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(FileType, { className: "h-4 w-4" });
    case "pptx":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Presentation, { className: "h-4 w-4" });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" });
  }
}
function SourceTypeBadge({ type }) {
  const styles = {
    website: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    pdf: "bg-red-500/20 text-red-300 border-red-500/40",
    word: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    pptx: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    txt: "bg-green-500/20 text-green-300 border-green-500/40"
  };
  const labels = {
    website: "Website",
    pdf: "PDF",
    word: "Word",
    pptx: "PowerPoint",
    txt: "Text"
  };
  const cls = styles[type] || "bg-muted/20 text-muted-foreground border-muted/40";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      className: `flex items-center gap-1 border text-xs font-medium ${cls}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SourceTypeIcon, { type }),
        labels[type] || type.toUpperCase()
      ]
    }
  );
}
function CategorySelector({
  value,
  onChange,
  allCategories,
  onAddCustom
}) {
  const [showCustomInput, setShowCustomInput] = reactExports.useState(false);
  const [customInput, setCustomInput] = reactExports.useState("");
  const handleAdd = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    onAddCustom(trimmed);
    onChange(trimmed);
    setCustomInput("");
    setShowCustomInput(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3.5 w-3.5" }),
      "Category"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Select,
      {
        value,
        onValueChange: (v) => {
          if (v === "__custom__") {
            setShowCustomInput(true);
          } else {
            onChange(v);
            setShowCustomInput(false);
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              "data-ocid": "knowledge.category_select",
              className: "border-primary/30 bg-card/50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a category" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "border-primary/30 bg-card", children: [
            allCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: cat }, cat)),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__custom__", className: "text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              "Add custom category..."
            ] }) })
          ] })
        ]
      }
    ),
    showCustomInput && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "knowledge.custom_category_input",
          placeholder: "New category name",
          value: customInput,
          onChange: (e) => setCustomInput(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && handleAdd(),
          className: "border-primary/30 bg-card/50 text-sm",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "knowledge.custom_category_button",
          size: "sm",
          onClick: handleAdd,
          disabled: !customInput.trim(),
          className: "shrink-0 bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => {
            setShowCustomInput(false);
            setCustomInput("");
          },
          className: "shrink-0 text-muted-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] })
  ] });
}
function FolderPicker({
  folders,
  value,
  onChange
}) {
  const buildPath = (id) => {
    const folder = folders.find((f) => f.id === id);
    if (!folder) return "";
    if (folder.parentId === null) return folder.name;
    return `${buildPath(folder.parentId)} > ${folder.name}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-3.5 w-3.5" }),
      "Save to Folder"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Select,
      {
        value: value ?? "__root__",
        onValueChange: (v) => onChange(v === "__root__" ? null : v),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              "data-ocid": "knowledge.folder_select",
              className: "border-primary/30 bg-card/50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "No folder (root)" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "border-primary/30 bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__root__", children: "No folder (root)" }),
            folders.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(f.id), children: buildPath(f.id) }, String(f.id)))
          ] })
        ]
      }
    )
  ] });
}
function buildTree(folders) {
  const map = /* @__PURE__ */ new Map();
  for (const f of folders) {
    map.set(String(f.id), { ...f, children: [] });
  }
  const roots = [];
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
  sourceCounts
}) {
  const [expanded, setExpanded] = reactExports.useState(true);
  const isSelected = selectedFolderId === String(node.id);
  const count = sourceCounts[String(node.id)] ?? 0;
  const hasChildren = node.children.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `group flex items-center gap-1 rounded-lg px-2 py-1.5 transition-all cursor-pointer ${isSelected ? "bg-primary/20 border border-primary/50 text-primary" : "hover:bg-white/5 text-muted-foreground hover:text-foreground"}`,
        style: { paddingLeft: `${8 + depth * 16}px` },
        children: [
          hasChildren ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              },
              className: "shrink-0 rounded p-0.5 hover:bg-white/10",
              children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "flex min-w-0 flex-1 items-center gap-1.5",
              onClick: () => onSelect(String(node.id)),
              children: [
                isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "h-4 w-4 shrink-0 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-4 w-4 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm font-medium", children: node.name }),
                count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto shrink-0 border-primary/30 bg-primary/10 text-primary text-xs", children: count })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "knowledge.folder.delete_button",
              onClick: (e) => {
                e.stopPropagation();
                onDelete(node.id, node.name);
              },
              className: "ml-1 shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-all hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100",
              title: `Delete "${node.name}"`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ]
      }
    ),
    hasChildren && expanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: node.children.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      FolderTreeNode,
      {
        node: child,
        depth: depth + 1,
        selectedFolderId,
        onSelect,
        onDelete,
        sourceCounts
      },
      String(child.id)
    )) })
  ] });
}
function FolderTree({
  folders,
  selectedFolderId,
  onSelect,
  onDelete,
  onCreate,
  sourceCounts
}) {
  const [showNewFolder, setShowNewFolder] = reactExports.useState(false);
  const [newFolderName, setNewFolderName] = reactExports.useState("");
  const [newFolderParent, setNewFolderParent] = reactExports.useState("__root__");
  const tree = buildTree(folders);
  const handleCreate = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const parentId = newFolderParent === "__root__" ? null : BigInt(newFolderParent);
    onCreate(name, parentId);
    setNewFolderName("");
    setNewFolderParent("__root__");
    setShowNewFolder(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "knowledge.all_sources.button",
        onClick: () => onSelect(null),
        className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${selectedFolderId === null ? "bg-primary/20 border border-primary/50 text-primary" : "hover:bg-white/5 text-muted-foreground hover:text-foreground"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "All Sources" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto border-primary/30 bg-primary/10 text-primary text-xs", children: Object.values(sourceCounts).reduce((a, b) => a + b, 0) })
        ]
      }
    ),
    tree.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 py-2 text-xs text-muted-foreground/60", children: "No folders yet" }),
    tree.map((node) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      FolderTreeNode,
      {
        node,
        depth: 0,
        selectedFolderId,
        onSelect,
        onDelete,
        sourceCounts
      },
      String(node.id)
    )),
    showNewFolder ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2 rounded-lg border border-primary/30 bg-card/50 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "knowledge.new_folder.input",
          autoFocus: true,
          placeholder: "Folder name",
          value: newFolderName,
          onChange: (e) => setNewFolderName(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && handleCreate(),
          className: "border-primary/30 bg-background/50 text-sm h-8"
        }
      ),
      folders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: newFolderParent, onValueChange: setNewFolderParent, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "border-primary/30 bg-background/50 text-xs h-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Parent folder (optional)" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "border-primary/30 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__root__", children: "No parent (root)" }),
          folders.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(f.id), children: f.name }, String(f.id)))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "knowledge.new_folder.submit_button",
            size: "sm",
            onClick: handleCreate,
            disabled: !newFolderName.trim(),
            className: "flex-1 h-7 text-xs bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30",
            children: "Create"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => {
              setShowNewFolder(false);
              setNewFolderName("");
            },
            className: "h-7 text-xs text-muted-foreground",
            children: "Cancel"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "knowledge.new_folder.button",
        onClick: () => setShowNewFolder(true),
        className: "mt-1 flex w-full items-center gap-2 rounded-lg border border-dashed border-primary/30 px-3 py-1.5 text-xs text-primary/60 transition-all hover:border-primary/60 hover:text-primary",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          "New Folder"
        ]
      }
    )
  ] });
}
function WikiPageEditor({
  folderId,
  folderName,
  sources
}) {
  const { data: existingWiki, isLoading } = useWikiPageByFolder(folderId);
  const saveWiki = useSaveWikiPage();
  const [overview, setOverview] = reactExports.useState("");
  const [keyConcepts, setKeyConcepts] = reactExports.useState("");
  const [tips, setTips] = reactExports.useState("");
  const [isGenerating, setIsGenerating] = reactExports.useState(false);
  const [isDirty, setIsDirty] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (existingWiki) {
      setOverview(existingWiki.overviewSection);
      setKeyConcepts(existingWiki.keyConceptsSection);
      setTips(existingWiki.tipsSection);
      setIsDirty(false);
    }
  }, [existingWiki]);
  const generateFromSources = () => {
    if (sources.length === 0) {
      ue.error("Add some sources to this folder first");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const titles = sources.map((s) => s.title).join(", ");
      const summaries = sources.map((s) => s.summary || s.content.slice(0, 150)).filter(Boolean).join(" ");
      const generatedOverview = `This folder contains ${sources.length} source${sources.length !== 1 ? "s" : ""} related to ${folderName}. Key resources include: ${titles}. ${summaries.slice(0, 300)}`;
      const allText = sources.map((s) => `${s.title} ${s.summary} ${s.content.slice(0, 500)}`).join(" ").toLowerCase();
      const stopWords = /* @__PURE__ */ new Set([
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
        "if"
      ]);
      const words = allText.match(/\b[a-z][a-z]{3,}\b/g) ?? [];
      const freq = /* @__PURE__ */ new Map();
      for (const w of words) {
        if (!stopWords.has(w)) freq.set(w, (freq.get(w) ?? 0) + 1);
      }
      const topTerms = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([w]) => `• ${w.charAt(0).toUpperCase() + w.slice(1)}`);
      const sourceConcepts = sources.map((s) => `• ${s.title}`);
      const allConcepts = [...sourceConcepts, ...topTerms].slice(0, 12);
      const generatedKeyConcepts = allConcepts.join("\n");
      const tipLines = sources.flatMap((s) => {
        const sentences = (s.summary || s.content.slice(0, 400)).split(/[.!?]/).map((s2) => s2.trim()).filter((s2) => s2.length > 30);
        return sentences.slice(0, 2).map((t) => `• ${t}.`);
      }).slice(0, 6);
      const generatedTips = tipLines.length > 0 ? tipLines.join("\n") : `• Review all ${sources.length} sources in this folder for comprehensive knowledge.
• Use DJ's chat to ask questions about ${folderName} — it will reference these sources.`;
      setOverview(generatedOverview);
      setKeyConcepts(generatedKeyConcepts);
      setTips(generatedTips);
      setIsDirty(true);
      setIsGenerating(false);
      ue.success("Wiki page generated from sources");
    }, 800);
  };
  const handleSave = async () => {
    try {
      await saveWiki.mutateAsync({ folderId, overview, keyConcepts, tips });
      setIsDirty(false);
      ue.success("Wiki page saved");
    } catch {
      ue.error("Failed to save wiki page");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "knowledge.wiki.loading_state",
        className: "flex items-center justify-center py-16",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-muted-foreground", children: [
          "Auto-generated from ",
          sources.length,
          " source",
          sources.length !== 1 ? "s" : "",
          " · editable"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "knowledge.wiki.generate_button",
            size: "sm",
            onClick: generateFromSources,
            disabled: isGenerating || sources.length === 0,
            className: "border border-secondary/40 bg-secondary/10 text-secondary hover:bg-secondary/20",
            children: [
              isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "mr-1.5 h-3.5 w-3.5" }),
              "Generate from Sources"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "knowledge.wiki.save_button",
            size: "sm",
            onClick: handleSave,
            disabled: saveWiki.isPending || !overview && !keyConcepts && !tips,
            className: `border ${isDirty ? "border-primary/60 bg-primary/20 text-primary hover:bg-primary/30" : "border-primary/30 bg-primary/10 text-primary/70 hover:bg-primary/20"}`,
            children: [
              saveWiki.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "mr-1.5 h-3.5 w-3.5" }),
              "Save Wiki Page"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-5 w-5 items-center justify-center rounded bg-primary/20 text-primary text-xs", children: "①" }),
        "Overview"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          "data-ocid": "knowledge.wiki.overview.textarea",
          placeholder: "Write a 2-3 sentence overview of what this folder is about...",
          value: overview,
          onChange: (e) => {
            setOverview(e.target.value);
            setIsDirty(true);
          },
          rows: 4,
          className: "border-primary/30 bg-card/50 text-sm resize-none focus:border-primary/70"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-5 w-5 items-center justify-center rounded bg-secondary/20 text-secondary text-xs", children: "②" }),
        "Key Concepts"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          "data-ocid": "knowledge.wiki.key_concepts.textarea",
          placeholder: "List key terms, concepts, and topics (one per line, use • for bullets)...",
          value: keyConcepts,
          onChange: (e) => {
            setKeyConcepts(e.target.value);
            setIsDirty(true);
          },
          rows: 6,
          className: "border-primary/30 bg-card/50 text-sm resize-none font-mono focus:border-primary/70"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-5 w-5 items-center justify-center rounded bg-accent/20 text-accent text-xs", children: "③" }),
        "Tips"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          "data-ocid": "knowledge.wiki.tips.textarea",
          placeholder: "Practical tips, best practices, and insights from your sources...",
          value: tips,
          onChange: (e) => {
            setTips(e.target.value);
            setIsDirty(true);
          },
          rows: 5,
          className: "border-primary/30 bg-card/50 text-sm resize-none focus:border-primary/70"
        }
      )
    ] }),
    !overview && !keyConcepts && !tips && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "knowledge.wiki.empty_state",
        className: "flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/30 py-10 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-10 w-10 text-primary/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-muted-foreground", children: "No wiki page yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground/60", children: 'Click "Generate from Sources" to auto-fill, then edit and save.' })
          ] })
        ]
      }
    )
  ] });
}
function FolderBreadcrumb({
  folderId,
  folders,
  onNavigate
}) {
  const buildPath = (id) => {
    const folder = folders.find((f) => String(f.id) === id);
    if (!folder) return [];
    if (folder.parentId === null) return [folder];
    return [...buildPath(String(folder.parentId)), folder];
  };
  const path = buildPath(folderId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => onNavigate(null),
        className: "text-muted-foreground transition-colors hover:text-primary",
        children: "All Sources"
      }
    ),
    path.map((folder) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onNavigate(String(folder.id)),
          className: `transition-colors ${String(folder.id) === folderId ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"}`,
          children: folder.name
        }
      )
    ] }, String(folder.id)))
  ] });
}
function SourceCard({
  source,
  onDelete,
  onRefresh,
  index
}) {
  const id = String(source.id);
  const meta = getRefreshMeta()[id];
  const interval = (meta == null ? void 0 : meta.interval) ?? "none";
  const stale = isSourceStale(id);
  const [isRefreshing, setIsRefreshing] = reactExports.useState(false);
  const formatTs = (ts) => {
    const d = new Date(Number(ts) / 1e6);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };
  const handleIntervalChange = (val) => {
    setRefreshMeta(id, {
      lastRefreshed: (meta == null ? void 0 : meta.lastRefreshed) ?? Date.now(),
      interval: val
    });
    window.dispatchEvent(new CustomEvent("dj_refresh_meta_changed"));
  };
  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh(source);
      setRefreshMeta(id, { lastRefreshed: Date.now(), interval });
      window.dispatchEvent(new CustomEvent("dj_refresh_meta_changed"));
      ue.success(`"${source.title}" refreshed`);
    } catch {
      ue.error("Refresh failed");
    } finally {
      setIsRefreshing(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `knowledge.sources.item.${index}`,
      className: `group relative flex items-start gap-3 rounded-xl border bg-card/50 p-4 transition-all hover:bg-card/80 ${stale ? "border-amber-500/40 hover:border-amber-500/60" : "border-primary/20 hover:border-primary/40"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SourceTypeIcon, { type: source.sourceType }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate flex-1", children: source.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SourceTypeBadge, { type: source.sourceType }),
            stale && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border-amber-500/50 bg-amber-500/15 text-amber-400 text-xs", children: "Stale" }),
            source.category && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border-secondary/30 bg-secondary/10 text-secondary text-xs", children: source.category })
          ] }),
          source.url && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground/60 truncate", children: source.url }),
          source.summary && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground line-clamp-2", children: source.summary }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/50", children: formatTs(source.timestamp) }),
            source.sourceType === "website" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: interval, onValueChange: handleIntervalChange, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": `knowledge.sources.refresh_interval.select.${index}`,
                    className: "h-6 border-primary/20 bg-card/30 text-xs w-28 px-2 py-0",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "border-primary/30 bg-card text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "No refresh" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "daily", children: "Daily" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "weekly", children: "Weekly" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "monthly", children: "Monthly" })
                ] })
              ] }),
              interval !== "none" && onRefresh && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `knowledge.sources.refresh.button.${index}`,
                  onClick: handleRefresh,
                  disabled: isRefreshing,
                  title: "Re-fetch this URL now",
                  className: "rounded p-0.5 text-muted-foreground hover:text-primary disabled:opacity-50",
                  children: isRefreshing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-3.5 w-3.5" })
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `knowledge.sources.delete_button.${index}`,
            onClick: () => onDelete(source.id, source.title),
            className: "ml-1 shrink-0 rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100",
            title: "Remove from memory",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
          }
        )
      ]
    }
  );
}
function DeleteFolderDialog({
  folderName,
  open,
  onConfirm,
  onCancel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      "data-ocid": "knowledge.delete_folder.dialog",
      className: "border-primary/30 bg-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Delete Folder" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Delete ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
            '"',
            folderName,
            '"'
          ] }),
          "? Sources inside won't be deleted, but they'll no longer be organized under this folder."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "knowledge.delete_folder.cancel_button",
              variant: "ghost",
              onClick: onCancel,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "knowledge.delete_folder.confirm_button",
              onClick: onConfirm,
              className: "bg-destructive/20 border border-destructive/40 text-destructive hover:bg-destructive/30",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                "Delete Folder"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function AddSourceForm({
  allCategories,
  folders,
  onAddCustomCategory,
  defaultFolderId
}) {
  const addMemory = useAddMemory();
  const [tab, setTab] = reactExports.useState("website");
  const [websiteUrl, setWebsiteUrl] = reactExports.useState("");
  const [websiteTitle, setWebsiteTitle] = reactExports.useState("");
  const [websiteContent, setWebsiteContent] = reactExports.useState("");
  const [websiteCategory, setWebsiteCategory] = reactExports.useState("General");
  const [websiteFolderId, setWebsiteFolderId] = reactExports.useState(
    defaultFolderId
  );
  const [showManualPaste, setShowManualPaste] = reactExports.useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = reactExports.useState(false);
  const [uploadState, setUploadState] = reactExports.useState({
    stage: "idle"
  });
  const [editedContent, setEditedContent] = reactExports.useState("");
  const [editedTitle, setEditedTitle] = reactExports.useState("");
  const [fileCategory, setFileCategory] = reactExports.useState("General");
  const [fileFolderId, setFileFolderId] = reactExports.useState(
    defaultFolderId
  );
  const fileInputRef = reactExports.useRef(null);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [lastSaved, setLastSaved] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setWebsiteFolderId(defaultFolderId);
    setFileFolderId(defaultFolderId);
  }, [defaultFolderId]);
  const handleFetchWebsite = async () => {
    if (!websiteUrl.trim()) {
      ue.error("Please enter a URL");
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
      setWebsiteContent(text.slice(0, 2e3));
      if (!websiteTitle.trim()) {
        try {
          setWebsiteTitle(new URL(url).hostname);
        } catch {
          setWebsiteTitle(url);
        }
      }
      ue.success("Website content fetched");
    } catch {
      setShowManualPaste(true);
      if (!websiteTitle.trim()) {
        try {
          setWebsiteTitle(new URL(url).hostname);
        } catch {
          setWebsiteTitle(url);
        }
      }
      ue.info("Couldn't fetch automatically — paste content below");
    } finally {
      setIsFetchingUrl(false);
    }
  };
  const handleSaveWebsite = async () => {
    if (!websiteUrl.trim()) {
      ue.error("Please enter a URL");
      return;
    }
    const content = websiteContent.trim();
    if (!content) {
      ue.error("No content to save — please paste the website content");
      return;
    }
    let hostname = websiteUrl;
    try {
      hostname = new URL(
        websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`
      ).hostname;
    } catch {
    }
    const title = websiteTitle.trim() || hostname;
    const category = websiteCategory || "General";
    const encoded = encodeKnowledgeSource(
      "website",
      title,
      websiteUrl,
      content,
      category,
      websiteFolderId ?? void 0
    );
    try {
      await addMemory.mutateAsync(encoded);
      const summary = content.replace(/\s+/g, " ").trim().slice(0, 200);
      setLastSaved({ title, summary, sourceType: "website", category });
      ue.success("Website stored in DJ's memory");
      setWebsiteUrl("");
      setWebsiteTitle("");
      setWebsiteContent("");
      setWebsiteCategory("General");
      setShowManualPaste(false);
    } catch {
      ue.error("Failed to save website content");
    }
  };
  const processFile = reactExports.useCallback(async (file) => {
    var _a;
    setUploadState({ stage: "reading" });
    setEditedTitle(file.name.replace(/\.[^.]+$/, ""));
    const ext = ((_a = file.name.split(".").pop()) == null ? void 0 : _a.toLowerCase()) || "";
    try {
      if (ext === "txt" || ext === "md") {
        const text = await file.text();
        setEditedContent(text.slice(0, 2e3));
        setUploadState({
          stage: "review",
          filename: file.name,
          extractedText: text.slice(0, 2e3),
          fileType: "txt"
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
          extracted = raw.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim().slice(0, 2e3);
        setEditedContent(extracted.slice(0, 2e3));
        setUploadState({
          stage: "review",
          filename: file.name,
          extractedText: extracted.slice(0, 2e3),
          fileType: "pdf"
        });
      } else if (ext === "docx" || ext === "pptx") {
        const fileType = ext === "docx" ? "word" : "pptx";
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const decoder = new TextDecoder("utf-8", { fatal: false });
        const raw = decoder.decode(bytes);
        const xmlText = raw.replace(/<[^>]+>/g, " ").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim().slice(0, 2e3);
        setEditedContent(xmlText);
        setUploadState({
          stage: "review",
          filename: file.name,
          extractedText: xmlText,
          fileType
        });
      } else {
        ue.error(`Unsupported file type: .${ext}`);
        setUploadState({ stage: "idle" });
      }
    } catch {
      ue.error("Failed to read file");
      setUploadState({ stage: "idle" });
    }
  }, []);
  const handleFileDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );
  const handleFileSelect = reactExports.useCallback(
    (e) => {
      var _a;
      const file = (_a = e.target.files) == null ? void 0 : _a[0];
      if (file) processFile(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [processFile]
  );
  const handleSaveFile = async () => {
    if (uploadState.stage !== "review") return;
    const content = editedContent.trim();
    if (!content) {
      ue.error("No content to save");
      return;
    }
    setUploadState({ stage: "saving" });
    const fileType = uploadState.fileType;
    const title = editedTitle.trim() || uploadState.filename;
    const category = fileCategory || "General";
    const encoded = encodeKnowledgeSource(
      fileType,
      title,
      uploadState.filename,
      content,
      category,
      fileFolderId ?? void 0
    );
    try {
      await addMemory.mutateAsync(encoded);
      const summary = content.replace(/\s+/g, " ").trim().slice(0, 200);
      setLastSaved({ title, summary, sourceType: fileType, category });
      ue.success(`${title} stored in DJ's memory`);
      setUploadState({ stage: "idle" });
      setEditedContent("");
      setEditedTitle("");
      setFileCategory("General");
    } catch {
      ue.error("Failed to save file content");
      setUploadState({
        stage: "review",
        filename: uploadState.filename,
        extractedText: uploadState.extractedText,
        fileType: uploadState.fileType
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    lastSaved && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "knowledge.summary_card",
        className: "relative rounded-xl border border-primary/50 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setLastSaved(null),
              className: "absolute right-2 top-2 rounded p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 pr-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: lastSaved.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SourceTypeBadge, { type: lastSaved.sourceType })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground line-clamp-2", children: lastSaved.summary }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-xs text-primary/60", children: "✓ Saved to DJ's memory" })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 border-b border-primary/20 pb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setTab("website"),
          className: `flex items-center gap-1.5 rounded-t-lg px-3 py-1.5 text-sm font-medium transition-all ${tab === "website" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }),
            "Website URL"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setTab("file"),
          className: `flex items-center gap-1.5 rounded-t-lg px-3 py-1.5 text-sm font-medium transition-all ${tab === "file" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
            "Upload File"
          ]
        }
      )
    ] }),
    tab === "website" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-3.5 w-3.5" }),
          "Website URL"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "knowledge.website_url.input",
              placeholder: "https://example.com",
              value: websiteUrl,
              onChange: (e) => setWebsiteUrl(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleFetchWebsite(),
              className: "border-primary/30 bg-card/50"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "knowledge.website_fetch.button",
              onClick: handleFetchWebsite,
              disabled: isFetchingUrl || !websiteUrl.trim(),
              className: "shrink-0 border border-primary/40 bg-primary/20 text-primary hover:bg-primary/30",
              children: [
                isFetchingUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "mr-2 h-4 w-4" }),
                "Fetch"
              ]
            }
          )
        ] })
      ] }),
      (websiteContent || showManualPaste) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "knowledge.website_title.input",
              placeholder: "Source title",
              value: websiteTitle,
              onChange: (e) => setWebsiteTitle(e.target.value),
              className: "border-primary/30 bg-card/50"
            }
          )
        ] }),
        showManualPaste && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Paste Content Manually" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              "data-ocid": "knowledge.website_content.textarea",
              placeholder: "Paste the page content here...",
              value: websiteContent,
              onChange: (e) => setWebsiteContent(e.target.value),
              rows: 5,
              className: "border-primary/30 bg-card/50 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CategorySelector,
          {
            value: websiteCategory,
            onChange: setWebsiteCategory,
            allCategories,
            onAddCustom: onAddCustomCategory
          }
        ),
        folders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          FolderPicker,
          {
            folders,
            value: websiteFolderId,
            onChange: setWebsiteFolderId
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "knowledge.website_save.button",
            onClick: handleSaveWebsite,
            disabled: addMemory.isPending || !websiteContent.trim(),
            className: "w-full border border-primary/40 bg-primary/20 text-primary hover:bg-primary/30",
            children: [
              addMemory.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "mr-2 h-4 w-4" }),
              "Save to DJ's Memory"
            ]
          }
        )
      ] })
    ] }),
    tab === "file" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: uploadState.stage === "idle" || uploadState.stage === "reading" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "knowledge.file.dropzone",
        onDrop: handleFileDrop,
        onDragOver: (e) => {
          e.preventDefault();
          setIsDragging(true);
        },
        onDragLeave: () => setIsDragging(false),
        className: `flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${isDragging ? "border-primary bg-primary/10" : "border-primary/30 hover:border-primary/60 hover:bg-primary/5"}`,
        onKeyDown: (e) => {
          var _a;
          return e.key === "Enter" && ((_a = fileInputRef.current) == null ? void 0 : _a.click());
        },
        onClick: () => {
          var _a;
          return (_a = fileInputRef.current) == null ? void 0 : _a.click();
        },
        children: [
          uploadState.stage === "reading" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-10 w-10 animate-spin text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-10 w-10 text-primary/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: uploadState.stage === "reading" ? "Reading file..." : "Drop file or click to upload" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "PDF, Word (.docx), PowerPoint (.pptx), .txt, .md" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: ".pdf,.docx,.pptx,.txt,.md",
              onChange: handleFileSelect,
              className: "hidden"
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: uploadState.stage !== "saving" && uploadState.filename })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "knowledge.file_title.input",
            value: editedTitle,
            onChange: (e) => setEditedTitle(e.target.value),
            className: "border-primary/30 bg-card/50"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Extracted Content (edit if needed)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            "data-ocid": "knowledge.file_content.textarea",
            value: editedContent,
            onChange: (e) => setEditedContent(e.target.value),
            rows: 5,
            className: "border-primary/30 bg-card/50 text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CategorySelector,
        {
          value: fileCategory,
          onChange: setFileCategory,
          allCategories,
          onAddCustom: onAddCustomCategory
        }
      ),
      folders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        FolderPicker,
        {
          folders,
          value: fileFolderId,
          onChange: setFileFolderId
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "knowledge.file_save.button",
            onClick: handleSaveFile,
            disabled: uploadState.stage === "saving" || !editedContent.trim(),
            className: "flex-1 border border-primary/40 bg-primary/20 text-primary hover:bg-primary/30",
            children: [
              uploadState.stage === "saving" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "mr-2 h-4 w-4" }),
              "Save to DJ's Memory"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            onClick: () => {
              setUploadState({ stage: "idle" });
              setEditedContent("");
              setEditedTitle("");
            },
            className: "text-muted-foreground",
            children: "Cancel"
          }
        )
      ] })
    ] }) })
  ] });
}
function FollowTopicsTab({
  onFetchAndAdd,
  fetchingUrls,
  addedUrls
}) {
  const [topics, setTopics] = reactExports.useState(() => getFollowedTopics());
  const [inputVal, setInputVal] = reactExports.useState("");
  const refresh = () => setTopics(getFollowedTopics());
  const handleFollow = () => {
    const t = inputVal.trim();
    if (!t) return;
    addFollowedTopic(t);
    setInputVal("");
    refresh();
  };
  const handleUnfollow = (topic) => {
    removeFollowedTopic(topic);
    refresh();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/40 glow-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rss, { className: "h-5 w-5 text-secondary" }),
          "Auto-Research Mode"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Follow topics and DJ will suggest new URLs to fetch periodically to keep your knowledge current." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "knowledge.follow.input",
            placeholder: 'e.g. "Bitcoin", "Cybersecurity", "AI"',
            value: inputVal,
            onChange: (e) => setInputVal(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && handleFollow(),
            className: "border-primary/30 bg-card/50"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "knowledge.follow.button",
            onClick: handleFollow,
            disabled: !inputVal.trim(),
            className: "shrink-0 border border-secondary/40 bg-secondary/10 text-secondary hover:bg-secondary/20",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Rss, { className: "mr-2 h-4 w-4" }),
              "Follow"
            ]
          }
        )
      ] }) })
    ] }),
    topics.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "knowledge.follow.empty_state",
        className: "flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/30 py-14 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rss, { className: "h-10 w-10 text-primary/20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-muted-foreground", children: "No followed topics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground/60", children: "Follow a topic above to see URL suggestions here." })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: topics.map((topic, ti) => {
      const suggestions = generateTopicSuggestions(topic);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          "data-ocid": `knowledge.follow.item.${ti + 1}`,
          className: "border-primary/30 bg-card/50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Rss, { className: "h-4 w-4 text-secondary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: topic })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `knowledge.follow.delete_button.${ti + 1}`,
                  onClick: () => handleUnfollow(topic),
                  className: "rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive",
                  title: "Unfollow topic",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                suggestions.length,
                " suggested sources"
              ] }),
              suggestions.map((s) => {
                const isAdded = addedUrls.has(s.url);
                const isFetching = fetchingUrls[s.url];
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `flex items-start gap-3 rounded-lg border p-3 transition-all ${isAdded ? "border-green-500/40 bg-green-500/5" : "border-primary/20 bg-card/30 hover:border-primary/40"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "mt-0.5 h-4 w-4 shrink-0 text-blue-400" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: s.title }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 truncate", children: s.url })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          "data-ocid": "knowledge.follow.add_source.button",
                          size: "sm",
                          disabled: isAdded || isFetching,
                          onClick: () => onFetchAndAdd(s),
                          className: `shrink-0 h-7 px-2 text-xs ${isAdded ? "border-green-500/40 bg-green-500/10 text-green-400" : "border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"}`,
                          children: isFetching ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : isAdded ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" })
                        }
                      )
                    ]
                  },
                  s.url
                );
              })
            ] })
          ]
        },
        topic
      );
    }) })
  ] });
}
function KnowledgePage() {
  const { data: memories = [] } = useMemories();
  const { data: folders = [] } = useKnowledgeFolders();
  const deleteMemory = useDeleteMemory();
  const createFolder = useCreateKnowledgeFolder();
  const deleteFolder = useDeleteKnowledgeFolder();
  const [selectedFolderId, setSelectedFolderId] = reactExports.useState(null);
  const [folderPanelOpen, setFolderPanelOpen] = reactExports.useState(false);
  const [deletingFolder, setDeletingFolder] = reactExports.useState(null);
  const [customCategories, setCustomCategories] = reactExports.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("dj_custom_categories") || "[]");
    } catch {
      return [];
    }
  });
  const allCategories = [...PRESET_CATEGORIES, ...customCategories];
  const handleAddCustomCategory = (name) => {
    if (allCategories.includes(name)) return;
    const updated = [...customCategories, name];
    setCustomCategories(updated);
    localStorage.setItem("dj_custom_categories", JSON.stringify(updated));
  };
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedCategory, setSelectedCategory] = reactExports.useState("All");
  const knowledgeSources = reactExports.useMemo(
    () => memories.map(parseKnowledgeSource).filter((s) => s !== null),
    [memories]
  );
  const {
    sourceCounts,
    folderFilteredSources,
    filteredSources,
    storedCategories
  } = reactExports.useMemo(() => {
    const sourceCounts2 = {};
    for (const s of knowledgeSources) {
      if (s.folderId) {
        sourceCounts2[s.folderId] = (sourceCounts2[s.folderId] ?? 0) + 1;
      }
    }
    const folderFilteredSources2 = selectedFolderId === null ? knowledgeSources : knowledgeSources.filter((s) => s.folderId === selectedFolderId);
    const searchFiltered = searchKnowledgeSources(
      folderFilteredSources2,
      searchQuery
    );
    const filteredSources2 = selectedCategory === "All" ? searchFiltered : searchFiltered.filter((s) => s.category === selectedCategory);
    const storedCategories2 = Array.from(
      new Set(folderFilteredSources2.map((s) => s.category).filter(Boolean))
    );
    return {
      sourceCounts: sourceCounts2,
      folderFilteredSources: folderFilteredSources2,
      searchFiltered,
      filteredSources: filteredSources2,
      storedCategories: storedCategories2
    };
  }, [knowledgeSources, selectedFolderId, searchQuery, selectedCategory]);
  const handleDeleteSource = async (id, title) => {
    try {
      await deleteMemory.mutateAsync(id);
      ue.success(`"${title}" removed from DJ's memory`);
    } catch {
      ue.error("Failed to delete knowledge source");
    }
  };
  const handleCreateFolder = async (name, parentId) => {
    try {
      await createFolder.mutateAsync({ name, parentId });
      ue.success(`Folder "${name}" created`);
    } catch {
      ue.error("Failed to create folder");
    }
  };
  const handleDeleteFolderConfirm = async () => {
    if (!deletingFolder) return;
    try {
      await deleteFolder.mutateAsync(deletingFolder.id);
      ue.success(`Folder "${deletingFolder.name}" deleted`);
      if (selectedFolderId === String(deletingFolder.id)) {
        setSelectedFolderId(null);
      }
    } catch {
      ue.error("Failed to delete folder");
    } finally {
      setDeletingFolder(null);
    }
  };
  const selectedFolder = folders.find((f) => String(f.id) === selectedFolderId);
  const [staleIds, setStaleIds] = reactExports.useState(
    () => getStaleSourceIds(
      memories.map(parseKnowledgeSource).filter((s) => s !== null)
    )
  );
  const [isRefreshingAll, setIsRefreshingAll] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handler = () => {
      setStaleIds(getStaleSourceIds(knowledgeSources));
    };
    window.addEventListener("dj_refresh_meta_changed", handler);
    return () => window.removeEventListener("dj_refresh_meta_changed", handler);
  }, [knowledgeSources]);
  const handleRefreshSource = async (source) => {
    if (!source.url) return;
    let content = "";
    try {
      const resp = await fetch(source.url);
      const html = await resp.text();
      content = extractTextFromHtml(html).slice(0, 2e3);
    } catch {
      content = source.content;
    }
    await deleteMemory.mutateAsync(source.id);
    const encoded = encodeKnowledgeSource(
      "website",
      source.title,
      source.url,
      content,
      source.category,
      source.folderId
    );
    await addMemory.mutateAsync(encoded);
  };
  const handleRefreshAll = async () => {
    var _a;
    const staleSources = knowledgeSources.filter(
      (s) => staleIds.includes(String(s.id))
    );
    if (staleSources.length === 0) return;
    setIsRefreshingAll(true);
    try {
      for (const s of staleSources) {
        await handleRefreshSource(s);
        setRefreshMeta(String(s.id), {
          lastRefreshed: Date.now(),
          interval: ((_a = getRefreshMeta()[String(s.id)]) == null ? void 0 : _a.interval) ?? "none"
        });
      }
      setStaleIds([]);
      ue.success(
        `${staleSources.length} source${staleSources.length !== 1 ? "s" : ""} refreshed`
      );
    } catch {
      ue.error("Some sources failed to refresh");
    } finally {
      setIsRefreshingAll(false);
    }
  };
  const [researchTopic, setResearchTopic] = reactExports.useState("");
  const [researchSuggestions, setResearchSuggestions] = reactExports.useState([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = reactExports.useState(false);
  const [fetchingUrls, setFetchingUrls] = reactExports.useState({});
  const [addedUrls, setAddedUrls] = reactExports.useState(/* @__PURE__ */ new Set());
  const addMemory = useAddMemory();
  const CURATED_SOURCES = {
    bitcoin: [
      {
        title: "Bitcoin - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Bitcoin",
        description: "Comprehensive overview of Bitcoin, history, and technology"
      },
      {
        title: "Bitcoin.org",
        url: "https://bitcoin.org/en/",
        description: "Official Bitcoin project homepage"
      },
      {
        title: "Bitcoin - Investopedia",
        url: "https://www.investopedia.com/terms/b/bitcoin.asp",
        description: "Financial guide to Bitcoin investing and trading"
      },
      {
        title: "Bitcoin Whitepaper",
        url: "https://bitcoin.org/bitcoin.pdf",
        description: "Satoshi Nakamoto's original Bitcoin whitepaper"
      },
      {
        title: "CoinDesk Bitcoin News",
        url: "https://www.coindesk.com/tag/bitcoin/",
        description: "Latest Bitcoin news and analysis"
      }
    ],
    "icp internet computer": [
      {
        title: "Internet Computer - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Internet_Computer",
        description: "Overview of the Internet Computer blockchain"
      },
      {
        title: "DFINITY Foundation",
        url: "https://dfinity.org/",
        description: "The organization behind ICP development"
      },
      {
        title: "ICP Developer Docs",
        url: "https://internetcomputer.org/docs/current/developer-docs/",
        description: "Official ICP developer documentation"
      },
      {
        title: "ICP Overview",
        url: "https://internetcomputer.org/",
        description: "Internet Computer Protocol official site"
      },
      {
        title: "ICP on CoinGecko",
        url: "https://www.coingecko.com/en/coins/internet-computer",
        description: "ICP token price and market data"
      }
    ],
    ethereum: [
      {
        title: "Ethereum - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Ethereum",
        description: "Complete guide to Ethereum blockchain"
      },
      {
        title: "Ethereum.org",
        url: "https://ethereum.org/en/",
        description: "Official Ethereum foundation site"
      },
      {
        title: "Ethereum Docs",
        url: "https://ethereum.org/en/developers/docs/",
        description: "Official Ethereum developer documentation"
      },
      {
        title: "Ethereum - Investopedia",
        url: "https://www.investopedia.com/terms/e/ethereum.asp",
        description: "Ethereum investing guide"
      },
      {
        title: "Etherscan",
        url: "https://etherscan.io/",
        description: "Ethereum blockchain explorer"
      }
    ],
    "artificial intelligence": [
      {
        title: "Artificial Intelligence - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
        description: "Comprehensive overview of AI"
      },
      {
        title: "AI - Britannica",
        url: "https://www.britannica.com/technology/artificial-intelligence",
        description: "Encyclopedia article on AI"
      },
      {
        title: "MIT AI Lab",
        url: "https://www.csail.mit.edu/research/artificial-intelligence",
        description: "MIT's AI research overview"
      },
      {
        title: "AI News - BBC",
        url: "https://www.bbc.com/news/topics/ce1qrvleleqt/artificial-intelligence",
        description: "Latest AI news from BBC"
      },
      {
        title: "AI - Stanford",
        url: "https://ai.stanford.edu/",
        description: "Stanford University AI research"
      }
    ]
  };
  const generateResearchSources = () => {
    if (!researchTopic.trim()) {
      ue.error("Please enter a topic to research");
      return;
    }
    setIsGeneratingSuggestions(true);
    setResearchSuggestions([]);
    setAddedUrls(/* @__PURE__ */ new Set());
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
            description: `Wikipedia article about ${researchTopic}`
          },
          {
            title: `${researchTopic} - Britannica`,
            url: `https://www.britannica.com/search?query=${encoded}`,
            description: `Encyclopaedia Britannica on ${researchTopic}`
          },
          {
            title: `${researchTopic} - BBC News`,
            url: `https://www.bbc.com/search?q=${encoded}`,
            description: `Latest BBC news about ${researchTopic}`
          },
          {
            title: `${researchTopic} - Investopedia`,
            url: `https://www.investopedia.com/search#q=${encoded}`,
            description: `Investopedia financial guide on ${researchTopic}`
          },
          {
            title: `${researchTopic} - MIT News`,
            url: `https://news.mit.edu/search/node/${encoded}`,
            description: `MIT academic articles about ${researchTopic}`
          }
        ]);
      }
      setIsGeneratingSuggestions(false);
      ue.success(`5 sources found for "${researchTopic}"`);
    }, 1200);
  };
  const handleFetchResearchSource = async (source) => {
    setFetchingUrls((prev) => ({ ...prev, [source.url]: true }));
    try {
      let content = "";
      try {
        const resp = await fetch(source.url);
        const html = await resp.text();
        content = extractTextFromHtml(html).slice(0, 2e3);
      } catch {
        content = `${source.title}

${source.description}

Source: ${source.url}`;
      }
      const encoded = encodeKnowledgeSource(
        "website",
        source.title,
        source.url,
        content || source.description,
        "Research"
      );
      await addMemory.mutateAsync(encoded);
      setAddedUrls((prev) => /* @__PURE__ */ new Set([...prev, source.url]));
      ue.success(`"${source.title}" added to DJ's memory`);
    } catch {
      ue.error(`Failed to add "${source.title}"`);
    } finally {
      setFetchingUrls((prev) => ({ ...prev, [source.url]: false }));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glow-border mb-6 rounded-xl border border-primary/40 bg-gradient-to-br from-card to-muted/30 p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-primary bg-primary/10",
            style: { boxShadow: "0 0 20px oklch(0.65 0.25 220 / 0.4)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-6 w-6 text-primary" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "glow-text font-display text-2xl font-bold", children: "Knowledge Base" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: "Teach DJ from websites, PDFs, and documents. Organize with folders and create wiki pages." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "shrink-0 border-primary/40 bg-primary/20 text-primary", children: [
          knowledgeSources.length,
          " source",
          knowledgeSources.length !== 1 ? "s" : ""
        ] })
      ] }) }),
      staleIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "knowledge.stale.panel",
          className: "mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-4 w-4 shrink-0 text-amber-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex-1 text-sm text-amber-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: staleIds.length }),
              " source",
              staleIds.length !== 1 ? "s" : "",
              " need refreshing based on your schedule."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "knowledge.stale.refresh_all.button",
                size: "sm",
                onClick: handleRefreshAll,
                disabled: isRefreshingAll,
                className: "shrink-0 border border-amber-500/40 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30",
                children: [
                  isRefreshingAll ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "mr-1.5 h-3.5 w-3.5" }),
                  "Refresh All"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "knowledge.folder_panel.toggle",
          onClick: () => setFolderPanelOpen((v) => !v),
          className: "mb-4 flex w-full items-center justify-between rounded-xl border border-primary/30 bg-card/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card/80 md:hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                selectedFolder ? selectedFolder.name : "All Sources",
                selectedFolder && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-muted-foreground", children: "· Folder" })
              ] })
            ] }),
            folderPanelOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: folderPanelOpen, onOpenChange: setFolderPanelOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "left", className: "w-72 p-0 md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 pt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60", children: "Folders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FolderTree,
            {
              folders,
              selectedFolderId,
              onSelect: (id) => {
                setSelectedFolderId(id);
                setFolderPanelOpen(false);
              },
              onDelete: (id, name) => setDeletingFolder({ id, name }),
              onCreate: handleCreateFolder,
              sourceCounts
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden md:block md:w-56 lg:w-64 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/30 bg-card/50 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60", children: "Folders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FolderTree,
            {
              folders,
              selectedFolderId,
              onSelect: (id) => {
                setSelectedFolderId(id);
                setFolderPanelOpen(false);
              },
              onDelete: (id, name) => setDeletingFolder({ id, name }),
              onCreate: handleCreateFolder,
              sourceCounts
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-w-0 flex-1", children: [
          selectedFolderId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex items-center gap-2 rounded-lg border border-primary/20 bg-card/30 px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            FolderBreadcrumb,
            {
              folderId: selectedFolderId,
              folders,
              onNavigate: setSelectedFolderId
            }
          ) }),
          selectedFolderId && selectedFolder ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "sources", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "border border-primary/30 bg-card/80 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  "data-ocid": "knowledge.folder.sources.tab",
                  value: "sources",
                  className: "flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "mr-1.5 h-4 w-4" }),
                    "Sources",
                    folderFilteredSources.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1.5 border-primary/30 bg-primary/10 text-primary text-xs", children: folderFilteredSources.length })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  "data-ocid": "knowledge.folder.wiki.tab",
                  value: "wiki",
                  className: "flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "mr-1.5 h-4 w-4" }),
                    "Wiki Page"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  "data-ocid": "knowledge.folder.add.tab",
                  value: "add",
                  className: "flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-4 w-4" }),
                    "Add Source"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "sources", className: "space-y-4 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "knowledge.folder.search_input",
                    placeholder: "Search sources in this folder...",
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    className: "border-primary/30 bg-card/50 pl-9"
                  }
                )
              ] }),
              filteredSources.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "knowledge.folder.sources.empty_state",
                  className: "flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/30 py-12 text-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "h-10 w-10 text-primary/30" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-muted-foreground", children: "No sources in this folder" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground/60", children: 'Add sources using the "Add Source" tab above.' })
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredSources.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                SourceCard,
                {
                  source: s,
                  onDelete: handleDeleteSource,
                  onRefresh: handleRefreshSource,
                  index: i + 1
                },
                String(s.id)
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "wiki", className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/30 bg-card/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display text-base", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-4 w-4 text-primary" }),
                  "Wiki — ",
                  selectedFolder.name
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "A structured knowledge page for this folder. Generate from sources or write manually." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                WikiPageEditor,
                {
                  folderId: selectedFolder.id,
                  folderName: selectedFolder.name,
                  sources: folderFilteredSources
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "add", className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/30 bg-card/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display text-base", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-primary" }),
                  "Add to ",
                  selectedFolder.name
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Sources added here will be automatically filed in this folder." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                AddSourceForm,
                {
                  allCategories,
                  folders,
                  onAddCustomCategory: handleAddCustomCategory,
                  defaultFolderId: selectedFolderId
                }
              ) })
            ] }) })
          ] }) }) : (
            /* All Sources view */
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "research", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-4 grid w-full grid-cols-4 border border-primary/30 bg-card/80", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    "data-ocid": "knowledge.research.tab",
                    value: "research",
                    className: "data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Research" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Find" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    "data-ocid": "knowledge.follow.tab",
                    value: "follow",
                    className: "data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary text-xs sm:text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Rss, { className: "mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4" }),
                      "Follow",
                      getFollowedTopics().length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 border-secondary/30 bg-secondary/10 text-secondary text-xs", children: getFollowedTopics().length })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    "data-ocid": "knowledge.add.tab",
                    value: "add",
                    className: "data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4" }),
                      "Add"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    "data-ocid": "knowledge.sources.tab",
                    value: "sources",
                    className: "data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-xs sm:text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "My Sources" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Sources" }),
                      knowledgeSources.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 border-primary/30 bg-primary/20 text-primary text-xs", children: knowledgeSources.length })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "research", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-primary/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-secondary" }),
                    "Research a Topic"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Type any topic and DJ will suggest 5 trusted sources to add to its memory instantly." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          "data-ocid": "knowledge.research.search_input",
                          placeholder: 'e.g. "Bitcoin", "ICP Internet Computer", "AI"',
                          value: researchTopic,
                          onChange: (e) => setResearchTopic(e.target.value),
                          onKeyDown: (e) => e.key === "Enter" && generateResearchSources(),
                          className: "border-primary/30 bg-card/50 pl-9"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        "data-ocid": "knowledge.research.generate_button",
                        onClick: generateResearchSources,
                        disabled: isGeneratingSuggestions || !researchTopic.trim(),
                        className: "shrink-0 bg-secondary/20 border border-secondary/40 text-secondary hover:bg-secondary/30",
                        children: [
                          isGeneratingSuggestions ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-2 h-4 w-4" }),
                          "Generate"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: [
                    "Bitcoin",
                    "ICP Internet Computer",
                    "Ethereum",
                    "Artificial Intelligence"
                  ].map((topic) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setResearchTopic(topic),
                      className: "rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary transition-all hover:bg-primary/20 hover:border-primary/60",
                      children: topic
                    },
                    topic
                  )) }),
                  isGeneratingSuggestions && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 py-10", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                      'Finding the best sources for "',
                      researchTopic,
                      '"...'
                    ] })
                  ] }),
                  researchSuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-muted-foreground", children: [
                      researchSuggestions.length,
                      " sources found — tap to add:"
                    ] }),
                    researchSuggestions.map((source) => {
                      const isAdded = addedUrls.has(source.url);
                      const isFetching = fetchingUrls[source.url];
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: `flex items-start gap-3 rounded-xl border p-4 transition-all ${isAdded ? "border-green-500/40 bg-green-500/5" : "border-primary/30 bg-card/50 hover:border-primary/60"}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-blue-400" }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: source.title }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: source.description }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-primary/50 truncate", children: source.url })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Button,
                              {
                                "data-ocid": "knowledge.research.add_source.button",
                                size: "sm",
                                disabled: isAdded || isFetching,
                                onClick: () => handleFetchResearchSource(source),
                                className: `shrink-0 ${isAdded ? "border-green-500/40 bg-green-500/10 text-green-400" : "border-primary/40 bg-primary/20 text-primary hover:bg-primary/30"}`,
                                children: isFetching ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : isAdded ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
                              }
                            )
                          ]
                        },
                        source.url
                      );
                    })
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "follow", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                FollowTopicsTab,
                {
                  onFetchAndAdd: handleFetchResearchSource,
                  fetchingUrls,
                  addedUrls
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "add", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 text-primary" }),
                    "Add Knowledge Source"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Add a website URL or upload a file to teach DJ new knowledge." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AddSourceForm,
                  {
                    allCategories,
                    folders,
                    onAddCustomCategory: handleAddCustomCategory,
                    defaultFolderId: null
                  }
                ) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "sources", className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        "data-ocid": "knowledge.sources.search_input",
                        placeholder: "Search knowledge sources...",
                        value: searchQuery,
                        onChange: (e) => setSearchQuery(e.target.value),
                        className: "border-primary/30 bg-card/50 pl-9"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: selectedCategory,
                      onValueChange: setSelectedCategory,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            "data-ocid": "knowledge.sources.category_filter.select",
                            className: "border-primary/30 bg-card/50 sm:w-40",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "border-primary/30 bg-card", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All categories" }),
                          storedCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: cat }, cat))
                        ] })
                      ]
                    }
                  )
                ] }),
                knowledgeSources.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": "knowledge.sources.empty_state",
                    className: "flex flex-col items-center gap-4 rounded-xl border border-dashed border-primary/30 py-16 text-center",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-12 w-12 text-primary/20" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-semibold text-muted-foreground", children: "No knowledge sources yet" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground/60", children: "Add websites, PDFs, or documents for DJ to learn from." })
                      ] })
                    ]
                  }
                ) : filteredSources.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/20 py-12 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 text-muted-foreground/30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                    'No results for "',
                    searchQuery,
                    '"'
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredSources.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SourceCard,
                  {
                    source: s,
                    onDelete: handleDeleteSource,
                    onRefresh: handleRefreshSource,
                    index: i + 1
                  },
                  String(s.id)
                )) })
              ] })
            ] })
          )
        ] })
      ] })
    ] }),
    deletingFolder && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteFolderDialog,
      {
        folderName: deletingFolder.name,
        open: true,
        onConfirm: handleDeleteFolderConfirm,
        onCancel: () => setDeletingFolder(null)
      }
    )
  ] });
}
export {
  KnowledgePage
};
