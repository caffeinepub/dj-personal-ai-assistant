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
  folderId?: string; // string representation of bigint folder ID
}

const KNOWLEDGE_PREFIX = "[KNOWLEDGE_SOURCE]";

export function encodeKnowledgeSource(
  type: KnowledgeSourceType,
  title: string,
  url: string,
  content: string,
  category = "General",
  folderId?: string,
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
  const folderPart = folderId ? ` | folderId:${folderId}` : "";
  return `${KNOWLEDGE_PREFIX} type:${type} | title:${safeTitle} | url:${safeUrl} | category:${safeCategory}${folderPart} | summary:${safeSummary} | content:${safeContent}`;
}

export function parseKnowledgeSource(memory: Memory): KnowledgeSource | null {
  if (!memory.content.startsWith(KNOWLEDGE_PREFIX)) return null;

  try {
    const rest = memory.content.slice(KNOWLEDGE_PREFIX.length).trim();
    const typeMatch = rest.match(/type:(\w+)/);
    const titleMatch = rest.match(/\|\s*title:(.+?)\s*\|/);
    const urlMatch = rest.match(/\|\s*url:(.+?)\s*\|/);
    const categoryMatch = rest.match(/\|\s*category:(.+?)\s*\|/);
    const folderIdMatch = rest.match(/\|\s*folderId:(.+?)\s*\|/);
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
    const folderId = folderIdMatch ? folderIdMatch[1].trim() : undefined;
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
      folderId,
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
  const text = html
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

// ─── Scheduled Knowledge Refresh ─────────────────────────────────────────────

const REFRESH_META_KEY = "dj_knowledge_refresh_meta";

export type RefreshInterval = "none" | "daily" | "weekly" | "monthly";

export interface RefreshMeta {
  lastRefreshed: number; // unix ms
  interval: RefreshInterval;
}

export function getRefreshMeta(): Record<string, RefreshMeta> {
  try {
    return JSON.parse(localStorage.getItem(REFRESH_META_KEY) || "{}");
  } catch {
    return {};
  }
}

export function setRefreshMeta(id: string, meta: RefreshMeta) {
  const all = getRefreshMeta();
  all[id] = meta;
  localStorage.setItem(REFRESH_META_KEY, JSON.stringify(all));
}

export function isSourceStale(id: string): boolean {
  const all = getRefreshMeta();
  const meta = all[id];
  if (!meta || meta.interval === "none") return false;
  const now = Date.now();
  const intervals: Record<string, number> = {
    daily: 86400000,
    weekly: 604800000,
    monthly: 2592000000,
  };
  return now - meta.lastRefreshed > intervals[meta.interval];
}

export function getStaleSourceIds(sources: KnowledgeSource[]): string[] {
  return sources
    .filter((s) => s.sourceType === "website" && isSourceStale(String(s.id)))
    .map((s) => String(s.id));
}

// ─── Followed Topics (Auto-Research Mode) ────────────────────────────────────

const FOLLOWED_TOPICS_KEY = "dj_followed_topics";

export function getFollowedTopics(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FOLLOWED_TOPICS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addFollowedTopic(topic: string) {
  const topics = getFollowedTopics();
  if (!topics.includes(topic)) {
    localStorage.setItem(
      FOLLOWED_TOPICS_KEY,
      JSON.stringify([...topics, topic]),
    );
  }
}

export function removeFollowedTopic(topic: string) {
  const topics = getFollowedTopics().filter((t) => t !== topic);
  localStorage.setItem(FOLLOWED_TOPICS_KEY, JSON.stringify(topics));
}

export function generateTopicSuggestions(
  topic: string,
): Array<{ title: string; url: string; description: string }> {
  const encoded = encodeURIComponent(topic);
  const topicLower = topic.toLowerCase();

  const curated: Record<
    string,
    Array<{ title: string; url: string; description: string }>
  > = {
    bitcoin: [
      {
        title: "Bitcoin - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Bitcoin",
        description: "Comprehensive overview of Bitcoin and blockchain",
      },
      {
        title: "Bitcoin.org",
        url: "https://bitcoin.org/en/",
        description: "Official Bitcoin project homepage",
      },
      {
        title: "Bitcoin - Investopedia",
        url: "https://www.investopedia.com/terms/b/bitcoin.asp",
        description: "Financial guide to Bitcoin",
      },
      {
        title: "CoinDesk Bitcoin News",
        url: "https://www.coindesk.com/tag/bitcoin/",
        description: "Latest Bitcoin news and analysis",
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
    ],
    "artificial intelligence": [
      {
        title: "AI - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
        description: "Comprehensive overview of AI",
      },
      {
        title: "AI - Britannica",
        url: "https://www.britannica.com/technology/artificial-intelligence",
        description: "Encyclopedia article on AI",
      },
      {
        title: "MIT CSAIL AI",
        url: "https://www.csail.mit.edu/research/artificial-intelligence",
        description: "MIT's AI research overview",
      },
      {
        title: "AI News - BBC",
        url: "https://www.bbc.com/news/topics/ce1qrvleleqt/artificial-intelligence",
        description: "Latest AI news from BBC",
      },
    ],
    cybersecurity: [
      {
        title: "Cybersecurity - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Computer_security",
        description: "Overview of cybersecurity concepts",
      },
      {
        title: "NIST Cybersecurity Framework",
        url: "https://www.nist.gov/cyberframework",
        description: "NIST's cybersecurity framework",
      },
      {
        title: "Cybersecurity News - Krebs on Security",
        url: "https://krebsonsecurity.com/",
        description: "Leading cybersecurity news blog",
      },
    ],
    finance: [
      {
        title: "Personal Finance - Investopedia",
        url: "https://www.investopedia.com/personal-finance-4427760",
        description: "Personal finance guide",
      },
      {
        title: "Finance - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Finance",
        description: "Overview of finance",
      },
      {
        title: "Money - BBC",
        url: "https://www.bbc.com/news/business/market-data",
        description: "Financial news from BBC",
      },
    ],
  };

  for (const key of Object.keys(curated)) {
    if (topicLower.includes(key)) return curated[key];
  }

  return [
    {
      title: `Wikipedia: ${topic}`,
      url: `https://en.wikipedia.org/wiki/${encoded}`,
      description: `Wikipedia article on ${topic}`,
    },
    {
      title: `Britannica: ${topic}`,
      url: `https://www.britannica.com/search?query=${encoded}`,
      description: `Encyclopedia Britannica on ${topic}`,
    },
    {
      title: `BBC News: ${topic}`,
      url: `https://www.bbc.com/search?q=${encoded}`,
      description: `BBC News coverage of ${topic}`,
    },
    {
      title: `TechRadar: ${topic}`,
      url: `https://www.techradar.com/search?searchTerm=${encoded}`,
      description: `TechRadar articles on ${topic}`,
    },
  ];
}
