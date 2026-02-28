import { useState } from "react";
import { Layout } from "../components/Layout";
import { useSaveWebsite, useWebsites } from "../hooks/useQueries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";

const TEMPLATES = {
  landing: {
    name: "Landing Page",
    description: "Modern landing page with hero section",
    html: (title: string, color: string, heading: string, content: string) => `<!DOCTYPE html>
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
  <script src="script.js"></script>
</body>
</html>`,
    css: (color: string) => `* {
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
});`,
  },
  portfolio: {
    name: "Portfolio",
    description: "Personal portfolio with project showcase",
    html: (title: string, color: string, heading: string, content: string) => `<!DOCTYPE html>
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
  <script src="script.js"></script>
</body>
</html>`,
    css: (color: string) => `* {
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
});`,
  },
};

export function WebsitePage() {
  const [template, setTemplate] = useState<keyof typeof TEMPLATES>("landing");
  const [title, setTitle] = useState("My Website");
  const [color, setColor] = useState("#0066FF");
  const [heading, setHeading] = useState("Welcome to My Website");
  const [content, setContent] = useState("This is a sample website generated by DJ");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [generatedCss, setGeneratedCss] = useState("");
  const [generatedJs, setGeneratedJs] = useState("");
  const [showPreview, setShowPreview] = useState(false);

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
    toast.success("Website generated!");
  };

  const handleSave = async () => {
    if (!generatedHtml) {
      toast.error("Please generate a website first");
      return;
    }
    try {
      await saveWebsite.mutateAsync({
        name: title,
        html: generatedHtml,
        css: generatedCss,
        js: generatedJs,
      });
      toast.success("Website saved successfully!");
    } catch (error) {
      toast.error("Failed to save website");
    }
  };

  const handleDownload = async () => {
    if (!generatedHtml) {
      toast.error("Please generate a website first");
      return;
    }

    const zip = new JSZip();
    zip.file("index.html", generatedHtml);
    zip.file("styles.css", generatedCss);
    zip.file("script.js", generatedJs);

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Website downloaded!");
  };

  const handleLoadWebsite = (website: typeof websites[0]) => {
    setGeneratedHtml(website.htmlContent);
    setGeneratedCss(website.cssContent);
    setGeneratedJs(website.jsContent);
    setTitle(website.templateName);
    setShowPreview(true);
  };

  return (
    <Layout>
      <div className="container mx-auto space-y-6 px-4 py-8">
        <div>
          <h1 className="glow-text font-display text-3xl font-bold">Website Builder</h1>
          <p className="text-muted-foreground">Generate websites from templates</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="glow-border border-primary/50 lg:col-span-2">
            <CardHeader>
              <CardTitle>Customize Your Website</CardTitle>
              <CardDescription>Fill in the details and generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Template</Label>
                <Select value={template} onValueChange={(v) => setTemplate(v as keyof typeof TEMPLATES)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TEMPLATES).map(([key, data]) => (
                      <SelectItem key={key} value={key}>
                        {data.name} - {data.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Website Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div>
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-20" />
                  <Input value={color} onChange={(e) => setColor(e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Heading</Label>
                <Input value={heading} onChange={(e) => setHeading(e.target.value)} />
              </div>

              <div>
                <Label>Content</Label>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleGenerate} className="flex-1 bg-primary">
                  Generate Website
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!generatedHtml || saveWebsite.isPending}
                  variant="outline"
                >
                  {saveWebsite.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button onClick={handleDownload} disabled={!generatedHtml} variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glow-border border-secondary/50">
            <CardHeader>
              <CardTitle>Saved Websites</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {websites.length === 0 ? (
                    <p className="text-center text-muted-foreground">No saved websites</p>
                  ) : (
                    websites.map((website) => (
                      <Button
                        key={website.id.toString()}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleLoadWebsite(website)}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="truncate">{website.templateName}</span>
                          <Eye className="ml-2 h-4 w-4" />
                        </div>
                      </Button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {showPreview && generatedHtml && (
          <Card className="glow-border border-primary/50">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="js">JavaScript</TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  <div className="glow-border h-[600px] overflow-hidden rounded-lg border border-primary/30">
                    <iframe
                      title="preview"
                      srcDoc={`${generatedHtml}<style>${generatedCss}</style><script>${generatedJs}</script>`}
                      className="h-full w-full border-0"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="html">
                  <ScrollArea className="h-[600px]">
                    <pre className="rounded-lg bg-muted p-4 text-sm">
                      <code>{generatedHtml}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="css">
                  <ScrollArea className="h-[600px]">
                    <pre className="rounded-lg bg-muted p-4 text-sm">
                      <code>{generatedCss}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="js">
                  <ScrollArea className="h-[600px]">
                    <pre className="rounded-lg bg-muted p-4 text-sm">
                      <code>{generatedJs}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
