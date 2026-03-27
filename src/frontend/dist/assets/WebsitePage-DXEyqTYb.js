import { r as reactExports, H as useSaveWebsite, I as useWebsites, j as jsxRuntimeExports, k as ue } from "./index-D4lUgCCM.js";
import { c as createLucideIcon, B as Button } from "./createLucideIcon-a11X8bAo.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-iyETJf1A.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { L as Label } from "./label-Bf9_XisY.js";
import { S as ScrollArea } from "./scroll-area-D1D6khfo.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C5iF8xTu.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-eotKpg0e.js";
import { T as Textarea } from "./textarea-a_o-YPgo.js";
import { L as Layout } from "./Layout-y-fTRwTO.js";
import { L as LoaderCircle } from "./loader-circle-Tr-8VCUp.js";
import { D as Download } from "./download-C_Vl7YHH.js";
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
const __iconNode = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode);
const TEMPLATES = {
  landing: {
    name: "Landing Page",
    description: "Modern landing page with hero section",
    html: (title, _color, heading, content) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <nav>
      <h2>${title}</h2>
      <button class="cta">Get Started</button>
    </nav>
  </header>
  <main>
    <section class="hero">
      <h1>${heading}</h1>
      <p>${content}</p>
      <button class="cta">Learn More</button>
    </section>
  </main>
  <footer>
    <p>&copy; 2026. Built with love using caffeine.ai</p>
  </footer>
  <script src="script.js"><\/script>
</body>
</html>`,
    css: (color) => `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #333;
}

header {
  background: #000;
  color: #fff;
  padding: 1rem 0;
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero {
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${color};
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #666;
}

.cta {
  background: ${color};
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: opacity 0.3s;
}

.cta:hover {
  opacity: 0.9;
}

footer {
  background: #000;
  color: #fff;
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
}`,
    js: () => `document.addEventListener('DOMContentLoaded', () => {
  console.log('Website loaded!');
  
  const buttons = document.querySelectorAll('.cta');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      alert('Button clicked!');
    });
  });
});`
  },
  portfolio: {
    name: "Portfolio",
    description: "Personal portfolio with project showcase",
    html: (title, _color, heading, content) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Portfolio</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>${heading}</h1>
    <p class="subtitle">${content}</p>
  </header>
  <main>
    <section class="projects">
      <h2>Projects</h2>
      <div class="grid">
        <div class="card">
          <h3>Project 1</h3>
          <p>Description of project 1</p>
        </div>
        <div class="card">
          <h3>Project 2</h3>
          <p>Description of project 2</p>
        </div>
        <div class="card">
          <h3>Project 3</h3>
          <p>Description of project 3</p>
        </div>
      </div>
    </section>
  </main>
  <footer>
    <p>&copy; 2026. Built with love using caffeine.ai</p>
  </footer>
  <script src="script.js"><\/script>
</body>
</html>`,
    css: (color) => `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f5f5f5;
}

header {
  background: ${color};
  color: #fff;
  text-align: center;
  padding: 4rem 2rem;
}

header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
}

main {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 2rem;
}

.projects h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-4px);
}

.card h3 {
  margin-bottom: 1rem;
  color: ${color};
}

footer {
  background: #000;
  color: #fff;
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
}`,
    js: () => `document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, i) => {
    card.style.animationDelay = \`\${i * 0.1}s\`;
  });
});`
  }
};
function WebsitePage() {
  const [template, setTemplate] = reactExports.useState("landing");
  const [title, setTitle] = reactExports.useState("My Website");
  const [color, setColor] = reactExports.useState("#0066FF");
  const [heading, setHeading] = reactExports.useState("Welcome to My Website");
  const [content, setContent] = reactExports.useState(
    "This is a sample website generated by DJ"
  );
  const [generatedHtml, setGeneratedHtml] = reactExports.useState("");
  const [generatedCss, setGeneratedCss] = reactExports.useState("");
  const [generatedJs, setGeneratedJs] = reactExports.useState("");
  const [showPreview, setShowPreview] = reactExports.useState(false);
  const saveWebsite = useSaveWebsite();
  const { data: websites = [] } = useWebsites();
  const handleGenerate = () => {
    const templateData = TEMPLATES[template];
    const html = templateData.html(title, color, heading, content);
    const css = templateData.css(color);
    const js = templateData.js();
    setGeneratedHtml(html);
    setGeneratedCss(css);
    setGeneratedJs(js);
    setShowPreview(true);
    ue.success("Website generated!");
  };
  const handleSave = async () => {
    if (!generatedHtml) {
      ue.error("Please generate a website first");
      return;
    }
    try {
      await saveWebsite.mutateAsync({
        name: title,
        html: generatedHtml,
        css: generatedCss,
        js: generatedJs
      });
      ue.success("Website saved successfully!");
    } catch (_error) {
      ue.error("Failed to save website");
    }
  };
  const downloadFile = (content2, filename, type) => {
    const blob = new Blob([content2], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleDownload = () => {
    if (!generatedHtml) {
      ue.error("Please generate a website first");
      return;
    }
    downloadFile(generatedHtml, "index.html", "text/html");
    setTimeout(() => downloadFile(generatedCss, "styles.css", "text/css"), 300);
    setTimeout(
      () => downloadFile(generatedJs, "script.js", "text/javascript"),
      600
    );
    ue.success("Website files downloaded (3 files)!");
  };
  const handleLoadWebsite = (website) => {
    setGeneratedHtml(website.htmlContent);
    setGeneratedCss(website.cssContent);
    setGeneratedJs(website.jsContent);
    setTitle(website.templateName);
    setShowPreview(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto space-y-6 px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "glow-text font-display text-3xl font-bold", children: "Website Builder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Generate websites from templates" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-primary/50 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Customize Your Website" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Fill in the details and generate" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Template" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: template,
                onValueChange: (v) => setTemplate(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.entries(TEMPLATES).map(([key, data]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: key, children: [
                    data.name,
                    " - ",
                    data.description
                  ] }, key)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Website Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: title,
                onChange: (e) => setTitle(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Primary Color" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "color",
                  value: color,
                  onChange: (e) => setColor(e.target.value),
                  className: "w-20"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: color,
                  onChange: (e) => setColor(e.target.value)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Heading" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: heading,
                onChange: (e) => setHeading(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Content" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: content,
                onChange: (e) => setContent(e.target.value),
                rows: 4
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleGenerate, className: "flex-1 bg-primary", children: "Generate Website" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleSave,
                disabled: !generatedHtml || saveWebsite.isPending,
                variant: "outline",
                children: saveWebsite.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Save"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleDownload,
                disabled: !generatedHtml,
                variant: "outline",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-secondary/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Saved Websites" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[500px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: websites.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground", children: "No saved websites" }) : websites.map((website) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            className: "w-full justify-start",
            onClick: () => handleLoadWebsite(website),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: website.templateName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "ml-2 h-4 w-4" })
            ] })
          },
          website.id.toString()
        )) }) }) })
      ] })
    ] }),
    showPreview && generatedHtml && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-primary/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Preview" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "preview", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "preview", children: "Preview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "html", children: "HTML" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "css", children: "CSS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "js", children: "JavaScript" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "preview", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glow-border h-[600px] overflow-hidden rounded-lg border border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "iframe",
          {
            title: "preview",
            srcDoc: `${generatedHtml}<style>${generatedCss}</style><script>${generatedJs}<\/script>`,
            className: "h-full w-full border-0"
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "html", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[600px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "rounded-lg bg-muted p-4 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: generatedHtml }) }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "css", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[600px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "rounded-lg bg-muted p-4 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: generatedCss }) }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "js", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[600px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "rounded-lg bg-muted p-4 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: generatedJs }) }) }) })
      ] }) })
    ] })
  ] }) });
}
export {
  WebsitePage
};
