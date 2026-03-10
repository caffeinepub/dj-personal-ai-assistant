import type { Memory } from "../backend.d.ts";

export type KnowledgeSourceType = "website" | "pdf" | "word" | "pptx" | "txt";

export interface KnowledgeSource {
  id: bigint;
  sourceType: KnowledgeSourceType;
  title: string;
  url: string;
  content: string;
  summary: string;
  category: string;
  timestamp: bigint;
}

const KNOWLEDGE_PREFIX = "[KNOWLEDGE_SOURCE]";

export function encodeKnowledgeSource(
  type: KnowledgeSourceType,
  title: string,
  url: string,
  content: string,
  category = "General",
): string {
  const truncatedContent = content.slice(0, 2000);
  const safeTitle = title.replace(/\|/g, " ").replace(/\n/g, " ").trim();
  const safeUrl = url.replace(/\|/g, " ").trim();
  const safeContent = truncatedContent.replace(/\n/g, " \\n ");
  const safeCategory = category.replace(/\|/g, " ").replace(/\n/g, " ").trim();
  const summary = content
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
  const safeSummary = summary.replace(/\|/g, " ");
  return `${KNOWLEDGE_PREFIX} type:${type} | title:${safeTitle} | url:${safeUrl} | category:${safeCategory} | summary:${safeSummary} | content:${safeContent}`;
}

export function parseKnowledgeSource(memory: Memory): KnowledgeSource | null {
  if (!memory.content.startsWith(KNOWLEDGE_PREFIX)) return null;

  try {
    const rest = memory.content.slice(KNOWLEDGE_PREFIX.length).trim();
    const typeMatch = rest.match(/type:(\w+)/);
    const titleMatch = rest.match(/\|\s*title:(.+?)\s*\|/);
    const urlMatch = rest.match(/\|\s*url:(.+?)\s*\|/);
    const categoryMatch = rest.match(/\|\s*category:(.+?)\s*\|/);
    const summaryMatch = rest.match(/\|\s*summary:(.+?)\s*\|/);
    const contentMatch = rest.match(/\|\s*content:(.+)$/s);

    if (!typeMatch) return null;

    const sourceType = typeMatch[1] as KnowledgeSourceType;
    const title = titleMatch ? titleMatch[1].trim() : "Untitled";
    const url = urlMatch ? urlMatch[1].trim() : "";
    const content = contentMatch
      ? contentMatch[1].trim().replace(/ \\n /g, "\n")
      : "";
    const category = categoryMatch ? categoryMatch[1].trim() : "General";
    const summary = summaryMatch
      ? summaryMatch[1].trim()
      : content.replace(/\n/g, " ").replace(/\s+/g, " ").trim().slice(0, 200);

    return {
      id: memory.id,
      sourceType,
      title,
      url,
      content,
      summary,
      category,
      timestamp: memory.timestamp,
    };
  } catch {
    return null;
  }
}

export function searchKnowledgeSources(
  sources: KnowledgeSource[],
  query: string,
): KnowledgeSource[] {
  if (!query.trim()) return sources;
  const lower = query.toLowerCase();
  return sources.filter(
    (s) =>
      s.title.toLowerCase().includes(lower) ||
      s.content.toLowerCase().includes(lower) ||
      s.summary.toLowerCase().includes(lower) ||
      s.url.toLowerCase().includes(lower) ||
      s.category.toLowerCase().includes(lower),
  );
}

export function getRelevantContext(
  sources: KnowledgeSource[],
  userMessage: string,
): { context: string; titles: string[] } {
  if (sources.length === 0) return { context: "", titles: [] };

  const words = userMessage
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 4);

  if (words.length === 0) return { context: "", titles: [] };

  const scored = sources
    .map((source) => {
      const searchText = `${source.title} ${source.content}`.toLowerCase();
      const score = words.reduce(
        (acc, word) => acc + (searchText.includes(word) ? 1 : 0),
        0,
      );
      return { source, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (scored.length === 0) return { context: "", titles: [] };

  const titles = scored.map((item) => item.source.title);
  const context = scored
    .map(
      (item) =>
        `[From: ${item.source.title}]\n${item.source.content.slice(0, 500)}`,
    )
    .join("\n\n");

  return { context, titles };
}

export function isKnowledgeSource(memory: Memory): boolean {
  return memory.content.startsWith(KNOWLEDGE_PREFIX);
}

export function extractTextFromHtml(html: string): string {
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}
