import type { Memory } from "../types/backendTypes";

export type KnowledgeSourceType = "website" | "pdf" | "word" | "pptx" | "txt";

export type RefreshInterval = "daily" | "weekly" | "monthly" | "none";

export interface KnowledgeSource {
  id: bigint;
  sourceType: KnowledgeSourceType;
  title: string;
  url: string;
  content: string;
  summary: string;
  category: string;
  timestamp: bigint;
  folderId?: string;
}

export interface CuratedSuggestion {
  title: string;
  url: string;
  description: string;
}

export interface RefreshMeta {
  interval: RefreshInterval;
  lastRefreshed: number;
}

const KNOWLEDGE_PREFIX = "[KNOWLEDGE_SOURCE]";

// ── Encoding / decoding ──────────────────────────────────────────────────────

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

export function isKnowledgeSource(memory: Memory): boolean {
  return memory.content.startsWith(KNOWLEDGE_PREFIX);
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

// ── Search ────────────────────────────────────────────────────────────────────

export function searchKnowledgeSources(
  sources: KnowledgeSource[],
  query: string,
): KnowledgeSource[] {
  if (!query.trim()) return sources;
  const lower = query.toLowerCase();
  return sources
    .filter(
      (s) =>
        s.title.toLowerCase().includes(lower) ||
        s.content.toLowerCase().includes(lower) ||
        s.summary.toLowerCase().includes(lower) ||
        s.category.toLowerCase().includes(lower),
    )
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(lower) ? 1 : 0;
      const bTitle = b.title.toLowerCase().includes(lower) ? 1 : 0;
      return bTitle - aTitle;
    });
}

export function getRelevantContext(
  content: string,
  query: string,
  maxLength = 800,
): string {
  const lower = query.toLowerCase();
  const lines = content.split("\n").filter((l) => l.trim().length > 0);

  const keywords = lower
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5);
  const scoredLines = lines.map((line) => ({
    line,
    score: keywords.filter((kw) => line.toLowerCase().includes(kw)).length,
  }));

  const relevantLines = scoredLines
    .filter((l) => l.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((l) => l.line);

  if (relevantLines.length === 0) {
    return content.slice(0, maxLength);
  }

  return relevantLines.join("\n").slice(0, maxLength);
}

// ── Topic suggestions ───────────────────────────────────────────────────────

export function generateTopicSuggestions(topic: string): CuratedSuggestion[] {
  const lower = topic.toLowerCase();
  const curated: Record<string, CuratedSuggestion[]> = {
    networking: [
      {
        title: "Cisco Enterprise Networking",
        url: "https://www.cisco.com/c/en/us/solutions/enterprise-networks/",
        description: "Cisco's guide to enterprise networking solutions",
      },
      {
        title: "CompTIA Network Security Guide",
        url: "https://www.comptia.org/content/guides/what-is-network-security",
        description: "Introduction to network security fundamentals",
      },
    ],
    security: [
      {
        title: "SANS Reading Room",
        url: "https://www.sans.org/reading-room/",
        description: "SANS Institute security research and whitepapers",
      },
      {
        title: "OWASP Top Ten",
        url: "https://owasp.org/www-project-top-ten/",
        description: "The ten most critical web application security risks",
      },
    ],
    finance: [
      {
        title: "Investopedia Personal Finance",
        url: "https://www.investopedia.com/personal-finance-4427760",
        description: "Personal finance tips and guides",
      },
      {
        title: "NerdWallet Budgeting Tips",
        url: "https://www.nerdwallet.com/article/finance/budgeting-tips",
        description: "Practical budgeting strategies",
      },
    ],
    productivity: [
      {
        title: "Todoist Productivity Methods",
        url: "https://todoist.com/productivity-methods",
        description: "Popular productivity frameworks and methods",
      },
      {
        title: "Lifehacker Productivity",
        url: "https://www.lifehacker.com/productivity",
        description: "Practical productivity tips and tools",
      },
    ],
    bitcoin: [
      {
        title: "Bitcoin: How It Works",
        url: "https://bitcoin.org/en/how-it-works",
        description: "Official Bitcoin introduction and guide",
      },
      {
        title: "Investopedia: Bitcoin",
        url: "https://www.investopedia.com/terms/b/bitcoin.asp",
        description: "Comprehensive Bitcoin explainer",
      },
    ],
    ethereum: [
      {
        title: "What is Ethereum?",
        url: "https://ethereum.org/en/what-is-ethereum/",
        description: "Official Ethereum introduction",
      },
      {
        title: "Investopedia: Ethereum",
        url: "https://www.investopedia.com/terms/e/ethereum.asp",
        description: "Ethereum explainer for investors",
      },
    ],
    ai: [
      {
        title: "IBM: What is AI?",
        url: "https://www.ibm.com/topics/artificial-intelligence",
        description: "IBM's overview of artificial intelligence",
      },
      {
        title: "McKinsey: State of AI",
        url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
        description: "McKinsey's annual AI industry report",
      },
    ],
  };

  for (const [key, suggestions] of Object.entries(curated)) {
    if (lower.includes(key)) return suggestions;
  }
  return [];
}

// ── Followed topics (localStorage-persisted) ──────────────────────────────────

const FOLLOWED_TOPICS_KEY = "dj_followed_topics";

export function getFollowedTopics(): string[] {
  try {
    const raw = localStorage.getItem(FOLLOWED_TOPICS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addFollowedTopic(topic: string): void {
  const topics = getFollowedTopics();
  if (!topics.includes(topic)) {
    topics.push(topic);
    localStorage.setItem(FOLLOWED_TOPICS_KEY, JSON.stringify(topics));
  }
}

export function removeFollowedTopic(topic: string): void {
  const topics = getFollowedTopics().filter((t) => t !== topic);
  localStorage.setItem(FOLLOWED_TOPICS_KEY, JSON.stringify(topics));
}

// ── Refresh metadata (localStorage-persisted) ────────────────────────────────

const REFRESH_META_KEY = "dj_source_refresh_meta";

/** Returns the full refresh-meta store (keyed by string source ID). */
export function getRefreshMeta(): Record<string, RefreshMeta> {
  try {
    const raw = localStorage.getItem(REFRESH_META_KEY);
    return raw ? (JSON.parse(raw) as Record<string, RefreshMeta>) : {};
  } catch {
    return {};
  }
}

export function setRefreshMeta(sourceId: string, meta: RefreshMeta): void {
  try {
    const store = getRefreshMeta();
    store[sourceId] = meta;
    localStorage.setItem(REFRESH_META_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}

// ── Staleness checks ────────────────────────────────────────────────────────────

const INTERVAL_MS: Record<Exclude<RefreshInterval, "none">, number> = {
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

/** Check if a source (by string ID) is stale based on its refresh schedule. */
export function isSourceStale(sourceId: string): boolean {
  const store = getRefreshMeta();
  const meta = store[sourceId];
  if (!meta || meta.interval === "none") return false;
  const elapsed = Date.now() - meta.lastRefreshed;
  return (
    elapsed > INTERVAL_MS[meta.interval as Exclude<RefreshInterval, "none">]
  );
}

/** Return IDs (as strings) of all sources that are currently stale. */
export function getStaleSourceIds(sources: KnowledgeSource[]): string[] {
  return sources
    .filter((s) => isSourceStale(String(s.id)))
    .map((s) => String(s.id));
}

// ── HTML text extraction ─────────────────────────────────────────────────────────

/**
 * Strip HTML tags and return plain text content.
 * Preserves newlines from block-level elements.
 */
export function extractTextFromHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|h[1-6]|li|tr|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
