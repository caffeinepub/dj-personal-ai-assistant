import { l as buildContextPrompt, s as savePlan, m as getPlans, n as useActor, o as useContextEngine, p as useQueryClient, q as useChatThreads, r as reactExports, t as useThreadMessages, b as useMemories, e as useBehaviorRules, v as usePersonalitySettings, w as useAddMemory, x as useDeleteMemory, y as useCreateCustomCommand, z as useSetBehaviorRule, A as useSetPersonalitySettings, h as useActivateModule, i as useDeactivateModule, k as ue, j as jsxRuntimeExports, L as Link } from "./index-D4lUgCCM.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D6TXgbbC.js";
import { B as Badge } from "./badge-BMXMPn3_.js";
import { c as createLucideIcon, B as Button } from "./createLucideIcon-a11X8bAo.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-BpTMTJ9f.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { S as ScrollArea } from "./scroll-area-D1D6khfo.js";
import { S as Sheet, a as SheetContent, b as SheetHeader, c as SheetTitle } from "./sheet-C7--ZfiQ.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-eotKpg0e.js";
import { M as MessageSquare, L as Layout, X, a as BookOpen, b as SquareCheckBig, D as DollarSign, c as StickyNote } from "./Layout-y-fTRwTO.js";
import { d as deduplicateOrSave, p as parseMemoryNodes } from "./memoryStore-Bzrl9ll5.js";
import { p as parseKnowledgeSource, s as searchKnowledgeSources, g as getRelevantContext } from "./knowledgeSources-u_u5fZVB.js";
import { g as generatePlanFromGoal } from "./planGenerator-FraClx5b.js";
import { P as Plus } from "./plus-D6lHqroT.js";
import { L as LoaderCircle } from "./loader-circle-Tr-8VCUp.js";
import { T as Trash2 } from "./trash-2-BvljEyqY.js";
import { M as MicOff } from "./mic-off-N3UQvSP9.js";
import { M as Mic } from "./mic-q3q9Ut1L.js";
import { S as Send } from "./send-YzF6jtlA.js";
import "./index-DREpW-Gk.js";
import "./proxy-CDDWEtkX.js";
import "./index-IXOTxK3N.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 18h16", key: "19g7jn" }],
  ["path", { d: "M4 6h16", key: "1o0s65" }]
];
const Menu = createLucideIcon("menu", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M4.9 19.1C1 15.2 1 8.8 4.9 4.9", key: "1vaf9d" }],
  ["path", { d: "M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5", key: "u1ii0m" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5", key: "1j5fej" }],
  ["path", { d: "M19.1 4.9C23 8.8 23 15.1 19.1 19", key: "10b0cb" }]
];
const Radio = createLucideIcon("radio", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
];
const Volume2 = createLucideIcon("volume-2", __iconNode$1);
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
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
];
const VolumeX = createLucideIcon("volume-x", __iconNode);
const INIT_FLAG_KEY = "dj_memory_extraction_initialized";
function isMemoryExtractionInitialized() {
  return localStorage.getItem(INIT_FLAG_KEY) === "true";
}
function setMemoryExtractionInitialized() {
  localStorage.setItem(INIT_FLAG_KEY, "true");
}
function shouldSkip(message) {
  if (message.trim().length < 10) return true;
  if (/^dj[,\s]/i.test(message.trim())) return true;
  return false;
}
function candidate(type, content, tags = [], importance = 3) {
  return { type, content, tags, importance };
}
function extractMemories(message) {
  if (shouldSkip(message)) return [];
  const found = [];
  const m = message.trim();
  const nameMatch = m.match(
    /(?:my name is|i am called|i'm called)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
  );
  if (nameMatch)
    found.push(
      candidate(
        "user_profile",
        `Name: ${nameMatch[1]}`,
        ["name", "profile"],
        5
      )
    );
  const profMatch = m.match(
    /(?:i (?:am|work as|work at)|i'm)\s+(a |an )?(developer|engineer|designer|accountant|manager|teacher|doctor|lawyer|student|analyst|consultant|architect|nurse|chef|writer|journalist|entrepreneur|freelancer|artist|musician|scientist|researcher)[\s.!,]/i
  );
  if (profMatch) {
    const profession = profMatch[2];
    found.push(
      candidate(
        "user_profile",
        `Profession: ${profession}`,
        ["profession", "work"],
        4
      )
    );
  }
  const workAtMatch = m.match(/i work at\s+([^.,!?]+)/i);
  if (workAtMatch)
    found.push(
      candidate(
        "user_profile",
        `Works at: ${workAtMatch[1].trim()}`,
        ["work", "company"],
        3
      )
    );
  const ageMatch = m.match(/i(?:'m| am)\s+(\d{1,3})\s+years? old/i);
  if (ageMatch)
    found.push(
      candidate("user_profile", `Age: ${ageMatch[1]}`, ["age", "profile"], 3)
    );
  const locationMatch = m.match(
    /(?:i live in|i'm from|i am from|i'm based in)\s+([^.,!?]+)/i
  );
  if (locationMatch)
    found.push(
      candidate(
        "user_profile",
        `Location: ${locationMatch[1].trim()}`,
        ["location", "profile"],
        3
      )
    );
  const goalMatch = m.match(
    /(?:i want to|i'd like to|my goal is|i'm trying to|i plan to|i hope to|i aim to)\s+([^.,!?]{10,80})/i
  );
  if (goalMatch)
    found.push(
      candidate("user_goal", goalMatch[1].trim(), ["goal", "objective"], 4)
    );
  const likeMatch = m.match(
    /(?:i (?:prefer|like|love|enjoy|use))\s+([^.,!?]{5,60})/i
  );
  if (likeMatch)
    found.push(
      candidate(
        "user_preference",
        `Likes: ${likeMatch[1].trim()}`,
        ["preference", "like"],
        3
      )
    );
  const dislikeMatch = m.match(
    /(?:i (?:don't like|hate|dislike|avoid))\s+([^.,!?]{5,60})/i
  );
  if (dislikeMatch)
    found.push(
      candidate(
        "user_preference",
        `Dislikes: ${dislikeMatch[1].trim()}`,
        ["preference", "dislike"],
        3
      )
    );
  const habitMatch = m.match(
    /(?:i always|i usually|i typically|every morning|every evening|every day|each day|daily)\s+([^.,!?]{5,80})/i
  );
  if (habitMatch)
    found.push(
      candidate("habit", habitMatch[1].trim(), ["habit", "routine"], 3)
    );
  const factMatch = m.match(
    /(?:remember that|note that|important:|fyi:?)\s+([^.,!?]{5,120})/i
  );
  if (factMatch)
    found.push(candidate("fact", factMatch[1].trim(), ["fact"], 3));
  const projectMatch = m.match(
    /(?:i(?:'m| am) working on|my project|our project)\s+([^.,!?]{5,80})/i
  );
  if (projectMatch)
    found.push(
      candidate("project", projectMatch[1].trim(), ["project", "work"], 4)
    );
  const learnMatch = m.match(
    /(?:i(?:'m| am) (?:learning|studying|reading about|interested in|exploring))\s+([^.,!?]{5,80})/i
  );
  if (learnMatch)
    found.push(
      candidate(
        "knowledge_topic",
        learnMatch[1].trim(),
        ["learning", "topic"],
        3
      )
    );
  return found;
}
function scoreNode(node, query) {
  const q = query.toLowerCase();
  const content = node.content.toLowerCase();
  const tags = node.tags.join(" ").toLowerCase();
  let score = 0;
  if (content.includes(q)) score += 10;
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  for (const word of words) {
    if (content.includes(word)) score += 3;
    if (tags.includes(word)) score += 2;
  }
  score += node.importance;
  return score;
}
function searchRelevantMemories(nodes, query, limit = 5) {
  if (!query.trim()) return [];
  return nodes.filter((n) => !n.archived).map((n) => ({ node: n, score: scoreNode(n, query) })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map(({ node }) => node);
}
function formatMemoriesForReply(nodes) {
  if (nodes.length === 0)
    return "I don't have any stored memories on that topic yet.";
  return nodes.map((n) => `• ${n.content} _(${n.type.replace("_", " ")})_`).join("\n");
}
function makeDecision(intent, entities, originalMessage) {
  switch (intent) {
    case "SEARCH_KNOWLEDGE":
      return {
        action: "SEARCH_KNOWLEDGE",
        query: entities.kind === "knowledgeQuery" ? entities.data.query : originalMessage
      };
    case "SYNTHESIZE_KNOWLEDGE":
      return {
        action: "SYNTHESIZE_KNOWLEDGE",
        query: entities.kind === "knowledgeQuery" ? entities.data.query : originalMessage
      };
    case "REMEMBER":
      return {
        action: "REMEMBER",
        content: entities.kind === "memory" ? entities.data.content : originalMessage
      };
    case "FORGET":
      return {
        action: "FORGET",
        content: entities.kind === "memory" ? entities.data.content : originalMessage
      };
    case "LIST_MEMORIES":
      return { action: "LIST_MEMORIES" };
    case "RESET_MEMORIES":
      return { action: "RESET_MEMORIES" };
    case "MEMORY_QUERY":
      return { action: "MEMORY_QUERY", query: originalMessage };
    case "CREATE_COMMAND":
      if (entities.kind !== "command") break;
      return {
        action: "CREATE_COMMAND",
        name: entities.data.name,
        commandAction: entities.data.action
      };
    case "SET_RULE":
      if (entities.kind !== "rule") break;
      return { action: "SET_RULE", ruleText: entities.data.ruleText };
    case "SET_PERSONALITY":
      if (entities.kind !== "personality") break;
      return { action: "SET_PERSONALITY", style: entities.data.style };
    case "ACTIVATE_MODULE":
      if (entities.kind !== "module") break;
      return {
        action: "ACTIVATE_MODULE",
        moduleName: entities.data.moduleName
      };
    case "DEACTIVATE_MODULE":
      if (entities.kind !== "module") break;
      return {
        action: "DEACTIVATE_MODULE",
        moduleName: entities.data.moduleName
      };
    case "ADD_TASK":
      if (entities.kind !== "task") break;
      return {
        action: "ADD_TASK",
        taskTitle: entities.data.taskTitle,
        deadlineMs: entities.data.deadlineMs,
        alreadyPassedToday: entities.data.alreadyPassedToday,
        timeRaw: entities.data.timeRaw
      };
    case "ADD_NOTE":
      if (entities.kind !== "note") break;
      return {
        action: "ADD_NOTE",
        noteTitle: entities.data.noteTitle,
        noteContent: entities.data.noteContent
      };
    case "ADD_FINANCE":
      if (entities.kind !== "finance") break;
      return {
        action: "ADD_FINANCE",
        amount: entities.data.amount,
        amountStr: entities.data.amountStr,
        description: entities.data.description,
        category: entities.data.category,
        isIncome: entities.data.isIncome
      };
    case "CREATE_PLAN":
      return { action: "CREATE_PLAN", rawMessage: originalMessage };
    case "SHOW_PLANS":
      return { action: "SHOW_PLANS", rawMessage: originalMessage };
    case "AUTONOMY_REVIEW":
      return { action: "AUTONOMY_REVIEW" };
    case "DAILY_ROUTINE":
      return { action: "DAILY_ROUTINE", rawMessage: originalMessage };
  }
  return { action: "GENERAL_RESPONSE", originalMessage };
}
function extractEntities(message, intent) {
  switch (intent) {
    case "SEARCH_KNOWLEDGE":
    case "SYNTHESIZE_KNOWLEDGE": {
      const m = message.match(
        /(?:dj,?\s*)?(?:search\s+(?:my\s+)?knowledge\s+(?:base\s+)?for|what\s+do\s+you\s+know\s+about)\s+(.+)/i
      ) || message.match(
        /(?:what\s+do\s+(?:all\s+)?(?:my\s+)?(?:sources?|knowledge|files?)\s+say\s+about|summarize\s+(?:my\s+)?(?:knowledge|sources?)\s+(?:on|about)|tell\s+me\s+everything\s+(?:you\s+know\s+)?about)\s+(.+)/i
      );
      return {
        kind: "knowledgeQuery",
        data: { query: m ? m[1].trim() : message.trim() }
      };
    }
    case "REMEMBER":
    case "FORGET": {
      const content = message.replace(/^(dj,?\s*)?(?:remember|forget)\s+/i, "").trim();
      return { kind: "memory", data: { content } };
    }
    case "LIST_MEMORIES":
    case "RESET_MEMORIES":
    case "GENERAL":
      return { kind: "general" };
    case "CREATE_COMMAND": {
      const m = message.match(
        /(?:dj,?\s*)?create\s+(?:a\s+)?command\s+called\s+"([^"]+)"\s+that\s+(.+)/i
      );
      if (!m) return { kind: "general" };
      return { kind: "command", data: { name: m[1], action: m[2] } };
    }
    case "SET_RULE": {
      const ruleText = message.replace(/^(dj,?\s*)?(?:your\s+new\s+rule\s+is|set\s+rule:)\s*/i, "").trim();
      return { kind: "rule", data: { ruleText } };
    }
    case "SET_PERSONALITY": {
      const lower = message.toLowerCase();
      let style = "professional";
      if (lower.includes("casual")) style = "casual";
      else if (lower.includes("concise")) style = "concise";
      else if (lower.includes("detailed")) style = "detailed";
      else if (lower.includes("formal")) style = "formal";
      return { kind: "personality", data: { style } };
    }
    case "ACTIVATE_MODULE":
    case "DEACTIVATE_MODULE": {
      const m = message.match(
        /(?:dj,?\s*)?(?:activate|deactivate)\s+(?:the\s+)?(\w+)\s+module/i
      );
      if (!m) return { kind: "general" };
      return { kind: "module", data: { moduleName: m[1].toLowerCase() } };
    }
    case "ADD_TASK": {
      return { kind: "task", data: extractTaskEntities(message) };
    }
    case "ADD_NOTE": {
      const m = message.match(
        /(?:add\s+(?:a\s+)?note[:\s]+|note[:\s]+|save\s+(?:a\s+)?note[:\s]+|remember\s+this\s+note[:\s]+)(.+)/i
      );
      const noteContent = m ? m[1].trim() : message.trim();
      const noteTitle = noteContent.split(" ").slice(0, 5).join(" ");
      return { kind: "note", data: { noteContent, noteTitle } };
    }
    case "ADD_FINANCE": {
      return { kind: "finance", data: extractFinanceEntities(message) };
    }
    default:
      return { kind: "general" };
  }
}
function extractTaskEntities(message) {
  var _a, _b;
  const lower = message.toLowerCase();
  const taskMatch = message.match(
    /(?:remind(?:er)?\s+me\s+(?:to\s+)?|add\s+(?:a\s+)?task[:\s]+|set\s+(?:a\s+)?reminder[:\s]+|schedule[:\s]+)(.+?)(?:\s+(?:at|by|on|before|today|tomorrow)\s+(.+))?$/i
  );
  const titleRaw = taskMatch ? taskMatch[1].trim() : message.replace(
    /^(dj,?\s*)?(add\s+task|remind\s+me|reminder\s+me|set\s+reminder|new\s+task)[:\s]*/i,
    ""
  ).trim();
  const timeRaw = taskMatch ? taskMatch[2] : void 0;
  const cleanTitle = titleRaw.replace(/\b(today|tomorrow)\b/gi, "").replace(/\b(at|by|on|before)\s+\d{1,2}(:\d{2})?\s*(am|pm)?\b/gi, "").replace(/\b\d{1,2}:\d{2}\s*(am|pm)?\b/gi, "").replace(/\b\d{1,2}\s*(am|pm)\b/gi, "").replace(/\s{2,}/g, " ").trim();
  const taskTitle = cleanTitle || titleRaw;
  let deadlineMs = null;
  let alreadyPassedToday = false;
  const timePat1 = /(\d{1,2}):(\d{2})\s*(am|pm)?/i;
  const timePat2 = /(\d{1,2})\s*(am|pm)/i;
  const timeMatch1 = message.match(timePat1);
  const timeMatch2 = !timeMatch1 ? message.match(timePat2) : null;
  if (timeMatch1) {
    let hours = Number.parseInt(timeMatch1[1]);
    const minutes = Number.parseInt(timeMatch1[2]);
    const ampm = (_a = timeMatch1[3]) == null ? void 0 : _a.toLowerCase();
    if (ampm === "pm" && hours < 12) hours += 12;
    if (ampm === "am" && hours === 12) hours = 0;
    const d = /* @__PURE__ */ new Date();
    d.setHours(hours, minutes, 0, 0);
    if (d.getTime() < Date.now()) {
      if (lower.includes("today")) alreadyPassedToday = true;
      else d.setDate(d.getDate() + 1);
    }
    deadlineMs = BigInt(d.getTime()) * BigInt(1e6);
  } else if (timeMatch2) {
    let hours = Number.parseInt(timeMatch2[1]);
    const ampm = (_b = timeMatch2[2]) == null ? void 0 : _b.toLowerCase();
    if (ampm === "pm" && hours < 12) hours += 12;
    if (ampm === "am" && hours === 12) hours = 0;
    const d = /* @__PURE__ */ new Date();
    d.setHours(hours, 0, 0, 0);
    if (d.getTime() < Date.now()) {
      if (lower.includes("today")) alreadyPassedToday = true;
      else d.setDate(d.getDate() + 1);
    }
    deadlineMs = BigInt(d.getTime()) * BigInt(1e6);
  } else if (lower.includes("today")) {
    const d = /* @__PURE__ */ new Date();
    d.setHours(23, 59, 0, 0);
    deadlineMs = BigInt(d.getTime()) * BigInt(1e6);
  } else if (lower.includes("tomorrow")) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    deadlineMs = BigInt(d.getTime()) * BigInt(1e6);
  }
  return { taskTitle, deadlineMs, alreadyPassedToday, timeRaw };
}
function extractFinanceEntities(message) {
  var _a;
  const fmCategory = message.match(
    /(?:add|log|record|track)\s+([\w][\w\s]*?)\s+(expense|income)\s+(?:rs\.?|inr|₹|\$|usd)?\s*(\d+(?:\.\d{1,2})?)/i
  );
  if (fmCategory) {
    const categoryRaw = fmCategory[1].trim();
    const typeKeyword = fmCategory[2].toLowerCase();
    const amountStr2 = fmCategory[3];
    const amount2 = Math.round(Number.parseFloat(amountStr2) * 100);
    const isIncome2 = typeKeyword === "income";
    return {
      amount: amount2,
      amountStr: amountStr2,
      description: categoryRaw,
      category: categoryRaw.toLowerCase(),
      isIncome: isIncome2
    };
  }
  const fm1 = message.match(
    /(?:add\s+)?(?:today'?s?\s+)?(?:an?\s+)?(?:expense|spent?|cost|paid?|income|earning|received?|got)\s+(?:of\s+)?(?:rs\.?|inr|₹|\$|usd)?\s*(\d+(?:\.\d{1,2})?)\s*(?:(?:rs\.?|inr|₹|\$)?)?\s*\.?\s*(?:(?:on|for|as|from)\s+(.+?))?(?:\/[-]?)?$/i
  );
  const fm2 = message.match(
    /(?:rs\.?|inr|₹|\$|usd)\s*(\d+(?:\.\d{1,2})?)\s*(?:(?:on|for|as|from)\s+(.+?))?(?:\/[-]?)?\s*(?:expense|income|earned?)?$/i
  );
  const fm3 = message.match(
    /(?:add\s+)?(?:today'?s?\s+)?(?:an?\s+)?(?:expense|spent?|cost|paid?|income|earning|received?|got)\s+(?:of\s+)?(?:rs\.?\s+)(\d+(?:\.\d{1,2})?)/i
  );
  const fm = fm1 || fm2 || fm3;
  const amountStr = fm ? fm[1] : "0";
  const descRaw = ((_a = fm == null ? void 0 : fm[2]) == null ? void 0 : _a.trim().replace(/[\/\-]+$/, "")) || "";
  const amount = Math.round(Number.parseFloat(amountStr) * 100);
  const isIncome = /income|earning|received?|got/i.test(message);
  const category = isIncome ? "income" : descRaw || "general";
  const description = descRaw || (isIncome ? "Income" : "Expense");
  return { amount, amountStr, description, category, isIncome };
}
function detectIntent(message) {
  const lower = message.toLowerCase().trim();
  const searchMatch = message.match(
    /(?:dj,?\s*)?(?:search\s+(?:my\s+)?knowledge\s+(?:base\s+)?for|what\s+do\s+you\s+know\s+about)\s+(.+)/i
  );
  if (searchMatch) return { intent: "SEARCH_KNOWLEDGE", match: searchMatch };
  const synthesisMatch = message.match(
    /(?:what\s+do\s+(?:all\s+)?(?:my\s+)?(?:sources?|knowledge|files?)\s+say\s+about|summarize\s+(?:my\s+)?(?:knowledge|sources?)\s+(?:on|about)|tell\s+me\s+everything\s+(?:you\s+know\s+)?about)\s+(.+)/i
  );
  if (synthesisMatch)
    return { intent: "SYNTHESIZE_KNOWLEDGE", match: synthesisMatch };
  if (lower.match(/^(dj,?\s*)?remember\s+/i)) return { intent: "REMEMBER" };
  if (lower.match(/^(dj,?\s*)?forget\s+/i)) return { intent: "FORGET" };
  if (lower.includes("what do you remember") || lower.includes("show memories") || lower.includes("list memories"))
    return { intent: "LIST_MEMORIES" };
  if (lower.includes("reset all") && lower.includes("memor"))
    return { intent: "RESET_MEMORIES" };
  if (lower.includes("what do you know about me") || lower.includes("what are my goals") || lower.includes("what are my preferences") || lower.includes("what are my habits") || lower.includes("what projects am i") || lower.includes("show my memories") || lower.includes("what have you learned about me") || lower.match(/what do you remember about\s+(.+)/i))
    return { intent: "MEMORY_QUERY" };
  const commandMatch = message.match(
    /(?:dj,?\s*)?create\s+(?:a\s+)?command\s+called\s+"([^"]+)"\s+that\s+(.+)/i
  );
  if (commandMatch) return { intent: "CREATE_COMMAND", match: commandMatch };
  if (lower.includes("your new rule is") || lower.includes("set rule:"))
    return { intent: "SET_RULE" };
  if (lower.includes("be more formal") || lower.includes("be more casual") || lower.includes("be more concise") || lower.includes("be more detailed") || lower.includes("be more professional"))
    return { intent: "SET_PERSONALITY" };
  const activateMatch = message.match(
    /(?:dj,?\s*)?activate\s+(?:the\s+)?(\w+)\s+module/i
  );
  if (activateMatch) return { intent: "ACTIVATE_MODULE", match: activateMatch };
  const deactivateMatch = message.match(
    /(?:dj,?\s*)?deactivate\s+(?:the\s+)?(\w+)\s+module/i
  );
  if (deactivateMatch)
    return { intent: "DEACTIVATE_MODULE", match: deactivateMatch };
  if (lower.includes("review my goals") || lower.includes("what should i focus on") || lower.includes("suggest improvements") || lower.includes("autonomy review") || lower.match(/dj,?\s+(review|suggest|focus)/i))
    return { intent: "AUTONOMY_REVIEW" };
  if (lower.includes("start my morning routine") || lower.includes("morning routine") || lower.includes("start work mode") || lower.includes("work mode") || lower.includes("review my day") || lower.includes("end of day") || lower.includes("daily briefing") || lower.includes("start my day") || lower.match(/^(dj,?\s*)?(morning|briefing|work mode|end.of.day)/i))
    return { intent: "DAILY_ROUTINE" };
  if (lower.includes("show my plans") || lower.includes("show plans") || lower.includes("list plans") || lower.includes("my plans"))
    return { intent: "SHOW_PLANS" };
  if (lower.match(/(?:create|make|build|set\s+up)\s+a\s+plan\s+(?:for|to)/i) || lower.match(
    /^(dj,?\s*)?(i\s+want\s+to|my\s+goal\s+is|i\s+plan\s+to)\s+/i
  ) || lower.match(/plan\s+for\s+.{3,}/i))
    return { intent: "CREATE_PLAN" };
  if (lower.match(
    /(?:add|create|set)\s+(?:a\s+)?(?:task|reminder|todo|to-do|to\s+do)/
  ) || lower.match(/remind\s+me\s+(?:to|about)/))
    return { intent: "ADD_TASK" };
  if (lower.match(/(?:add|save|create|write)\s+(?:a\s+)?note/) || lower.match(/note:?\s+.{5,}/))
    return { intent: "ADD_NOTE" };
  if (lower.match(
    /(?:add|log|record|track)\s+(?:a\s+)?(?:expense|income|transaction|payment|purchase)/
  ) || // "Add Food Expense 500", "Add Fuel expense 100"
  lower.match(/(?:add|log)\s+\w[\w\s]*\s+(?:expense|income)\b/i) || // "Add expense 500 food", "Log income 1000"
  lower.match(/(?:add|log|record|track)\s+(?:expense|income)\s+\d/i) || lower.match(/(?:i\s+)?(?:spent|paid|earned|received|bought)\s+/))
    return { intent: "ADD_FINANCE" };
  return { intent: "GENERAL" };
}
function trimToLines(text, maxLines = 6) {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length <= maxLines) return text;
  return `${lines.slice(0, maxLines).join("\n")}

*— trimmed for brevity*`;
}
function timePrefix(timeOfDay) {
  switch (timeOfDay) {
    case "morning":
      return "Good morning. ";
    case "evening":
      return "Good evening. ";
    case "night":
      return "Working late. ";
    default:
      return "";
  }
}
function selectTone(decision) {
  switch (decision.action) {
    case "ADD_TASK":
    case "ADD_NOTE":
    case "ADD_FINANCE":
      return "neutral";
    case "SEARCH_KNOWLEDGE":
    case "SYNTHESIZE_KNOWLEDGE":
      return "friendly";
    default:
      return "professional";
  }
}
const TASK_SUGGESTIONS = [
  "Would you like to set a priority level for this task?",
  "Should I schedule a reminder closer to the deadline?",
  "Want to add a note to go along with this task?"
];
const NOTE_SUGGESTIONS = [
  "Want to save this to a specific knowledge folder?",
  "Should I tag this note with a topic?",
  "Would you like to add more detail to this note?"
];
const FINANCE_SUGGESTIONS = [
  "Would you like to view your current monthly summary?",
  "Should I log another entry?",
  "Want to check your spending in a category?"
];
const KNOWLEDGE_SUGGESTIONS = [
  "Want me to save this topic in your knowledge base?",
  "Would you like to explore a related topic?",
  "Should I search your saved documents for more?"
];
function getSuggestions(decision) {
  const pool = (() => {
    switch (decision.action) {
      case "ADD_TASK":
        return TASK_SUGGESTIONS;
      case "ADD_NOTE":
        return NOTE_SUGGESTIONS;
      case "ADD_FINANCE":
        return FINANCE_SUGGESTIONS;
      case "SEARCH_KNOWLEDGE":
      case "SYNTHESIZE_KNOWLEDGE":
        return KNOWLEDGE_SUGGESTIONS;
      default:
        return [];
    }
  })();
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}
const TASK_ACKS = [
  "Done. I've added that to your task list.",
  "Task saved. You're on it.",
  "Got it — that's on your list now.",
  "Added to your tasks. I'll keep an eye on the deadline."
];
const NOTE_ACKS = [
  "Saved. That note is safely stored.",
  "Got it — note added.",
  "Done. I've saved that note for you."
];
const FINANCE_ACKS = [
  "Logged. Your finance record is updated.",
  "Entry saved. Your balance is up to date.",
  "Done — finance entry recorded."
];
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function naturalAck(decision) {
  if (!decision.action) return null;
  switch (decision.action) {
    case "ADD_TASK":
      return pickRandom(TASK_ACKS);
    case "ADD_NOTE":
      return pickRandom(NOTE_ACKS);
    case "ADD_FINANCE":
      return pickRandom(FINANCE_ACKS);
    default:
      return null;
  }
}
function buildMemoryContext(memories) {
  if (!memories || memories.length === 0) return "";
  const snippets = memories.slice(0, 3).map((m) => m.content).join("; ");
  return `

_Based on what I know about you: ${snippets}_`;
}
function composeReply(input) {
  const {
    skillResult,
    decision,
    context,
    conversationHistory,
    relevantMemories
  } = input;
  const tone = selectTone(decision);
  const suggestions = getSuggestions(decision);
  if (!skillResult.success) {
    return {
      message: "I'm not fully confident about that request yet. You can teach me how to handle it by saying 'DJ, remember [fact]' or visiting the Teach DJ page.",
      tone: "professional",
      suggestions: [
        "Would you like to teach DJ a new rule?",
        "Try rephrasing your request."
      ]
    };
  }
  const isFirstMessage = ((conversationHistory == null ? void 0 : conversationHistory.length) ?? 0) === 0;
  const prefix = isFirstMessage ? timePrefix(context.timeOfDay) : "";
  const ack = naturalAck(decision);
  const baseMessage = ack ? `${prefix}${ack} ${skillResult.message}`.trim() : `${prefix}${trimToLines(skillResult.message)}`.trim();
  const memoryContext = !ack && relevantMemories && relevantMemories.length > 0 ? buildMemoryContext(relevantMemories) : "";
  return {
    message: `${baseMessage}${memoryContext}`,
    tone,
    suggestions: suggestions.length > 0 ? suggestions : void 0
  };
}
function composedReplyToString(reply) {
  if (!reply.suggestions || reply.suggestions.length === 0) {
    return reply.message;
  }
  const suggestionText = reply.suggestions.map((s) => `• ${s}`).join("\n");
  return `${reply.message}

${suggestionText}`;
}
const BUILTIN_KNOWLEDGE = [
  // ======= IT =======
  {
    id: "it_networking_basics",
    topic: "Networking Basics",
    category: "IT",
    keywords: [
      "network",
      "ip address",
      "dns",
      "tcp",
      "udp",
      "router",
      "switch",
      "firewall",
      "subnet",
      "bandwidth",
      "latency",
      "ping"
    ],
    content: "**Networking Basics**\n\n- **IP Address**: A unique identifier for devices on a network. IPv4 uses 32-bit (e.g., 192.168.1.1); IPv6 uses 128-bit.\n- **DNS (Domain Name System)**: Translates domain names (google.com) to IP addresses.\n- **TCP vs UDP**: TCP is reliable and ordered (used for web, email); UDP is faster but lossy (used for video streaming, gaming).\n- **Router**: Directs traffic between different networks. **Switch**: Connects devices within the same network.\n- **Firewall**: Monitors and controls incoming/outgoing network traffic based on security rules.\n- **Subnet**: A logical division of an IP network to improve performance and security.\n- **Bandwidth**: Maximum data transfer rate. **Latency**: Delay in data transmission. **Ping**: Round-trip time to a server."
  },
  {
    id: "it_cybersecurity",
    topic: "Cybersecurity Essentials",
    category: "IT",
    keywords: [
      "cybersecurity",
      "security",
      "password",
      "phishing",
      "malware",
      "ransomware",
      "vpn",
      "encryption",
      "2fa",
      "two factor",
      "hack",
      "vulnerability",
      "firewall"
    ],
    content: "**Cybersecurity Essentials**\n\n- **Strong Passwords**: Use 12+ characters with upper/lowercase, numbers, symbols. Use a password manager.\n- **2FA (Two-Factor Authentication)**: Adds a second verification step — strongly recommended for all accounts.\n- **Phishing**: Fraudulent emails/messages that trick you into revealing credentials. Never click suspicious links.\n- **Malware**: Malicious software including viruses, ransomware, spyware. Use antivirus and keep software updated.\n- **VPN (Virtual Private Network)**: Encrypts your internet traffic and masks your IP address.\n- **Encryption**: Converts data into unreadable format without a decryption key. HTTPS encrypts web traffic.\n- **Principle of Least Privilege**: Give users/apps only the minimum permissions they need.\n- **Software Updates**: Patch known vulnerabilities — always keep OS and apps updated."
  },
  {
    id: "it_cloud_computing",
    topic: "Cloud Computing",
    category: "IT",
    keywords: [
      "cloud",
      "aws",
      "azure",
      "google cloud",
      "saas",
      "paas",
      "iaas",
      "server",
      "hosting",
      "kubernetes",
      "docker",
      "microservices",
      "serverless"
    ],
    content: "**Cloud Computing**\n\n- **IaaS (Infrastructure as a Service)**: Rent virtual machines and storage (e.g., AWS EC2, Azure VMs).\n- **PaaS (Platform as a Service)**: Managed platform for developers to deploy apps without managing servers.\n- **SaaS (Software as a Service)**: Ready-to-use software over the internet (e.g., Gmail, Salesforce).\n- **Docker**: Containerization technology that packages apps with their dependencies.\n- **Kubernetes**: Orchestrates and manages Docker containers at scale.\n- **Serverless**: Run functions without managing servers — pay only for execution time.\n- **CDN (Content Delivery Network)**: Distributes content from servers closest to users for faster delivery.\n- **Major providers**: AWS (Amazon), Azure (Microsoft), GCP (Google)."
  },
  {
    id: "it_databases",
    topic: "Databases",
    category: "IT",
    keywords: [
      "database",
      "sql",
      "nosql",
      "mysql",
      "postgresql",
      "mongodb",
      "redis",
      "query",
      "index",
      "table",
      "schema"
    ],
    content: "**Databases**\n\n- **SQL (Relational)**: Structured data in tables with relationships. Examples: MySQL, PostgreSQL, SQLite.\n- **NoSQL**: Flexible schema for unstructured/semi-structured data. Examples: MongoDB (documents), Redis (key-value), Cassandra (wide-column).\n- **Primary Key**: Unique identifier for each row in a table.\n- **Index**: Speeds up queries but uses extra storage.\n- **ACID Properties**: Atomicity, Consistency, Isolation, Durability — guarantees for reliable transactions.\n- **JOIN**: Combines rows from two or more tables based on a related column.\n- **When to use SQL**: Structured data, complex queries, financial records.\n- **When to use NoSQL**: Large-scale, flexible data, real-time apps, unstructured content."
  },
  {
    id: "it_programming_tips",
    topic: "Programming Best Practices",
    category: "IT",
    keywords: [
      "programming",
      "coding",
      "code",
      "debug",
      "refactor",
      "git",
      "version control",
      "api",
      "rest",
      "testing",
      "agile",
      "scrum"
    ],
    content: `**Programming Best Practices**

- **DRY (Don't Repeat Yourself)**: Avoid duplicating code — reuse functions and modules.
- **SOLID Principles**: Five design principles for maintainable OOP code.
- **Version Control (Git)**: Track changes, collaborate, and revert mistakes. Use meaningful commit messages.
- **Code Review**: Have others review your code to catch bugs and improve quality.
- **Testing**: Write unit tests, integration tests, and end-to-end tests. Test early, test often.
- **REST API**: Standard for web APIs using HTTP methods (GET, POST, PUT, DELETE).
- **Agile/Scrum**: Iterative development in sprints (1-2 weeks) with daily standups and regular reviews.
- **Debugging**: Use console logs, breakpoints, and error messages. Reproduce the bug before fixing it.`
  },
  {
    id: "it_os_shortcuts",
    topic: "Keyboard Shortcuts",
    category: "IT",
    keywords: [
      "shortcut",
      "keyboard",
      "hotkey",
      "ctrl",
      "command",
      "copy",
      "paste",
      "undo",
      "redo",
      "windows",
      "mac"
    ],
    content: "**Essential Keyboard Shortcuts**\n\n**Universal:**\n- Ctrl+C / Cmd+C = Copy\n- Ctrl+V / Cmd+V = Paste\n- Ctrl+Z / Cmd+Z = Undo\n- Ctrl+Y / Cmd+Y = Redo\n- Ctrl+S / Cmd+S = Save\n- Ctrl+F / Cmd+F = Find\n- Ctrl+A / Cmd+A = Select All\n- Alt+Tab / Cmd+Tab = Switch Apps\n\n**Windows Specific:**\n- Win+D = Show Desktop\n- Win+L = Lock Screen\n- Win+E = File Explorer\n- Win+Print Screen = Screenshot\n\n**Mac Specific:**\n- Cmd+Space = Spotlight Search\n- Cmd+Shift+4 = Screenshot area\n- Cmd+Option+Esc = Force Quit"
  },
  // ======= Finance =======
  {
    id: "finance_budgeting",
    topic: "Budgeting",
    category: "Finance",
    keywords: [
      "budget",
      "budgeting",
      "50/30/20",
      "expense",
      "spending",
      "income",
      "saving",
      "monthly",
      "plan",
      "allocate"
    ],
    content: "**Budgeting Fundamentals**\n\n- **50/30/20 Rule**: Allocate 50% of income to needs (rent, food), 30% to wants (entertainment), 20% to savings/debt.\n- **Zero-Based Budget**: Assign every rupee/dollar a purpose so income minus expenses = 0.\n- **Pay Yourself First**: Transfer savings before spending on discretionary items.\n- **Track Every Expense**: Awareness is the first step — use apps or spreadsheets.\n- **Emergency Fund**: Keep 3-6 months of expenses in liquid savings before investing.\n- **Review Monthly**: Compare actual spending vs. budget and adjust.\n- **Avoid Lifestyle Inflation**: As income grows, increase savings rate before spending more."
  },
  {
    id: "finance_investing",
    topic: "Investing Basics",
    category: "Finance",
    keywords: [
      "invest",
      "investing",
      "stock",
      "mutual fund",
      "sip",
      "equity",
      "bond",
      "portfolio",
      "return",
      "risk",
      "dividend",
      "index fund",
      "nifty",
      "sensex"
    ],
    content: "**Investing Basics**\n\n- **Compound Interest**: Earning returns on your returns — the earlier you start, the more powerful it is.\n- **Equity (Stocks)**: Ownership in a company. Higher risk, higher potential return.\n- **Mutual Funds**: Pool money with other investors; managed by professionals. Good for beginners.\n- **SIP (Systematic Investment Plan)**: Invest a fixed amount monthly in mutual funds — reduces timing risk.\n- **Index Funds**: Track a market index (Nifty 50, S&P 500). Low cost, good long-term returns.\n- **Bonds**: Loans to companies/governments. Lower risk, lower return than stocks.\n- **Diversification**: Spread investments across asset classes to reduce risk.\n- **Rule of 72**: Divide 72 by annual return rate to estimate how many years to double your money."
  },
  {
    id: "finance_tax",
    topic: "Tax Basics",
    category: "Finance",
    keywords: [
      "tax",
      "income tax",
      "itr",
      "deduction",
      "section 80c",
      "gst",
      "tds",
      "hra",
      "taxable",
      "filing",
      "return"
    ],
    content: "**Tax Basics (India)**\n\n- **Income Tax Slabs (New Regime 2024-25)**: 0% up to ₹3L, 5% (₹3-7L), 10% (₹7-10L), 15% (₹10-12L), 20% (₹12-15L), 30% above ₹15L.\n- **Section 80C**: Deductions up to ₹1.5L for PPF, ELSS, LIC, EPF, home loan principal (Old Regime).\n- **HRA**: House Rent Allowance — deductible if you pay rent and receive HRA from employer.\n- **TDS**: Tax Deducted at Source — deducted by payer before paying you (salary, interest, etc.).\n- **ITR Filing Deadline**: Usually July 31st for individuals.\n- **GST**: Goods and Services Tax — applicable on most goods and services in India.\n- **Capital Gains**: Tax on profits from selling assets. Short-term (< 1 year) taxed higher than long-term."
  },
  {
    id: "finance_debt",
    topic: "Debt Management",
    category: "Finance",
    keywords: [
      "debt",
      "loan",
      "emi",
      "credit card",
      "interest rate",
      "pay off",
      "avalanche",
      "snowball",
      "borrow"
    ],
    content: "**Debt Management**\n\n- **Debt Avalanche**: Pay off highest-interest debt first — saves the most money.\n- **Debt Snowball**: Pay off smallest balance first — builds motivation with quick wins.\n- **Credit Card Debt**: Typically 24-48% annual interest — pay full balance monthly to avoid charges.\n- **EMI Calculation**: EMI = [P × r × (1+r)^n] / [(1+r)^n - 1] where P = principal, r = monthly rate, n = months.\n- **Good vs Bad Debt**: Good debt (home loan, education) builds wealth. Bad debt (consumer loans, credit cards) drains wealth.\n- **Debt-to-Income Ratio**: Total monthly debt payments ÷ gross monthly income. Keep below 36%.\n- **Prepayment**: Paying extra on loans reduces total interest significantly."
  },
  {
    id: "finance_savings",
    topic: "Savings Strategies",
    category: "Finance",
    keywords: [
      "save",
      "saving",
      "fd",
      "ppf",
      "rd",
      "liquid fund",
      "emergency fund",
      "goal",
      "interest",
      "bank"
    ],
    content: "**Savings Strategies**\n\n- **Emergency Fund**: 3-6 months of expenses in a liquid account (savings account or liquid fund).\n- **FD (Fixed Deposit)**: Safe, guaranteed return (typically 6-8% in India). Ideal for medium-term goals.\n- **PPF (Public Provident Fund)**: 15-year lock-in, tax-free returns (~7.1%), Section 80C eligible.\n- **RD (Recurring Deposit)**: Fixed monthly savings with guaranteed interest. Good for disciplined saving.\n- **Liquid Funds**: Mutual funds investing in short-term instruments — better returns than savings accounts.\n- **Goal-Based Saving**: Assign each savings pool a goal (vacation, gadget, down payment) with a target date.\n- **Automate Savings**: Set up auto-debit on salary day so you save before you can spend."
  },
  // ======= Productivity =======
  {
    id: "prod_time_management",
    topic: "Time Management",
    category: "Productivity",
    keywords: [
      "time management",
      "schedule",
      "calendar",
      "prioritize",
      "time block",
      "deadline",
      "procrastinate",
      "focus",
      "productivity"
    ],
    content: `**Time Management Techniques**

- **Time Blocking**: Assign specific time slots to tasks in your calendar. Protects focus time.
- **Eisenhower Matrix**: Classify tasks by Urgent/Important. Do urgent+important first; schedule important+not urgent; delegate urgent+not important; eliminate neither.
- **2-Minute Rule**: If a task takes less than 2 minutes, do it immediately.
- **MIT (Most Important Tasks)**: Identify 1-3 critical tasks each morning and complete them first.
- **Parkinson's Law**: Work expands to fill the time available — set tight deadlines.
- **Batching**: Group similar tasks together (e.g., all emails at once) to reduce context switching.
- **Weekly Review**: Spend 30 min each Sunday reviewing progress and planning the coming week.`
  },
  {
    id: "prod_pomodoro",
    topic: "Pomodoro Technique",
    category: "Productivity",
    keywords: [
      "pomodoro",
      "focus session",
      "break",
      "25 minutes",
      "timer",
      "deep work",
      "concentration"
    ],
    content: "**Pomodoro Technique**\n\n1. Choose a task to work on\n2. Set a timer for **25 minutes** (one Pomodoro)\n3. Work with full focus — no distractions\n4. Take a **5-minute break** when the timer rings\n5. After **4 Pomodoros**, take a longer break (15-30 minutes)\n\n**Why it works**: Creates urgency, makes large tasks less daunting, and builds in regular rest.\n\n**Tips**: Turn off notifications during sessions. Track completed Pomodoros to measure productivity. Adjust to 50/10 or 90-minute sessions if you prefer longer flow states."
  },
  {
    id: "prod_gtd",
    topic: "GTD (Getting Things Done)",
    category: "Productivity",
    keywords: [
      "gtd",
      "getting things done",
      "inbox",
      "next action",
      "project",
      "capture",
      "organize",
      "review"
    ],
    content: "**Getting Things Done (GTD) by David Allen**\n\n5 Steps:\n1. **Capture**: Write down everything on your mind — tasks, ideas, worries.\n2. **Clarify**: For each item, decide: Is it actionable? What is the next physical action?\n3. **Organize**: Put items in the right list (Next Actions, Projects, Waiting For, Someday/Maybe).\n4. **Reflect**: Weekly review of all lists to stay current and clear.\n5. **Engage**: Simply work from your Next Actions list.\n\n**Key concept**: A trusted system outside your head frees mental RAM for actual thinking.\n**Project**: Any outcome requiring more than one action step."
  },
  {
    id: "prod_deep_work",
    topic: "Deep Work",
    category: "Productivity",
    keywords: [
      "deep work",
      "focus",
      "distraction",
      "flow",
      "concentration",
      "shallow work",
      "notification",
      "cal newport"
    ],
    content: `**Deep Work (Cal Newport)**

- **Deep Work**: Cognitively demanding tasks performed in a state of distraction-free concentration.
- **Shallow Work**: Non-cognitively demanding tasks (emails, meetings) — easy to replicate and low value.

**Strategies:**
- **Monastic**: Total isolation — eliminate all shallow work.
- **Bimodal**: Deep work for full days/weeks; normal schedule otherwise.
- **Rhythmic**: Daily deep work blocks (e.g., 6-9am every day).
- **Journalistic**: Fit deep work whenever you can (best for busy people).

**Tips**: Schedule deep work blocks. Embrace boredom (don't reach for phone). Quit social media or use intentionally. Track hours of deep work weekly.`
  },
  {
    id: "prod_habits",
    topic: "Habit Building",
    category: "Productivity",
    keywords: [
      "habit",
      "routine",
      "streak",
      "atomic habits",
      "cue",
      "reward",
      "trigger",
      "morning routine",
      "consistency"
    ],
    content: `**Habit Building (Atomic Habits by James Clear)**

**The 4 Laws of Behavior Change:**
1. **Make it Obvious** (Cue): Place reminders where you'll see them.
2. **Make it Attractive** (Craving): Pair habits with things you enjoy.
3. **Make it Easy** (Response): Reduce friction — prepare the night before.
4. **Make it Satisfying** (Reward): Celebrate small wins immediately.

**Key concepts:**
- **1% Better Daily**: Small improvements compound to 37x better in a year.
- **Identity-Based Habits**: Focus on who you want to become, not what you want to achieve.
- **Habit Stacking**: Chain new habits to existing ones ("After I [existing habit], I will [new habit]").
- **Never miss twice**: Missing once is an accident; missing twice starts a new habit of not doing it.`
  },
  {
    id: "prod_note_taking",
    topic: "Note-Taking Systems",
    category: "Productivity",
    keywords: [
      "notes",
      "note taking",
      "zettelkasten",
      "second brain",
      "cornell",
      "mind map",
      "capture",
      "knowledge management"
    ],
    content: `**Note-Taking Systems**

- **Cornell Method**: Divide page into notes (right), cues/questions (left), summary (bottom). Good for lectures.
- **Zettelkasten**: Create atomic notes linked to each other. Builds a personal knowledge graph over time.
- **Second Brain (PARA)**: Organize notes by Projects, Areas, Resources, Archives.
- **Mind Mapping**: Visual notes branching from a central topic. Great for brainstorming.
- **Outline Method**: Hierarchical bullet points. Simple and fast.

**Best Practices:**
- Write in your own words — don't just copy.
- Review notes within 24 hours to retain 80%+ of content.
- Tag and link notes for future discoverability.
- Keep an inbox for unprocessed captures.`
  }
];
function searchBuiltinKnowledge(query) {
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/).filter((w) => w.length > 2);
  const scored = BUILTIN_KNOWLEDGE.map((entry) => {
    let score = 0;
    if (entry.topic.toLowerCase().includes(lowerQuery)) score += 10;
    for (const kw of entry.keywords) {
      if (lowerQuery.includes(kw)) score += 5;
      for (const word of words) {
        if (kw.includes(word)) score += 2;
      }
    }
    if (entry.content.toLowerCase().includes(lowerQuery)) score += 3;
    for (const word of words) {
      if (entry.content.toLowerCase().includes(word)) score += 1;
    }
    return { entry, score };
  });
  return scored.filter((r) => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map((r) => r.entry);
}
const knowledgeOpeners = [
  "Here's what I know about that —",
  "Good question.",
  "Let me break that down —",
  "Sure, here's the rundown:",
  "Here's the short version:",
  "Glad you asked —",
  "Here's a solid overview:",
  "Let me walk you through it:",
  "Right, so here's the deal:"
];
const taskConfirmations = {
  task: [
    "Done! That's on your task list now.",
    "Got it — task saved.",
    "Added to your tasks. You're on it.",
    "Saved to your tasks. I'll keep track.",
    "Task locked in. Nothing slipping through the cracks."
  ],
  note: [
    "Saved that note for you.",
    "Note captured.",
    "I've got that noted.",
    "Noted and stored.",
    "That's saved in your Notes — easy to find later."
  ],
  finance: [
    "Logged it to your finances.",
    "Entry recorded.",
    "Finance entry saved.",
    "Got it — added to the Finance Tracker.",
    "Recorded. Your finances are up to date."
  ]
};
const fallbackResponses = [
  (msg) => `That's a good one — I don't have specific info on "${msg.slice(0, 40)}" yet, but you can teach me by going to the Knowledge section.`,
  () => "Hmm, I'm still learning that area. Try adding a source in Knowledge and I'll be able to help next time.",
  () => "I don't have a built-in answer for that just yet. Head to the Knowledge section to add sources — then I can give you a real answer.",
  () => "Good question, but I'm drawing a blank on that one. Add it to my Knowledge base and I'll be much more useful next time you ask!"
];
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function wrapResponse(rawAnswer, tone) {
  {
    const opener = pick(knowledgeOpeners);
    const separator = opener.endsWith("—") || opener.endsWith(":") ? "\n\n" : " ";
    return `${opener}${separator}${rawAnswer}`;
  }
}
function randomTaskConfirm(type, detail) {
  const base = pick(taskConfirmations[type]);
  if (!detail) return base;
  return `${base} (${detail})`;
}
function smartFallback(message) {
  const fn = pick(fallbackResponses);
  return fn(message);
}
const greetingReplies = [
  (name) => name ? `Hey ${name}! Good to hear from you. What can I do for you today?` : "Hey! Good to hear from you. What can I do for you today?",
  (name) => name ? `Hello, ${name}! I'm all yours — what's on your mind?` : "Hello! I'm all yours — what's on your mind?",
  (name) => name ? `Hi ${name}! Ready when you are. What do you need?` : "Hi! Ready when you are. What do you need?",
  (name) => name ? `Hey ${name}, what's up? I'm here to help.` : "Hey, what's up? I'm here to help."
];
function randomGreeting(name) {
  return pick(greetingReplies)(name);
}
function buildConversationContext(messages) {
  const recent = messages.slice(-20);
  if (recent.length === 0) return "";
  return recent.map(
    (m) => `${m.role === "user" ? "User" : "DJ"}: ${m.content.slice(0, 600)}`
  ).join("\n");
}
function generateResponse(userMessage, deps) {
  var _a;
  const {
    memories,
    contextEngine,
    conversationHistory,
    activeTopicRef
  } = deps;
  const lowerMessage = userMessage.toLowerCase();
  const knowledgeSources = memories.map(parseKnowledgeSource).filter((s) => s !== null);
  const regularMemories = memories.filter(
    (m) => !m.content.startsWith("[KNOWLEDGE_SOURCE]")
  );
  buildConversationContext(conversationHistory);
  buildContextPrompt(contextEngine);
  const mathMatch = userMessage.trim().match(/^[\d\s\+\-\*\/\(\)\.%^]+$/);
  if (mathMatch) {
    try {
      const expr = userMessage.trim().replace(/\^/g, "**");
      if (/^[\d\s\+\-\*\/\(\)\.%\*]+$/.test(expr)) {
        const result = Function(`"use strict"; return (${expr})`)();
        if (typeof result === "number" && Number.isFinite(result)) {
          return `${userMessage.trim()} = **${result}**`;
        }
      }
    } catch {
    }
  }
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|sup|what'?s up|yo)\b/i.test(
    lowerMessage
  ) && lowerMessage.length < 30) {
    const name = (_a = contextEngine == null ? void 0 : contextEngine.userPreferences) == null ? void 0 : _a.name;
    return randomGreeting(name);
  }
  if (lowerMessage.includes("what do you know about me") || lowerMessage.includes("what do you remember") || lowerMessage.includes("tell me about myself")) {
    const profileMemories = regularMemories.filter((m) => !m.content.startsWith("MEMORY_GRAPH:")).slice(0, 5);
    if (profileMemories.length > 0) {
      return `Here's what I know about you:
${profileMemories.map((m) => `• ${m.content}`).join("\n")}`;
    }
    return "I don't know much about you yet. Tell me something and I'll remember it!";
  }
  if (knowledgeSources.length > 0) {
    const results = searchKnowledgeSources(knowledgeSources, userMessage);
    if (results.length > 0) {
      const top = results[0];
      activeTopicRef.current = top.title;
      const context = getRelevantContext(top.content, userMessage);
      if (context) {
        return wrapResponse(
          `From **${top.title}**:

${context}`
        );
      }
      return wrapResponse(
        `I found a relevant source: **${top.title}**. ${top.summary}`
      );
    }
  }
  const builtinResult = searchBuiltinKnowledge(userMessage);
  if (builtinResult) {
    const topEntry = builtinResult[0];
    if (topEntry) {
      return wrapResponse(topEntry.content.slice(0, 600));
    }
  }
  return smartFallback(userMessage);
}
function todayMs() {
  const d = /* @__PURE__ */ new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function formatCurrency(cents) {
  return `₹${Math.abs(cents / 100).toFixed(2)}`;
}
function getMorningRoutine(tasks, financeEntries) {
  const now = /* @__PURE__ */ new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = todayMs();
  const todayEnd = today + 864e5;
  const pendingTasks = tasks.filter((t) => !t.completed);
  const todayTasks = pendingTasks.filter((t) => {
    if (!t.deadline) return false;
    const ms = Number(t.deadline) / 1e6;
    return ms >= today && ms < todayEnd;
  });
  const overdueTasks = pendingTasks.filter((t) => {
    if (!t.deadline) return false;
    return Number(t.deadline) / 1e6 < today;
  });
  const highPriority = pendingTasks.filter((t) => t.priority === "High");
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEntries = financeEntries.filter(
    (e) => Number(e.entryDate) / 1e6 >= monthStart
  );
  const income = monthEntries.filter((e) => Number(e.amount) > 0).reduce((s, e) => s + Number(e.amount), 0) / 100;
  const expenses = monthEntries.filter((e) => Number(e.amount) < 0).reduce((s, e) => s + Math.abs(Number(e.amount)), 0) / 100;
  const lines = [];
  lines.push(`${greeting}! Here's your daily briefing.`);
  lines.push("");
  lines.push("📋 **Tasks**");
  if (overdueTasks.length > 0) {
    lines.push(
      `⚠ ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? "s" : ""}`
    );
  }
  if (todayTasks.length > 0) {
    lines.push(`Today: ${todayTasks.map((t) => t.title).join(", ")}`);
  } else if (pendingTasks.length > 0) {
    lines.push(
      `${pendingTasks.length} pending task${pendingTasks.length > 1 ? "s" : ""}`
    );
  } else {
    lines.push("No pending tasks — great work!");
  }
  if (highPriority.length > 0) {
    lines.push(
      `🔴 High priority: ${highPriority.slice(0, 3).map((t) => t.title).join(", ")}`
    );
  }
  lines.push("");
  lines.push("💰 **Finance (this month)**");
  lines.push(
    `Income: ${formatCurrency(income * 100)} | Expenses: ${formatCurrency(expenses * 100)} | Balance: ${formatCurrency((income - expenses) * 100)}`
  );
  lines.push("");
  lines.push("Have a productive day!");
  return lines.join("\n");
}
function getWorkModeRoutine(tasks) {
  const pending = tasks.filter((t) => !t.completed);
  const high = pending.filter((t) => t.priority === "High");
  const medium = pending.filter((t) => t.priority === "Medium");
  const overdue = pending.filter(
    (t) => t.deadline && Number(t.deadline) / 1e6 < Date.now()
  );
  const lines = [];
  lines.push("🎯 **Work Mode — Focus Session**");
  lines.push("");
  if (overdue.length > 0) {
    lines.push("⚠ Overdue (address first):");
    for (const t of overdue.slice(0, 3)) lines.push(`  • ${t.title}`);
  }
  if (high.length > 0) {
    lines.push("🔴 High priority:");
    for (const t of high.slice(0, 3)) lines.push(`  • ${t.title}`);
  }
  if (medium.length > 0) {
    lines.push("🟡 Medium priority:");
    for (const t of medium.slice(0, 3)) lines.push(`  • ${t.title}`);
  }
  if (pending.length === 0) {
    lines.push("No pending tasks. You're all clear!");
  }
  lines.push("");
  lines.push(`Total pending: ${pending.length} tasks`);
  return lines.join("\n");
}
function getEveningRoutine(tasks, financeEntries) {
  const today = todayMs();
  const todayEnd = today + 864e5;
  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const todayExpenses = financeEntries.filter(
    (e) => Number(e.entryDate) / 1e6 >= today && Number(e.entryDate) / 1e6 < todayEnd && Number(e.amount) < 0
  );
  const totalSpentToday = todayExpenses.reduce((s, e) => s + Math.abs(Number(e.amount)), 0) / 100;
  const lines = [];
  lines.push("🌙 **End-of-Day Review**");
  lines.push("");
  lines.push(`✅ **Completed tasks:** ${completedTasks.length}`);
  if (completedTasks.length > 0) {
    for (const t of completedTasks.slice(0, 5)) lines.push(`  • ${t.title}`);
  }
  lines.push("");
  lines.push(`📋 **Still pending:** ${pendingTasks.length}`);
  if (pendingTasks.length > 0) {
    for (const t of pendingTasks.slice(0, 3)) lines.push(`  • ${t.title}`);
  }
  lines.push("");
  lines.push(
    `💸 **Today's expenses:** ${formatCurrency(totalSpentToday * 100)}`
  );
  if (todayExpenses.length > 0) {
    for (const e of todayExpenses.slice(0, 3)) {
      lines.push(
        `  • ${e.description}: ${formatCurrency(Math.abs(Number(e.amount)))}`
      );
    }
  }
  lines.push("");
  lines.push("Good work today. Rest well!");
  return lines.join("\n");
}
function detectRoutineMode(message) {
  const lower = message.toLowerCase();
  if (lower.includes("morning") || lower.includes("briefing") || lower.includes("daily briefing"))
    return "morning";
  if (lower.includes("work") || lower.includes("focus")) return "work";
  if (lower.includes("evening") || lower.includes("end of day") || lower.includes("review my day"))
    return "evening";
  const hour = (/* @__PURE__ */ new Date()).getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "work";
  return "evening";
}
const DailyRoutineSkill = {
  name: "dailyRoutine",
  description: "Handles morning routines, work mode, and end-of-day reviews",
  intents: ["DAILY_ROUTINE"],
  async handle(decision, context) {
    const { queryClient } = context;
    const tasks = queryClient.getQueryData(["tasks"]) ?? [];
    const financeEntries = queryClient.getQueryData(["financeEntries"]) ?? [];
    const rawMessage = decision.action === "DAILY_ROUTINE" ? decision.rawMessage : "";
    const mode = detectRoutineMode(rawMessage);
    let message;
    if (mode === "morning") {
      message = getMorningRoutine(tasks, financeEntries);
    } else if (mode === "work") {
      message = getWorkModeRoutine(tasks);
    } else {
      message = getEveningRoutine(tasks, financeEntries);
    }
    return { success: true, message };
  }
};
const PATTERN_KEY = "dj_command_patterns";
function trackCommandPattern(type) {
  const data = JSON.parse(
    localStorage.getItem(PATTERN_KEY) || "{}"
  );
  const entry = data[type] || { count: 0, suggested: false };
  data[type] = {
    count: entry.count + 1,
    lastSeen: Date.now(),
    suggested: entry.suggested
  };
  localStorage.setItem(PATTERN_KEY, JSON.stringify(data));
}
function getSuggestedRules() {
  const data = JSON.parse(
    localStorage.getItem(PATTERN_KEY) || "{}"
  );
  return Object.entries(data).filter(([, v]) => v.count >= 3 && !v.suggested).map(([k]) => k);
}
function markRuleSuggested(type) {
  const data = JSON.parse(
    localStorage.getItem(PATTERN_KEY) || "{}"
  );
  if (data[type]) data[type].suggested = true;
  localStorage.setItem(PATTERN_KEY, JSON.stringify(data));
}
function getPatternRuleText(type) {
  const rules = {
    expense: {
      trigger: "add expense",
      action: "Log to Finance Tracker automatically"
    },
    reminder: {
      trigger: "remind me",
      action: "Create task with deadline automatically"
    },
    note: { trigger: "note:", action: "Save to Notes automatically" },
    task: { trigger: "add task", action: "Create task automatically" }
  };
  return rules[type] || { trigger: type, action: "Handle automatically" };
}
const FinanceSkill = {
  name: "finance",
  description: "Records income and expense entries via natural language commands",
  intents: ["ADD_FINANCE"],
  async handle(decision, context) {
    if (decision.action !== "ADD_FINANCE") {
      return { success: false, message: "Invalid decision for FinanceSkill." };
    }
    const { actor, queryClient } = context;
    const { amount, amountStr, description, category, isIncome } = decision;
    try {
      if (!actor) throw new Error("Actor not available");
      await actor.addFinanceEntry(
        isIncome ? BigInt(amount) : BigInt(-amount),
        category,
        description,
        BigInt(Date.now()) * BigInt(1e6)
      );
      queryClient.invalidateQueries({ queryKey: ["financeEntries"] });
      trackCommandPattern("expense");
      const sign = isIncome ? "+" : "-";
      const formatted = `${sign}₹${Number.parseFloat(amountStr).toFixed(2)} for ${description}`;
      return {
        success: true,
        message: `${randomTaskConfirm("finance", formatted)} View details in the Finance Tracker.`
      };
    } catch {
      const sign = isIncome ? "+" : "-";
      return {
        success: false,
        message: `I understood you want to record: **${sign}₹${Number.parseFloat(amountStr).toFixed(2)}** for **${description}**. However I couldn't save it right now.`
      };
    }
  }
};
const KnowledgeSkill = {
  name: "knowledge",
  description: "Searches and synthesizes knowledge from saved and built-in sources",
  intents: ["SEARCH_KNOWLEDGE", "SYNTHESIZE_KNOWLEDGE"],
  async handle(decision, context) {
    if (decision.action !== "SEARCH_KNOWLEDGE" && decision.action !== "SYNTHESIZE_KNOWLEDGE") {
      return {
        success: false,
        message: "Invalid decision for KnowledgeSkill."
      };
    }
    const { memories } = context;
    const { query } = decision;
    const knowledgeSources = memories.map(parseKnowledgeSource).filter((s) => s !== null);
    const userResults = searchKnowledgeSources(
      knowledgeSources,
      query
    );
    const builtinHits = searchBuiltinKnowledge(query);
    if (decision.action === "SEARCH_KNOWLEDGE") {
      if (userResults.length === 0 && builtinHits.length === 0) {
        return {
          success: false,
          message: `I don't have any knowledge sources matching "${query}". You can add some at the Knowledge page, or ask me directly about IT, Finance, or Productivity topics.`
        };
      }
      let response = `Here's what I found for **"${query}"**:

`;
      if (userResults.length > 0) {
        response += "**From your saved knowledge:**\n";
        response += userResults.slice(0, 3).map(
          (s) => `- **${s.title}** (${s.sourceType}): ${s.content.slice(0, 200)}...`
        ).join("\n");
        response += "\n\n";
      }
      if (builtinHits.length > 0) {
        response += "**From DJ's built-in knowledge:**\n";
        response += builtinHits.map(
          (b) => `**${b.topic}** (${b.category})
${b.content.slice(0, 400)}`
        ).join("\n\n");
      }
      return { success: true, message: response };
    }
    if (userResults.length === 0 && builtinHits.length === 0) {
      return {
        success: false,
        message: `I searched all sources but found nothing specifically about "${query}". Try saving relevant knowledge at the Knowledge page.`
      };
    }
    const total = userResults.length + builtinHits.length;
    let synthesis = `**Comprehensive answer on "${query}"** (synthesized from ${total} source${total !== 1 ? "s" : ""}):

`;
    if (builtinHits.length > 0) {
      synthesis += `**Built-in Knowledge:**
${builtinHits.map((b) => `*${b.topic}*: ${b.content.slice(0, 350)}`).join("\n\n")}

`;
    }
    if (userResults.length > 0) {
      synthesis += `**Your Saved Sources:**
${userResults.slice(0, 3).map((s) => `*${s.title}*: ${s.content.slice(0, 300)}`).join("\n\n")}`;
    }
    return { success: true, message: synthesis };
  }
};
const NotesSkill = {
  name: "notes",
  description: "Saves notes via natural language commands",
  intents: ["ADD_NOTE"],
  async handle(decision, context) {
    if (decision.action !== "ADD_NOTE") {
      return { success: false, message: "Invalid decision for NotesSkill." };
    }
    const { actor, queryClient } = context;
    const { noteTitle, noteContent } = decision;
    try {
      if (!actor) throw new Error("Actor not available");
      await actor.addNote(
        noteTitle,
        noteContent,
        noteContent.slice(0, 100),
        []
      );
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      trackCommandPattern("note");
      const shortNote = noteContent.slice(0, 60) + (noteContent.length > 60 ? "..." : "");
      return {
        success: true,
        message: `${randomTaskConfirm("note", shortNote)} Find it in your Notes section.`
      };
    } catch {
      return {
        success: false,
        message: "I understood you want to save this note. However I couldn't save it right now — please try again or add it directly in the Notes section."
      };
    }
  }
};
function convertPlanStepToTask(step, plan) {
  const msg = `I'll convert **"${step.description}"** from your plan *${plan.goal}* into a task.

Would you like to set a due date or priority?
• Reply **"set due date [date]"** to add a deadline
• Reply **"set priority high/medium/low"** to set priority
• Reply **"skip"** to use defaults (priority: medium, no due date)`;
  return {
    message: msg,
    stepDescription: step.description,
    planGoal: plan.goal
  };
}
async function createPlan(goal, actor) {
  const plan = generatePlanFromGoal(goal);
  await savePlan(plan, actor);
  return plan;
}
function detectPlanIntent(message) {
  const lower = message.toLowerCase();
  if (lower.includes("create a plan") || lower.includes("plan for") || lower.match(
    /^(dj,?\s*)?(i want to|my goal is|i plan to|i want to improve)\s+/
  )) {
    return "create_plan";
  }
  if (lower.includes("show my plans") || lower.includes("show plans") || lower.includes("list plans") || lower.includes("my plans")) {
    return "show_plans";
  }
  if (lower.includes("complete step") || lower.includes("mark step") || lower.includes("finish step")) {
    return "complete_plan_step";
  }
  if (lower.includes("convert step") || lower.includes("convert to task") || lower.includes("step to task")) {
    return "convert_step_to_task";
  }
  return null;
}
function extractGoalFromMessage(message) {
  const planForMatch = message.match(
    /(?:create\s+a?\s*plan\s+for|plan\s+for)\s+(.+)/i
  );
  if (planForMatch) return planForMatch[1].trim();
  const wantToMatch = message.match(/i\s+want\s+to\s+(.+)/i);
  if (wantToMatch) return wantToMatch[1].trim();
  const goalIsMatch = message.match(/my\s+goal\s+is\s+(?:to\s+)?(.+)/i);
  if (goalIsMatch) return goalIsMatch[1].trim();
  const planToMatch = message.match(/i\s+plan\s+to\s+(.+)/i);
  if (planToMatch) return planToMatch[1].trim();
  const improveMatch = message.match(/i\s+want\s+to\s+improve\s+(.+)/i);
  if (improveMatch) return improveMatch[1].trim();
  return message.replace(
    /^(dj,?\s*)?(create\s+a?\s*plan\s*(for)?|plan\s+for|set\s+up\s+a\s+plan)\s*/i,
    ""
  ).trim() || message;
}
const PlannerSkill = {
  name: "planner",
  description: "Converts goals into actionable step-by-step plans",
  intents: ["CREATE_PLAN", "SHOW_PLANS"],
  async handle(decision, context) {
    const { actor } = context;
    const rawMessage = decision.rawMessage ?? "";
    const planIntent = detectPlanIntent(rawMessage);
    if (!planIntent) {
      return {
        success: false,
        message: "I didn't understand that plan request."
      };
    }
    switch (planIntent) {
      case "create_plan": {
        const goal = extractGoalFromMessage(rawMessage);
        if (!goal || goal.length < 3) {
          return {
            success: false,
            message: 'What goal would you like me to plan? For example: *"Create a plan for learning networking"*'
          };
        }
        try {
          const plan = await createPlan(goal, actor);
          const stepList = plan.steps.map((s, i) => `${i + 1}. ${s.description}`).join("\n");
          return {
            success: true,
            message: `Done! I've created a plan for **"${goal}"** with ${plan.steps.length} steps:

${stepList}

You can view and manage your plans on the **/plans** page. Would you like to convert any of these steps into tasks?`,
            data: plan
          };
        } catch {
          return {
            success: false,
            message: "I couldn't save your plan right now. Please try again or visit the Plans page."
          };
        }
      }
      case "show_plans": {
        try {
          const plans = await getPlans(actor);
          if (plans.length === 0) {
            return {
              success: true,
              message: `You don't have any plans yet. Say *"Create a plan for [your goal]"* to get started, or visit the **/plans** page.`
            };
          }
          const planList = plans.map((p) => {
            const done = p.steps.filter((s) => s.status === "done").length;
            return `• **${p.goal}** (${p.status}) — ${done}/${p.steps.length} steps done`;
          }).join("\n");
          return {
            success: true,
            message: `Here are your plans:

${planList}

Visit **/plans** to manage them in detail.`,
            data: plans
          };
        } catch {
          return {
            success: false,
            message: "I couldn't fetch your plans right now. Please try again."
          };
        }
      }
      case "complete_plan_step": {
        return {
          success: true,
          message: `To complete a step, visit the **/plans** page and click "Mark Complete" next to the step. You can also say *"Show my plans"* to see what's pending.`
        };
      }
      case "convert_step_to_task": {
        try {
          const plans = await getPlans(actor);
          const active = plans.filter((p) => p.status === "active");
          if (active.length === 0) {
            return {
              success: true,
              message: `You don't have any active plans. Create one first by saying *"Create a plan for [goal]"*.`
            };
          }
          const plan = active[0];
          const nextStep = plan.steps.find((s) => s.status === "pending");
          if (!nextStep) {
            return {
              success: true,
              message: "All steps in your active plan are already completed! 🎉"
            };
          }
          const result = convertPlanStepToTask(nextStep, plan);
          return { success: true, message: result.message };
        } catch {
          return {
            success: false,
            message: "Couldn't process that right now. Please try again."
          };
        }
      }
      default:
        return {
          success: false,
          message: "I'm not sure how to handle that plan request."
        };
    }
  }
};
const TasksSkill = {
  name: "tasks",
  description: "Creates tasks and reminders via natural language commands",
  intents: ["ADD_TASK"],
  async handle(decision, context) {
    if (decision.action !== "ADD_TASK") {
      return { success: false, message: "Invalid decision for TasksSkill." };
    }
    const { actor, queryClient } = context;
    const { taskTitle, deadlineMs, alreadyPassedToday, timeRaw } = decision;
    if (!taskTitle) {
      return {
        success: false,
        message: "I didn't catch the task title — what would you like to add?"
      };
    }
    try {
      if (!actor) throw new Error("Actor not available");
      await actor.addTask(
        taskTitle,
        timeRaw ? `Scheduled: ${timeRaw}` : "",
        deadlineMs,
        "medium"
      );
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      trackCommandPattern("task");
      const deadlineStr = deadlineMs ? ` at ${new Date(Number(deadlineMs) / 1e6).toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )}` : "";
      const passedNote = alreadyPassedToday ? "\n\n*(Note: this time has already passed today — reminder saved for reference.)*" : "";
      return {
        success: true,
        message: `${randomTaskConfirm("task", `${taskTitle}${deadlineStr}`)} View or edit it in the Tasks section.${passedNote}`
      };
    } catch {
      return {
        success: false,
        message: `I understood you want to add a task: **${taskTitle}**. However I couldn't save it right now — please try again or add it directly in the Tasks section.`
      };
    }
  }
};
const skills = [
  TasksSkill,
  NotesSkill,
  FinanceSkill,
  KnowledgeSkill,
  PlannerSkill,
  DailyRoutineSkill
];
async function routeToSkill(decision, context) {
  const skill = skills.find((s) => s.intents.includes(decision.action));
  if (!skill) return null;
  return skill.handle(decision, context);
}
function createAssistantController(getDeps) {
  async function process(userMessage) {
    const deps = getDeps();
    const {
      actor,
      queryClient,
      memories,
      rules,
      personalitySettings,
      contextEngine,
      conversationHistory,
      activeTopicRef,
      addMemory,
      deleteMemory,
      createCommand,
      setBehaviorRule,
      setPersonality,
      activateModule,
      deactivateModule
    } = deps;
    const intentResult = detectIntent(userMessage);
    const intent = intentResult.intent;
    const entities = extractEntities(userMessage, intent);
    if (actor) {
      if (!isMemoryExtractionInitialized()) {
        setMemoryExtractionInitialized();
        const retroMessages = memories.filter((m) => !m.content.startsWith("MEMORY_GRAPH:")).map((m) => ({ role: "user", content: m.content }));
        for (const msg of retroMessages) {
          const extracted2 = extractMemories(msg.content);
          for (const node of extracted2) {
            deduplicateOrSave(actor, memories, node).catch(() => {
            });
          }
        }
      }
      const extracted = extractMemories(userMessage);
      for (const node of extracted) {
        deduplicateOrSave(actor, memories, node).catch(() => {
        });
      }
    }
    const decision = makeDecision(intent, entities, userMessage);
    const skillContext = {
      actor,
      queryClient,
      memories,
      contextEngine
    };
    const skillResult = await routeToSkill(decision, skillContext);
    if (skillResult !== null) {
      const memoryNodes = parseMemoryNodes(memories);
      const relevantMemories = searchRelevantMemories(memoryNodes, userMessage);
      const composed = composeReply({
        skillResult,
        decision,
        context: contextEngine,
        conversationHistory,
        relevantMemories
      });
      return composedReplyToString(composed);
    }
    switch (decision.action) {
      case "REMEMBER": {
        if (actor) {
          try {
            await addMemory(decision.content);
            return `Got it. I've remembered: "${decision.content}"${decision.content.length > 60 ? "..." : ""}`;
          } catch {
            return "I had trouble saving that memory. Please try again.";
          }
        }
        return "What would you like me to remember?";
      }
      case "FORGET": {
        if (actor) {
          const memoryNodes = parseMemoryNodes(memories);
          const target = memoryNodes.find(
            (n) => n.content.toLowerCase().includes(decision.content.toLowerCase())
          );
          if ((target == null ? void 0 : target.backendId) !== void 0) {
            try {
              await deleteMemory(target.backendId);
              return `Done. I've forgotten: "${target.content}"${target.content.length > 60 ? "..." : ""}`;
            } catch {
              return "I had trouble deleting that memory. Please try again.";
            }
          }
          return `I don't have a memory matching "${decision.content}".`;
        }
        return "What would you like me to forget?";
      }
      case "LIST_MEMORIES": {
        const memoryNodes = parseMemoryNodes(memories);
        const formatted = formatMemoriesForReply(memoryNodes.slice(0, 5));
        return formatted;
      }
      case "MEMORY_QUERY": {
        const memoryNodes = parseMemoryNodes(memories);
        const relevant = searchRelevantMemories(memoryNodes, decision.query);
        const formatted = formatMemoriesForReply(relevant);
        if (formatted) return formatted;
        return "I don't have any relevant memories about that yet. Tell me more and I'll remember it.";
      }
      case "CREATE_COMMAND": {
        if (actor) {
          try {
            await createCommand({
              name: decision.name,
              action: decision.commandAction
            });
            return `Done. I've created the command "${decision.name}" → "${decision.commandAction}".`;
          } catch {
            return "I had trouble creating that command. Please try again.";
          }
        }
        return `To create a command, say something like: 'Create command called "morning routine" that opens tasks'.`;
      }
      case "SET_RULE": {
        if (actor) {
          try {
            await setBehaviorRule({
              ruleText: decision.ruleText,
              priority: 0n
            });
            return `Understood. I'll always remember: "${decision.ruleText}".`;
          } catch {
            return "I had trouble saving that rule. Please try again.";
          }
        }
        return "What rule would you like me to follow?";
      }
      case "SET_PERSONALITY": {
        if (actor) {
          try {
            await setPersonality(decision.style);
            return `Done. I'll communicate in a ${decision.style} style from now on.`;
          } catch {
            return "I had trouble updating my personality. Please try again.";
          }
        }
        return "What communication style would you like? Options include: professional, casual, formal, friendly, concise.";
      }
      case "ACTIVATE_MODULE": {
        if (actor) {
          try {
            await activateModule(decision.moduleName);
            return `The ${decision.moduleName} module is now active.`;
          } catch {
            return `I had trouble activating ${decision.moduleName}. Please try again.`;
          }
        }
        return "Which module would you like to activate?";
      }
      case "DEACTIVATE_MODULE": {
        if (actor) {
          try {
            await deactivateModule(decision.moduleName);
            return `The ${decision.moduleName} module has been deactivated.`;
          } catch {
            return `I had trouble deactivating ${decision.moduleName}. Please try again.`;
          }
        }
        return "Which module would you like to deactivate?";
      }
      case "AUTONOMY_REVIEW": {
        window.dispatchEvent(new CustomEvent("dj-autonomy-review"));
        return "Running a full autonomy review now. I'll check your goals, plans, tasks, and knowledge and suggest what to focus on next.";
      }
      default: {
        return generateResponse(userMessage, {
          memories,
          contextEngine,
          conversationHistory,
          activeTopicRef
        });
      }
    }
  }
  return { process };
}
function selectBestVoice(voices) {
  if (voices.length === 0) return null;
  const preferred = voices.find(
    (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Microsoft") || v.name.includes("Natural") || v.name.includes("Enhanced"))
  );
  if (preferred) return preferred;
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0];
}
function MessageContent({ content }) {
  const parts = content.split("\n");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "whitespace-pre-wrap break-words text-sm leading-relaxed", children: parts.map((line, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: stable
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      line,
      i < parts.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("br", {})
    ] }, i)
  )) });
}
const MODULE_TAGS = [
  { label: "Tasks", value: "tasks", icon: SquareCheckBig },
  { label: "Finance", value: "finance", icon: DollarSign },
  { label: "Notes", value: "notes", icon: StickyNote },
  { label: "Knowledge", value: "knowledge", icon: BookOpen },
  { label: "General", value: "general", icon: MessageSquare }
];
function ChatPage() {
  var _a;
  const { actor } = useActor();
  const contextEngine = useContextEngine();
  const { setIsTyping, setIsVoiceListening } = contextEngine;
  const queryClient = useQueryClient();
  const { data: threads = [], isLoading: threadsLoading } = useChatThreads();
  const [activeThreadId, setActiveThreadId] = reactExports.useState(null);
  const [isCreating, setIsCreating] = reactExports.useState(false);
  const { data: rawMessages = [], isLoading: messagesLoading } = useThreadMessages(activeThreadId);
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [newThreadDialogOpen, setNewThreadDialogOpen] = reactExports.useState(false);
  const [newThreadName, setNewThreadName] = reactExports.useState("");
  const [deleteConfirmThreadId, setDeleteConfirmThreadId] = reactExports.useState(null);
  const { data: memories = [] } = useMemories();
  const { data: rules = [] } = useBehaviorRules();
  const { data: personalitySettings } = usePersonalitySettings();
  const addMemory = useAddMemory();
  const deleteMemory = useDeleteMemory();
  const createCommand = useCreateCustomCommand();
  const setBehaviorRule = useSetBehaviorRule();
  const setPersonality = useSetPersonalitySettings();
  const activateModule = useActivateModule();
  const deactivateModule = useDeactivateModule();
  const [input, setInput] = reactExports.useState("");
  const [isListening, setIsListening] = reactExports.useState(false);
  const [isSpeaking, setIsSpeaking] = reactExports.useState(false);
  const [continuousMode, setContinuousMode] = reactExports.useState(false);
  const [voiceEnabled, setVoiceEnabled] = reactExports.useState(true);
  const [showSuggestions, setShowSuggestions] = reactExports.useState(false);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [patternSuggestion, setPatternSuggestion] = reactExports.useState(null);
  const [optimisticMessages, setOptimisticMessages] = reactExports.useState([]);
  const messagesEndRef = reactExports.useRef(null);
  const synthRef = reactExports.useRef(null);
  const voicesRef = reactExports.useRef([]);
  const recognitionRef = reactExports.useRef(null);
  const continuousModeRef = reactExports.useRef(false);
  const ttsTimerRef = reactExports.useRef(null);
  const ttsQueueRef = reactExports.useRef([]);
  const isSpeakingRef = reactExports.useRef(false);
  const micTimeoutRef = reactExports.useRef(null);
  const drainQueueRef = reactExports.useRef(() => {
  });
  const voiceRestartCountRef = reactExports.useRef(0);
  const startVoiceInputRef = reactExports.useRef(() => {
  });
  const handleSendRef = reactExports.useRef(() => {
  });
  const isFirstLoad = reactExports.useRef(true);
  const prevMessageCount = reactExports.useRef(0);
  const persistedMessages = reactExports.useMemo(
    () => [...rawMessages].sort(
      (a, b) => a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0
    ).map((m) => ({
      id: m.id.toString(),
      role: m.role,
      content: m.content,
      timestamp: m.timestamp
    })),
    [rawMessages]
  );
  const allVisibleMessages = reactExports.useMemo(
    () => [
      ...persistedMessages,
      ...optimisticMessages.filter((opt) => {
        return !persistedMessages.some((p) => {
          if (p.content !== opt.content || p.role !== opt.role) return false;
          const persistedMs = Number(p.timestamp) / 1e6;
          return persistedMs >= Number(opt.timestamp) / 1e6 - 5e3;
        });
      })
    ].sort(
      (a, b) => a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0
    ),
    [persistedMessages, optimisticMessages]
  );
  reactExports.useEffect(() => {
    if (optimisticMessages.length === 0) return;
    const allCovered = optimisticMessages.every(
      (opt) => persistedMessages.some((p) => {
        if (p.content !== opt.content || p.role !== opt.role) return false;
        const persistedMs = Number(p.timestamp) / 1e6;
        return persistedMs >= Number(opt.timestamp) / 1e6 - 5e3;
      })
    );
    if (allCovered) setOptimisticMessages([]);
  }, [persistedMessages, optimisticMessages]);
  reactExports.useEffect(() => {
    isFirstLoad.current = true;
    prevMessageCount.current = 0;
    setOptimisticMessages([]);
  }, [activeThreadId]);
  reactExports.useEffect(() => {
    var _a2, _b;
    if (messagesLoading) return;
    if (allVisibleMessages.length === 0 && !isProcessing) return;
    if (isFirstLoad.current && !messagesLoading) {
      (_a2 = messagesEndRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "instant" });
      isFirstLoad.current = false;
      prevMessageCount.current = persistedMessages.length;
      return;
    }
    const totalNow = persistedMessages.length + optimisticMessages.length;
    if (totalNow > prevMessageCount.current || isProcessing) {
      (_b = messagesEndRef.current) == null ? void 0 : _b.scrollIntoView({ behavior: "smooth" });
      prevMessageCount.current = persistedMessages.length;
    }
  }, [
    persistedMessages.length,
    optimisticMessages.length,
    isProcessing,
    messagesLoading,
    allVisibleMessages.length
  ]);
  reactExports.useEffect(() => {
    if (persistedMessages.length >= 3 && rules.length === 0) {
      setShowSuggestions(true);
    }
  }, [persistedMessages.length, rules.length]);
  reactExports.useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      var _a2;
      (_a2 = synthRef.current) == null ? void 0 : _a2.cancel();
      if (window.speechSynthesis.onvoiceschanged === loadVoices) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);
  reactExports.useEffect(() => {
    const handler = (e) => {
      const ev = e;
      const { content, type, taskId } = ev.detail;
      if (activeThreadId === null) {
        ue(content.replace(/\*\*/g, ""), { duration: 8e3 });
        return;
      }
      const optMsg = {
        id: `proactive-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: BigInt(Date.now()) * 1000000n,
        isOptimistic: true,
        isFollowup: type === "followup",
        followupTaskId: type === "followup" ? taskId : void 0
      };
      setOptimisticMessages((prev) => [...prev, optMsg]);
      if (actor) {
        actor.saveThreadMessage(activeThreadId, "assistant", content).then(() => {
          queryClient.invalidateQueries({
            queryKey: ["threadMessages", activeThreadId.toString()]
          });
        }).catch(() => {
          setOptimisticMessages(
            (prev) => prev.map(
              (m) => m.id === optMsg.id ? { ...m, saveFailed: true } : m
            )
          );
        });
      }
    };
    window.addEventListener("dj-proactive-message", handler);
    return () => window.removeEventListener("dj-proactive-message", handler);
  }, [activeThreadId, actor, queryClient]);
  reactExports.useEffect(() => {
    const handler = (e) => {
      const ev = e;
      const command = ev.detail;
      if (command) {
        handleSendRef.current(command);
      }
    };
    window.addEventListener("dj-chat-command", handler);
    return () => window.removeEventListener("dj-chat-command", handler);
  }, []);
  reactExports.useEffect(() => {
    const handler = (e) => {
      var _a2;
      const ev = e;
      const { key, value } = ev.detail;
      if (key === "dj_continuous_listening") {
        if (value !== continuousModeRef.current) {
          continuousModeRef.current = value;
          setContinuousMode(value);
          if (value) {
            startVoiceInputRef.current();
          } else {
            (_a2 = recognitionRef.current) == null ? void 0 : _a2.abort();
            setIsListening(false);
            if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current);
          }
        }
      }
    };
    window.addEventListener("dj-settings-changed", handler);
    return () => window.removeEventListener("dj-settings-changed", handler);
  }, []);
  const memoriesRef = reactExports.useRef(memories);
  const rulesRef = reactExports.useRef(rules);
  const personalitySettingsRef = reactExports.useRef(personalitySettings);
  memoriesRef.current = memories;
  rulesRef.current = rules;
  personalitySettingsRef.current = personalitySettings;
  const persistedMessagesRef = reactExports.useRef(persistedMessages);
  const activeTopicRef = reactExports.useRef("");
  persistedMessagesRef.current = persistedMessages;
  const drainQueue = reactExports.useCallback(() => {
    var _a2;
    if (ttsQueueRef.current.length === 0) {
      isSpeakingRef.current = false;
      setIsSpeaking(false);
      return;
    }
    const next = ttsQueueRef.current.shift();
    isSpeakingRef.current = true;
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(next);
    const bestVoice = selectBestVoice(voicesRef.current);
    if (bestVoice) utterance.voice = bestVoice;
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => drainQueueRef.current();
    utterance.onerror = () => drainQueueRef.current();
    (_a2 = synthRef.current) == null ? void 0 : _a2.speak(utterance);
  }, []);
  drainQueueRef.current = drainQueue;
  const speak = reactExports.useCallback(
    (text) => {
      if (!synthRef.current || !voiceEnabled) return;
      ttsQueueRef.current.push(text);
      if (!isSpeakingRef.current) drainQueueRef.current();
    },
    [voiceEnabled]
  );
  const stopSpeaking = reactExports.useCallback(() => {
    var _a2;
    (_a2 = synthRef.current) == null ? void 0 : _a2.cancel();
    ttsQueueRef.current = [];
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    if (ttsTimerRef.current) clearTimeout(ttsTimerRef.current);
  }, []);
  const startVoiceInput = reactExports.useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      ue.error("Speech recognition not supported. Try Chrome or Edge.");
      return;
    }
    if (recognitionRef.current) recognitionRef.current.abort();
    const recognition = new SpeechRecognition();
    recognition.continuous = continuousModeRef.current;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;
    recognition.onstart = () => {
      setIsListening(true);
      setIsVoiceListening(true);
      if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current);
      if (continuousModeRef.current) {
        micTimeoutRef.current = setTimeout(() => {
          var _a2;
          continuousModeRef.current = false;
          setContinuousMode(false);
          (_a2 = recognitionRef.current) == null ? void 0 : _a2.stop();
          setIsListening(false);
          ue(
            "Microphone timed out after inactivity. Tap the mic to restart."
          );
        }, 3e4);
      }
    };
    recognition.onresult = (event) => {
      voiceRestartCountRef.current = 0;
      if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current);
      if (continuousModeRef.current) {
        micTimeoutRef.current = setTimeout(() => {
          var _a2;
          continuousModeRef.current = false;
          setContinuousMode(false);
          (_a2 = recognitionRef.current) == null ? void 0 : _a2.stop();
          setIsListening(false);
          ue(
            "Microphone timed out after inactivity. Tap the mic to restart."
          );
        }, 3e4);
      }
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      if (transcript.toLowerCase().includes("hey dj")) {
        speak("Yes?");
        setIsListening(true);
        return;
      }
      setInput(transcript);
      setIsListening(false);
      if (continuousModeRef.current) {
        setTimeout(() => handleSendRef.current(transcript), 100);
      }
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      setIsVoiceListening(false);
      if (continuousModeRef.current) return;
      const errCode = event.error;
      if (errCode === "not-allowed") {
        ue.error(
          "Microphone access denied. Please allow access in your browser settings."
        );
      } else if (errCode === "no-speech") ;
      else if (errCode === "audio-capture") {
        ue.error("No microphone detected. Please check your device.");
      } else if (errCode === "network") {
        ue.error(
          "Network error during speech recognition. Check your connection."
        );
      } else {
        ue.error("Voice recognition error. Please try again.");
      }
    };
    recognition.onend = () => {
      setIsListening(false);
      if (continuousModeRef.current) {
        voiceRestartCountRef.current += 1;
        if (voiceRestartCountRef.current > 5) {
          setContinuousMode(false);
          continuousModeRef.current = false;
          voiceRestartCountRef.current = 0;
          ue.error(
            "Continuous listening stopped after repeated failures. Tap mic to restart."
          );
          return;
        }
        const delay = Math.min(500 * voiceRestartCountRef.current, 3e3);
        setTimeout(() => startVoiceInputRef.current(), delay);
      }
    };
    recognition.start();
  }, [speak, setIsVoiceListening]);
  const stopVoiceInput = reactExports.useCallback(() => {
    var _a2;
    (_a2 = recognitionRef.current) == null ? void 0 : _a2.stop();
    setIsListening(false);
    setIsVoiceListening(false);
  }, [setIsVoiceListening]);
  const toggleContinuousMode = reactExports.useCallback(() => {
    var _a2;
    const next = !continuousModeRef.current;
    setContinuousMode(next);
    continuousModeRef.current = next;
    if (next) {
      startVoiceInputRef.current();
    } else {
      (_a2 = recognitionRef.current) == null ? void 0 : _a2.abort();
      setIsListening(false);
    }
  }, []);
  startVoiceInputRef.current = startVoiceInput;
  handleSendRef.current = (text) => handleSend(text);
  const assistantController = createAssistantController(() => {
    const deps = {
      actor,
      queryClient,
      memories: memoriesRef.current,
      rules: rulesRef.current,
      personalitySettings: personalitySettingsRef.current,
      contextEngine,
      conversationHistory: persistedMessagesRef.current,
      activeTopicRef,
      addMemory: (content) => addMemory.mutateAsync(content),
      deleteMemory: (id) => deleteMemory.mutateAsync(id),
      createCommand: (params) => createCommand.mutateAsync(params),
      setBehaviorRule: (params) => setBehaviorRule.mutateAsync(params),
      setPersonality: (style) => setPersonality.mutateAsync(style),
      activateModule: (name) => activateModule.mutateAsync(name),
      deactivateModule: (name) => deactivateModule.mutateAsync(name)
    };
    return deps;
  });
  const handleSend = async (messageOverride) => {
    setIsTyping(false);
    const messageText = messageOverride ?? input.trim();
    if (!messageText || isProcessing || activeThreadId === null) return;
    setInput("");
    setIsProcessing(true);
    const optimisticUserMsg = {
      id: `optimistic-user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: BigInt(Date.now()) * 1000000n,
      isOptimistic: true
    };
    setOptimisticMessages((prev) => [...prev, optimisticUserMsg]);
    try {
      if (actor) {
        actor.saveThreadMessage(activeThreadId, "user", messageText).then(() => {
          queryClient.invalidateQueries({
            queryKey: ["threadMessages", activeThreadId.toString()]
          });
        }).catch(() => {
          setOptimisticMessages(
            (prev) => prev.map(
              (m) => m.id === optimisticUserMsg.id ? { ...m, saveFailed: true } : m
            )
          );
        });
      }
      contextEngine.logAction("chat_message", messageText.substring(0, 50));
      const response = await assistantController.process(messageText);
      const suggestions = getSuggestedRules();
      if (suggestions.length > 0) setPatternSuggestion(suggestions[0]);
      const optimisticDJMsg = {
        id: `optimistic-dj-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: BigInt(Date.now() + 1) * 1000000n,
        isOptimistic: true
      };
      setOptimisticMessages([optimisticUserMsg, optimisticDJMsg]);
      if (actor) {
        actor.saveThreadMessage(activeThreadId, "assistant", response).then(() => {
          queryClient.invalidateQueries({
            queryKey: ["threadMessages", activeThreadId.toString()]
          });
        }).catch(() => {
          setOptimisticMessages(
            (prev) => prev.map(
              (m) => m.id === optimisticDJMsg.id ? { ...m, saveFailed: true } : m
            )
          );
        });
      }
      if (voiceEnabled) speak(response);
    } catch (_error) {
      ue.error("Failed to process message. Please try again.");
      setInput(messageText);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp) / 1e6);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const formatThreadTime = (createdAt) => {
    const d = new Date(Number(createdAt) / 1e6);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const createThread = async (name, moduleTag) => {
    if (!actor || !name.trim()) return;
    if (isCreating) return;
    setIsCreating(true);
    try {
      const rawId = await actor.createChatThread(
        name.trim(),
        moduleTag ?? null
      );
      const id = rawId;
      queryClient.invalidateQueries({ queryKey: ["chatThreads"] });
      setActiveThreadId(id);
      setNewThreadDialogOpen(false);
      setNewThreadName("");
    } catch {
      ue.error("Failed to create thread");
    } finally {
      setIsCreating(false);
    }
  };
  const deleteThread = async (id) => {
    if (!actor) return;
    try {
      await actor.deleteChatThread(id);
      queryClient.invalidateQueries({ queryKey: ["chatThreads"] });
      if (activeThreadId === id) setActiveThreadId(null);
      setDeleteConfirmThreadId(null);
    } catch {
      ue.error("Failed to delete thread");
    }
  };
  const deleteMessage = async (messageId) => {
    if (!actor || activeThreadId === null) return;
    try {
      await actor.deleteThreadMessage(activeThreadId, messageId);
      queryClient.invalidateQueries({
        queryKey: ["threadMessages", activeThreadId.toString()]
      });
    } catch {
      ue.error("Failed to delete message");
    }
  };
  const quickRuleSuggestions = [
    "Always respond in bullet points",
    "Keep responses under 3 sentences",
    "Always greet me by name"
  ];
  const threadSidebarContent = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-primary/20 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-primary", children: "Chat Threads" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          "data-ocid": "chat.new_thread_button",
          onClick: () => setNewThreadDialogOpen(true),
          className: "h-7 bg-primary/20 px-2 text-primary hover:bg-primary/30 border border-primary/30",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: threadsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" }) }) : threads.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 text-center", "data-ocid": "chat.threads.empty_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "mx-auto h-8 w-8 text-muted-foreground/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "No threads yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Create one to start." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 p-2", children: threads.slice().sort(
      (a, b) => a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0
    ).map((thread, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `chat.thread.item.${idx + 1}`,
        className: `group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors ${activeThreadId === thread.id ? "bg-primary/15 border border-primary/30" : "hover:bg-muted/50"}`,
        onClick: () => {
          setActiveThreadId(thread.id);
          setDrawerOpen(false);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `truncate text-sm font-medium ${activeThreadId === thread.id ? "text-primary" : ""}`,
                children: thread.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-1.5", children: [
              thread.moduleTag && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "h-4 bg-secondary/20 px-1 text-[9px] text-secondary", children: thread.moduleTag }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: formatThreadTime(thread.createdAt) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `chat.thread.delete_button.${idx + 1}`,
              onClick: (e) => {
                e.stopPropagation();
                setDeleteConfirmThreadId(thread.id);
              },
              className: "shrink-0 rounded p-0.5 text-muted-foreground/40 opacity-0 hover:text-destructive group-hover:opacity-100 transition-opacity",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ]
      },
      thread.id.toString()
    )) }) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    showSuggestions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-primary/30 bg-primary/10 px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4 shrink-0 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Suggested rule:" }),
        quickRuleSuggestions.map((rule) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "chat.suggestion.button",
            onClick: async () => {
              await setBehaviorRule.mutateAsync({
                ruleText: rule,
                priority: BigInt(rulesRef.current.length + 1)
              });
              ue.success(`Rule applied: ${rule}`);
              setShowSuggestions(false);
            },
            className: "rounded border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs text-primary hover:bg-primary/20",
            children: rule
          },
          rule
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setShowSuggestions(false),
          className: "text-muted-foreground hover:text-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", style: { height: "calc(100dvh - 4rem)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden w-64 shrink-0 border-r border-primary/20 bg-card/50 md:flex md:flex-col", children: threadSidebarContent }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-primary/20 bg-card/80 px-4 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              variant: "ghost",
              "data-ocid": "chat.threads_button",
              onClick: () => setDrawerOpen(true),
              className: "h-8 w-8 shrink-0 md:hidden",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex-1", children: activeThreadId ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold", children: ((_a = threads.find((t) => t.id === activeThreadId)) == null ? void 0 : _a.name) || "Thread" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Select a thread" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-4", children: [
          activeThreadId === null ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex h-64 items-center justify-center",
              "data-ocid": "chat.empty_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glow-border rounded-lg border border-primary/50 p-8 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "mx-auto h-12 w-12 text-primary/40 mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "glow-text font-display text-xl", children: "Select a thread or create one" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "to start chatting with DJ" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    className: "mt-4 bg-primary/20 text-primary border border-primary/30",
                    size: "sm",
                    onClick: () => setNewThreadDialogOpen(true),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-3.5 w-3.5" }),
                      " New Thread"
                    ]
                  }
                )
              ] })
            }
          ) : messagesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex h-64 items-center justify-center",
              "data-ocid": "chat.loading_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" })
            }
          ) : allVisibleMessages.length === 0 && !isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex h-64 items-center justify-center",
              "data-ocid": "chat.empty_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glow-border rounded-lg border border-primary/50 p-8 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "glow-text font-display text-xl", children: "Start a conversation with DJ" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Try: “DJ, remember my name is [your name]”" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
                  "Go to",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: "/knowledge",
                      className: "text-primary hover:underline",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "inline h-3.5 w-3.5" }),
                        " Knowledge"
                      ]
                    }
                  ),
                  " ",
                  "to add sources."
                ] })
              ] })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            allVisibleMessages.map((message, msgIdx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `group flex ${message.role === "user" ? "justify-end" : "justify-start"} ${message.isOptimistic ? "opacity-80" : ""}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `relative max-w-[85%] rounded-2xl px-4 py-3 ${message.role === "user" ? "rounded-br-sm border border-primary/40 bg-primary/15 text-foreground" : "rounded-bl-sm border border-secondary/40 bg-card/80 text-foreground"}`,
                    style: message.role === "user" ? {
                      boxShadow: "0 0 10px oklch(0.65 0.25 220 / 0.25)"
                    } : {
                      boxShadow: "0 0 10px oklch(0.75 0.18 195 / 0.15)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: message.role === "user" ? "default" : "secondary",
                            className: "text-xs",
                            children: message.role === "user" ? "You" : "DJ"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: message.isOptimistic ? message.role === "user" ? "sending..." : "just now" : formatTimestamp(message.timestamp) }),
                        !message.isOptimistic && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            "data-ocid": `chat.message.delete_button.${msgIdx + 1}`,
                            onClick: () => {
                              const numId = BigInt(message.id);
                              deleteMessage(numId);
                            },
                            className: "ml-auto rounded p-0.5 text-muted-foreground/30 opacity-0 hover:text-destructive group-hover:opacity-100 transition-opacity",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageContent, { content: message.content }),
                      message.saveFailed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 text-xs", children: "⚠ Save failed" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            "data-ocid": "chat.message.retry_button",
                            className: "text-xs text-primary underline hover:no-underline",
                            onClick: () => {
                              if (!actor || !activeThreadId) return;
                              actor.saveThreadMessage(
                                activeThreadId,
                                message.role,
                                message.content
                              ).then(() => {
                                setOptimisticMessages(
                                  (prev) => prev.map(
                                    (m) => m.id === message.id ? { ...m, saveFailed: false } : m
                                  )
                                );
                                queryClient.invalidateQueries({
                                  queryKey: [
                                    "threadMessages",
                                    activeThreadId.toString()
                                  ]
                                });
                              }).catch(
                                () => ue.error(
                                  "Retry failed. Check your connection."
                                )
                              );
                            },
                            children: "Retry"
                          }
                        )
                      ] }),
                      message.isFollowup && message.followupTaskId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            className: "h-7 bg-green-500/20 text-green-400 border border-green-500/30 text-xs hover:bg-green-500/30",
                            onClick: () => {
                              localStorage.setItem(
                                `dj_reminder_ack_${message.followupTaskId}`,
                                "yes"
                              );
                              ue.success("Great! Marked as done.");
                            },
                            children: "Yes"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            className: "h-7 bg-red-500/20 text-red-400 border border-red-500/30 text-xs hover:bg-red-500/30",
                            onClick: () => {
                              localStorage.setItem(
                                `dj_reminder_ack_${message.followupTaskId}`,
                                "no"
                              );
                              ue("Noted — maybe next time!");
                            },
                            children: "No"
                          }
                        )
                      ] })
                    ]
                  }
                )
              },
              message.id
            )),
            isProcessing && optimisticMessages.length < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex justify-start",
                "data-ocid": "chat.loading_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "rounded-2xl rounded-bl-sm border border-secondary/40 bg-card/80 px-4 py-3",
                    style: {
                      boxShadow: "0 0 10px oklch(0.75 0.18 195 / 0.15)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "h-2 w-2 rounded-full bg-secondary animate-bounce",
                            style: { animationDelay: "0ms" }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "h-2 w-2 rounded-full bg-secondary animate-bounce",
                            style: { animationDelay: "150ms" }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "h-2 w-2 rounded-full bg-secondary animate-bounce",
                            style: { animationDelay: "300ms" }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "DJ is thinking..." })
                    ] })
                  }
                )
              }
            ),
            !isProcessing && isSpeaking && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "rounded-2xl rounded-bl-sm border border-secondary/40 bg-card/80 px-4 py-3",
                style: {
                  boxShadow: "0 0 10px oklch(0.75 0.18 195 / 0.15)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4 animate-pulse text-secondary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "DJ is speaking..." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: stopSpeaking,
                      className: "ml-1 text-xs text-muted-foreground hover:text-destructive",
                      children: "Stop"
                    }
                  )
                ] })
              }
            ) })
          ] }),
          patternSuggestion && (() => {
            const rule = getPatternRuleText(patternSuggestion);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": "chat.pattern.card",
                className: "flex justify-start",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "max-w-[85%] rounded-2xl rounded-bl-sm border border-secondary/40 bg-gradient-to-br from-secondary/10 to-secondary/5 px-4 py-3",
                    style: {
                      boxShadow: "0 0 12px oklch(0.75 0.18 195 / 0.15)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "mt-0.5 h-4 w-4 shrink-0 text-secondary" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-secondary", children: "Pattern Detected" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                          "You've used “",
                          rule.trigger,
                          "” several times. Want DJ to",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: rule.action }),
                          "?"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              "data-ocid": "chat.pattern.confirm_button",
                              size: "sm",
                              onClick: async () => {
                                try {
                                  if (actor) {
                                    await setBehaviorRule.mutateAsync({
                                      ruleText: rule.action,
                                      priority: BigInt(
                                        rulesRef.current.length + 1
                                      )
                                    });
                                  }
                                  markRuleSuggested(patternSuggestion);
                                  setPatternSuggestion(null);
                                  ue.success(
                                    "Rule created! DJ will now handle this automatically."
                                  );
                                } catch {
                                  ue.error("Failed to create rule");
                                }
                              },
                              className: "h-7 border border-secondary/40 bg-secondary/20 text-secondary hover:bg-secondary/30 text-xs",
                              children: "Create Rule"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              "data-ocid": "chat.pattern.cancel_button",
                              size: "sm",
                              variant: "ghost",
                              onClick: () => {
                                markRuleSuggested(patternSuggestion);
                                setPatternSuggestion(null);
                              },
                              className: "h-7 text-xs text-muted-foreground",
                              children: "Dismiss"
                            }
                          )
                        ] })
                      ] })
                    ] })
                  }
                )
              }
            );
          })(),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
        ] }) }),
        activeThreadId !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "border-t border-primary/20 bg-card/95 px-4 py-3 backdrop-blur",
            style: {
              paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "icon",
                    variant: isListening ? "default" : "outline",
                    onClick: isListening && !continuousMode ? stopVoiceInput : !continuousMode ? startVoiceInput : void 0,
                    disabled: isProcessing || continuousMode,
                    "data-ocid": "chat.voice_toggle",
                    title: continuousMode ? "Use continuous mode button to control" : isListening ? "Stop listening" : "Start voice input",
                    className: `shrink-0 relative ${isListening ? "bg-primary text-primary-foreground ring-2 ring-cyan-400 ring-offset-1 ring-offset-background shadow-[0_0_16px_rgba(34,211,238,0.7)]" : "border-primary/50 hover:border-primary"}`,
                    children: [
                      isListening ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-4 w-4" }),
                      isListening && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-md animate-ping bg-cyan-400/30 pointer-events-none" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "outline",
                    onClick: toggleContinuousMode,
                    "data-ocid": "chat.continuous_toggle",
                    title: continuousMode ? "Turn off continuous listening" : "Turn on continuous listening (wake word: Hey DJ)",
                    className: `shrink-0 transition-all ${continuousMode ? "border-green-400/70 text-green-400 bg-green-400/10 shadow-[0_0_8px_rgba(74,222,128,0.4)]" : "border-muted text-muted-foreground hover:border-primary/50"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "outline",
                    onClick: () => {
                      if (isSpeaking) stopSpeaking();
                      setVoiceEnabled((v) => !v);
                    },
                    title: voiceEnabled ? "Mute DJ voice" : "Enable DJ voice",
                    className: `shrink-0 ${voiceEnabled ? "border-secondary/50 text-secondary hover:border-secondary" : "border-muted text-muted-foreground"}`,
                    children: voiceEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: isListening ? "Listening..." : "Message DJ... (or tap mic to speak)",
                    value: input,
                    onChange: (e) => {
                      setInput(e.target.value);
                      setIsTyping(e.target.value.length > 0);
                    },
                    onBlur: () => setIsTyping(false),
                    onKeyDown: handleKeyDown,
                    className: "flex-1 border-primary/40 bg-card/50 focus-visible:ring-primary/50",
                    disabled: isProcessing || isListening,
                    "data-ocid": "chat.input",
                    autoComplete: "off"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => handleSend(),
                    disabled: !input.trim() || isProcessing,
                    className: "shrink-0 bg-primary hover:bg-primary/90",
                    "data-ocid": "chat.send_button",
                    children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
                  }
                )
              ] }),
              isListening && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "rounded-full bg-cyan-400 animate-bounce",
                      style: { width: 5, height: 5, animationDelay: "0ms" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "rounded-full bg-cyan-400 animate-bounce",
                      style: { width: 7, height: 7, animationDelay: "150ms" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "rounded-full bg-cyan-400 animate-bounce",
                      style: {
                        width: 10,
                        height: 10,
                        animationDelay: "300ms"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "rounded-full bg-cyan-400 animate-bounce",
                      style: { width: 7, height: 7, animationDelay: "150ms" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "rounded-full bg-cyan-400 animate-bounce",
                      style: { width: 5, height: 5, animationDelay: "0ms" }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-cyan-400 font-medium animate-pulse", children: continuousMode ? 'Continuous — say "Hey DJ" to activate' : "Listening... speak now" })
              ] })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: drawerOpen, onOpenChange: setDrawerOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      SheetContent,
      {
        side: "left",
        className: "w-72 border-primary/30 bg-card/95 p-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "sr-only", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Chat Threads" }) }),
          threadSidebarContent
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: newThreadDialogOpen, onOpenChange: setNewThreadDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm border-primary/40 bg-card/95", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "New Thread" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "topic", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "topic", className: "flex-1", children: "By Topic" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "module", className: "flex-1", children: "By Module" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "topic", className: "space-y-3 pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Thread name...",
              value: newThreadName,
              onChange: (e) => setNewThreadName(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") createThread(newThreadName, null);
              },
              autoFocus: true,
              className: "border-primary/40"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30",
              onClick: () => createThread(newThreadName, null),
              disabled: !newThreadName.trim() || isCreating,
              children: isCreating ? "Creating..." : "Create Thread"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "module", className: "pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: MODULE_TAGS.map((m) => {
          const Icon = m.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: "flex h-auto flex-col gap-1.5 border-primary/30 py-3 hover:bg-primary/10",
              onClick: () => createThread(m.label, m.value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: m.label })
              ]
            },
            m.value
          );
        }) }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: deleteConfirmThreadId !== null,
        onOpenChange: (open) => {
          if (!open) setDeleteConfirmThreadId(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "border-destructive/30 bg-card/95", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Thread?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will permanently delete this thread and all its messages. This cannot be undone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogCancel,
              {
                "data-ocid": "chat.thread.cancel_button",
                onClick: () => setDeleteConfirmThreadId(null),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                "data-ocid": "chat.thread.confirm_button",
                onClick: () => {
                  if (deleteConfirmThreadId !== null)
                    deleteThread(deleteConfirmThreadId);
                },
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
  ChatPage
};
