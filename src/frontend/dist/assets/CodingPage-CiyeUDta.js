import { r as reactExports, F as useSaveCodeSnippet, G as useCodeSnippets, j as jsxRuntimeExports, k as ue } from "./index-D4lUgCCM.js";
import { B as Badge } from "./badge-BMXMPn3_.js";
import { c as createLucideIcon, B as Button } from "./createLucideIcon-a11X8bAo.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, c as CardDescription } from "./card-iyETJf1A.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { S as ScrollArea } from "./scroll-area-D1D6khfo.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C5iF8xTu.js";
import { L as Layout } from "./Layout-y-fTRwTO.js";
import { D as Download } from "./download-C_Vl7YHH.js";
import { L as LoaderCircle } from "./loader-circle-Tr-8VCUp.js";
import "./proxy-CDDWEtkX.js";
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
const __iconNode$1 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$1);
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
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
const TEMPLATES = {
  javascript: {
    "API Fetch": `async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}`,
    "Array Methods": `const numbers = [1, 2, 3, 4, 5];

// Map
const doubled = numbers.map(n => n * 2);

// Filter
const evens = numbers.filter(n => n % 2 === 0);

// Reduce
const sum = numbers.reduce((acc, n) => acc + n, 0);`
  },
  python: {
    "List Comprehension": `# List comprehension examples
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
matrix = [[i*j for j in range(5)] for i in range(5)]`,
    "File I/O": `# Read file
with open('file.txt', 'r') as f:
    content = f.read()

# Write file
with open('output.txt', 'w') as f:
    f.write('Hello, World!')`
  },
  html: {
    "Basic Structure": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <header>
    <h1>Welcome</h1>
  </header>
  <main>
    <p>Content goes here</p>
  </main>
</body>
</html>`,
    Form: `<form action="/submit" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  
  <button type="submit">Submit</button>
</form>`
  },
  css: {
    "Flexbox Layout": `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}`,
    "Grid Layout": `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}`
  },
  motoko: {
    "Basic Actor": `actor Counter {
  stable var count : Nat = 0;

  public query func getCount() : async Nat {
    count
  };

  public func increment() : async () {
    count += 1;
  };
}`
  }
};
function CodingPage() {
  const [language, setLanguage] = reactExports.useState("javascript");
  const [code, setCode] = reactExports.useState("");
  const [title, setTitle] = reactExports.useState("");
  const [selectedTemplate, setSelectedTemplate] = reactExports.useState("");
  const saveSnippet = useSaveCodeSnippet();
  const { data: snippets = [] } = useCodeSnippets();
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setSelectedTemplate("");
  };
  const handleTemplateSelect = (template) => {
    var _a;
    setSelectedTemplate(template);
    const templateCode = ((_a = TEMPLATES[language]) == null ? void 0 : _a[template]) || "";
    setCode(templateCode);
  };
  const handleSave = async () => {
    if (!title.trim() || !code.trim()) {
      ue.error("Please enter a title and code");
      return;
    }
    try {
      await saveSnippet.mutateAsync({ language, title: title.trim(), code });
      ue.success("Snippet saved successfully!");
      setTitle("");
    } catch (_error) {
      ue.error("Failed to save snippet");
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    ue.success("Copied to clipboard!");
  };
  const handleDownload = () => {
    const extensions = {
      javascript: "js",
      python: "py",
      html: "html",
      css: "css",
      typescript: "ts",
      motoko: "mo"
    };
    const ext = extensions[language] || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleLoadSnippet = (snippet) => {
    setCode(snippet.codeContent);
    setTitle(snippet.title);
    setLanguage(snippet.language);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto space-y-6 px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "glow-text font-display text-3xl font-bold", children: "Coding Assistant" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Write, debug, and save code snippets" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-primary/50 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Code Editor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: language, onValueChange: handleLanguageChange, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "javascript", children: "JavaScript" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "python", children: "Python" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "html", children: "HTML" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "css", children: "CSS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "typescript", children: "TypeScript" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "motoko", children: "Motoko" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", onClick: handleCopy, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                onClick: handleDownload,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Snippet title...",
              value: title,
              onChange: (e) => setTitle(e.target.value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glow-border h-[500px] overflow-hidden rounded-lg border border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              className: "h-full w-full resize-none bg-[#1e1e1e] p-4 font-mono text-sm text-[#d4d4d4] outline-none",
              value: code,
              onChange: (e) => setCode(e.target.value),
              spellCheck: false,
              placeholder: `// Start typing ${language} code here...`
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: saveSnippet.isPending,
              className: "w-full bg-primary",
              children: saveSnippet.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                "Saving..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
                "Save Snippet"
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-secondary/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Templates" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Quick start with common patterns" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Object.keys(
            TEMPLATES[language] || {}
          ).map((template) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: selectedTemplate === template ? "default" : "outline",
              className: "w-full justify-start",
              onClick: () => handleTemplateSelect(template),
              children: template
            },
            template
          )) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-primary/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Saved Snippets" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[300px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: snippets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground", children: "No saved snippets" }) : snippets.map((snippet) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "w-full justify-start",
              onClick: () => handleLoadSnippet(snippet),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: snippet.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-2", children: snippet.language })
              ] })
            },
            snippet.id.toString()
          )) }) }) })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  CodingPage
};
