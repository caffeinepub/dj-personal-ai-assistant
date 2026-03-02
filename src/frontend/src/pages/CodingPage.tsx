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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Copy, Download, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useCodeSnippets, useSaveCodeSnippet } from "../hooks/useQueries";

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
const sum = numbers.reduce((acc, n) => acc + n, 0);`,
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
    f.write('Hello, World!')`,
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
</form>`,
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
}`,
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
}`,
  },
};

export function CodingPage() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const saveSnippet = useSaveCodeSnippet();
  const { data: snippets = [] } = useCodeSnippets();

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setSelectedTemplate("");
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    const templateCode =
      TEMPLATES[language as keyof typeof TEMPLATES]?.[template] || "";
    setCode(templateCode);
  };

  const handleSave = async () => {
    if (!title.trim() || !code.trim()) {
      toast.error("Please enter a title and code");
      return;
    }
    try {
      await saveSnippet.mutateAsync({ language, title: title.trim(), code });
      toast.success("Snippet saved successfully!");
      setTitle("");
    } catch (_error) {
      toast.error("Failed to save snippet");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      javascript: "js",
      python: "py",
      html: "html",
      css: "css",
      typescript: "ts",
      motoko: "mo",
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

  const handleLoadSnippet = (snippet: (typeof snippets)[0]) => {
    setCode(snippet.codeContent);
    setTitle(snippet.title);
    setLanguage(snippet.language);
  };

  return (
    <Layout>
      <div className="container mx-auto space-y-6 px-4 py-8">
        <div>
          <h1 className="glow-text font-display text-3xl font-bold">
            Coding Assistant
          </h1>
          <p className="text-muted-foreground">
            Write, debug, and save code snippets
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="glow-border border-primary/50 lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Code Editor</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="motoko">Motoko</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Snippet title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="glow-border h-[500px] overflow-hidden rounded-lg border border-primary/30">
                <textarea
                  className="h-full w-full resize-none bg-[#1e1e1e] p-4 font-mono text-sm text-[#d4d4d4] outline-none"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  placeholder={`// Start typing ${language} code here...`}
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={saveSnippet.isPending}
                className="w-full bg-primary"
              >
                {saveSnippet.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Snippet
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="glow-border border-secondary/50">
              <CardHeader>
                <CardTitle>Templates</CardTitle>
                <CardDescription>
                  Quick start with common patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.keys(
                    TEMPLATES[language as keyof typeof TEMPLATES] || {},
                  ).map((template) => (
                    <Button
                      key={template}
                      variant={
                        selectedTemplate === template ? "default" : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      {template}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glow-border border-primary/50">
              <CardHeader>
                <CardTitle>Saved Snippets</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {snippets.length === 0 ? (
                      <p className="text-center text-muted-foreground">
                        No saved snippets
                      </p>
                    ) : (
                      snippets.map((snippet) => (
                        <Button
                          key={snippet.id.toString()}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleLoadSnippet(snippet)}
                        >
                          <div className="flex w-full items-center justify-between">
                            <span className="truncate">{snippet.title}</span>
                            <Badge variant="secondary" className="ml-2">
                              {snippet.language}
                            </Badge>
                          </div>
                        </Button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
