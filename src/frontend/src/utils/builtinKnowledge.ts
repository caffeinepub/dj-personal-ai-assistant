// Built-in knowledge base for DJ
// Covers IT, Finance, and Productivity topics

export interface KnowledgeEntry {
  id: string;
  topic: string;
  category: "IT" | "Finance" | "Productivity";
  keywords: string[];
  content: string;
}

export const BUILTIN_KNOWLEDGE: KnowledgeEntry[] = [
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
      "ping",
    ],
    content:
      "**Networking Basics**\n\n- **IP Address**: A unique identifier for devices on a network. IPv4 uses 32-bit (e.g., 192.168.1.1); IPv6 uses 128-bit.\n- **DNS (Domain Name System)**: Translates domain names (google.com) to IP addresses.\n- **TCP vs UDP**: TCP is reliable and ordered (used for web, email); UDP is faster but lossy (used for video streaming, gaming).\n- **Router**: Directs traffic between different networks. **Switch**: Connects devices within the same network.\n- **Firewall**: Monitors and controls incoming/outgoing network traffic based on security rules.\n- **Subnet**: A logical division of an IP network to improve performance and security.\n- **Bandwidth**: Maximum data transfer rate. **Latency**: Delay in data transmission. **Ping**: Round-trip time to a server.",
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
      "firewall",
    ],
    content:
      "**Cybersecurity Essentials**\n\n- **Strong Passwords**: Use 12+ characters with upper/lowercase, numbers, symbols. Use a password manager.\n- **2FA (Two-Factor Authentication)**: Adds a second verification step — strongly recommended for all accounts.\n- **Phishing**: Fraudulent emails/messages that trick you into revealing credentials. Never click suspicious links.\n- **Malware**: Malicious software including viruses, ransomware, spyware. Use antivirus and keep software updated.\n- **VPN (Virtual Private Network)**: Encrypts your internet traffic and masks your IP address.\n- **Encryption**: Converts data into unreadable format without a decryption key. HTTPS encrypts web traffic.\n- **Principle of Least Privilege**: Give users/apps only the minimum permissions they need.\n- **Software Updates**: Patch known vulnerabilities — always keep OS and apps updated.",
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
      "serverless",
    ],
    content:
      "**Cloud Computing**\n\n- **IaaS (Infrastructure as a Service)**: Rent virtual machines and storage (e.g., AWS EC2, Azure VMs).\n- **PaaS (Platform as a Service)**: Managed platform for developers to deploy apps without managing servers.\n- **SaaS (Software as a Service)**: Ready-to-use software over the internet (e.g., Gmail, Salesforce).\n- **Docker**: Containerization technology that packages apps with their dependencies.\n- **Kubernetes**: Orchestrates and manages Docker containers at scale.\n- **Serverless**: Run functions without managing servers — pay only for execution time.\n- **CDN (Content Delivery Network)**: Distributes content from servers closest to users for faster delivery.\n- **Major providers**: AWS (Amazon), Azure (Microsoft), GCP (Google).",
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
      "schema",
    ],
    content:
      "**Databases**\n\n- **SQL (Relational)**: Structured data in tables with relationships. Examples: MySQL, PostgreSQL, SQLite.\n- **NoSQL**: Flexible schema for unstructured/semi-structured data. Examples: MongoDB (documents), Redis (key-value), Cassandra (wide-column).\n- **Primary Key**: Unique identifier for each row in a table.\n- **Index**: Speeds up queries but uses extra storage.\n- **ACID Properties**: Atomicity, Consistency, Isolation, Durability — guarantees for reliable transactions.\n- **JOIN**: Combines rows from two or more tables based on a related column.\n- **When to use SQL**: Structured data, complex queries, financial records.\n- **When to use NoSQL**: Large-scale, flexible data, real-time apps, unstructured content.",
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
      "scrum",
    ],
    content: `**Programming Best Practices**\n\n- **DRY (Don't Repeat Yourself)**: Avoid duplicating code — reuse functions and modules.\n- **SOLID Principles**: Five design principles for maintainable OOP code.\n- **Version Control (Git)**: Track changes, collaborate, and revert mistakes. Use meaningful commit messages.\n- **Code Review**: Have others review your code to catch bugs and improve quality.\n- **Testing**: Write unit tests, integration tests, and end-to-end tests. Test early, test often.\n- **REST API**: Standard for web APIs using HTTP methods (GET, POST, PUT, DELETE).\n- **Agile/Scrum**: Iterative development in sprints (1-2 weeks) with daily standups and regular reviews.\n- **Debugging**: Use console logs, breakpoints, and error messages. Reproduce the bug before fixing it.`,
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
      "mac",
    ],
    content:
      "**Essential Keyboard Shortcuts**\n\n**Universal:**\n- Ctrl+C / Cmd+C = Copy\n- Ctrl+V / Cmd+V = Paste\n- Ctrl+Z / Cmd+Z = Undo\n- Ctrl+Y / Cmd+Y = Redo\n- Ctrl+S / Cmd+S = Save\n- Ctrl+F / Cmd+F = Find\n- Ctrl+A / Cmd+A = Select All\n- Alt+Tab / Cmd+Tab = Switch Apps\n\n**Windows Specific:**\n- Win+D = Show Desktop\n- Win+L = Lock Screen\n- Win+E = File Explorer\n- Win+Print Screen = Screenshot\n\n**Mac Specific:**\n- Cmd+Space = Spotlight Search\n- Cmd+Shift+4 = Screenshot area\n- Cmd+Option+Esc = Force Quit",
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
      "allocate",
    ],
    content:
      "**Budgeting Fundamentals**\n\n- **50/30/20 Rule**: Allocate 50% of income to needs (rent, food), 30% to wants (entertainment), 20% to savings/debt.\n- **Zero-Based Budget**: Assign every rupee/dollar a purpose so income minus expenses = 0.\n- **Pay Yourself First**: Transfer savings before spending on discretionary items.\n- **Track Every Expense**: Awareness is the first step — use apps or spreadsheets.\n- **Emergency Fund**: Keep 3-6 months of expenses in liquid savings before investing.\n- **Review Monthly**: Compare actual spending vs. budget and adjust.\n- **Avoid Lifestyle Inflation**: As income grows, increase savings rate before spending more.",
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
      "sensex",
    ],
    content:
      "**Investing Basics**\n\n- **Compound Interest**: Earning returns on your returns — the earlier you start, the more powerful it is.\n- **Equity (Stocks)**: Ownership in a company. Higher risk, higher potential return.\n- **Mutual Funds**: Pool money with other investors; managed by professionals. Good for beginners.\n- **SIP (Systematic Investment Plan)**: Invest a fixed amount monthly in mutual funds — reduces timing risk.\n- **Index Funds**: Track a market index (Nifty 50, S&P 500). Low cost, good long-term returns.\n- **Bonds**: Loans to companies/governments. Lower risk, lower return than stocks.\n- **Diversification**: Spread investments across asset classes to reduce risk.\n- **Rule of 72**: Divide 72 by annual return rate to estimate how many years to double your money.",
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
      "return",
    ],
    content:
      "**Tax Basics (India)**\n\n- **Income Tax Slabs (New Regime 2024-25)**: 0% up to ₹3L, 5% (₹3-7L), 10% (₹7-10L), 15% (₹10-12L), 20% (₹12-15L), 30% above ₹15L.\n- **Section 80C**: Deductions up to ₹1.5L for PPF, ELSS, LIC, EPF, home loan principal (Old Regime).\n- **HRA**: House Rent Allowance — deductible if you pay rent and receive HRA from employer.\n- **TDS**: Tax Deducted at Source — deducted by payer before paying you (salary, interest, etc.).\n- **ITR Filing Deadline**: Usually July 31st for individuals.\n- **GST**: Goods and Services Tax — applicable on most goods and services in India.\n- **Capital Gains**: Tax on profits from selling assets. Short-term (< 1 year) taxed higher than long-term.",
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
      "borrow",
    ],
    content:
      "**Debt Management**\n\n- **Debt Avalanche**: Pay off highest-interest debt first — saves the most money.\n- **Debt Snowball**: Pay off smallest balance first — builds motivation with quick wins.\n- **Credit Card Debt**: Typically 24-48% annual interest — pay full balance monthly to avoid charges.\n- **EMI Calculation**: EMI = [P × r × (1+r)^n] / [(1+r)^n - 1] where P = principal, r = monthly rate, n = months.\n- **Good vs Bad Debt**: Good debt (home loan, education) builds wealth. Bad debt (consumer loans, credit cards) drains wealth.\n- **Debt-to-Income Ratio**: Total monthly debt payments ÷ gross monthly income. Keep below 36%.\n- **Prepayment**: Paying extra on loans reduces total interest significantly.",
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
      "bank",
    ],
    content:
      "**Savings Strategies**\n\n- **Emergency Fund**: 3-6 months of expenses in a liquid account (savings account or liquid fund).\n- **FD (Fixed Deposit)**: Safe, guaranteed return (typically 6-8% in India). Ideal for medium-term goals.\n- **PPF (Public Provident Fund)**: 15-year lock-in, tax-free returns (~7.1%), Section 80C eligible.\n- **RD (Recurring Deposit)**: Fixed monthly savings with guaranteed interest. Good for disciplined saving.\n- **Liquid Funds**: Mutual funds investing in short-term instruments — better returns than savings accounts.\n- **Goal-Based Saving**: Assign each savings pool a goal (vacation, gadget, down payment) with a target date.\n- **Automate Savings**: Set up auto-debit on salary day so you save before you can spend.",
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
      "productivity",
    ],
    content: `**Time Management Techniques**\n\n- **Time Blocking**: Assign specific time slots to tasks in your calendar. Protects focus time.\n- **Eisenhower Matrix**: Classify tasks by Urgent/Important. Do urgent+important first; schedule important+not urgent; delegate urgent+not important; eliminate neither.\n- **2-Minute Rule**: If a task takes less than 2 minutes, do it immediately.\n- **MIT (Most Important Tasks)**: Identify 1-3 critical tasks each morning and complete them first.\n- **Parkinson's Law**: Work expands to fill the time available — set tight deadlines.\n- **Batching**: Group similar tasks together (e.g., all emails at once) to reduce context switching.\n- **Weekly Review**: Spend 30 min each Sunday reviewing progress and planning the coming week.`,
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
      "concentration",
    ],
    content:
      "**Pomodoro Technique**\n\n1. Choose a task to work on\n2. Set a timer for **25 minutes** (one Pomodoro)\n3. Work with full focus — no distractions\n4. Take a **5-minute break** when the timer rings\n5. After **4 Pomodoros**, take a longer break (15-30 minutes)\n\n**Why it works**: Creates urgency, makes large tasks less daunting, and builds in regular rest.\n\n**Tips**: Turn off notifications during sessions. Track completed Pomodoros to measure productivity. Adjust to 50/10 or 90-minute sessions if you prefer longer flow states.",
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
      "review",
    ],
    content:
      "**Getting Things Done (GTD) by David Allen**\n\n5 Steps:\n1. **Capture**: Write down everything on your mind — tasks, ideas, worries.\n2. **Clarify**: For each item, decide: Is it actionable? What is the next physical action?\n3. **Organize**: Put items in the right list (Next Actions, Projects, Waiting For, Someday/Maybe).\n4. **Reflect**: Weekly review of all lists to stay current and clear.\n5. **Engage**: Simply work from your Next Actions list.\n\n**Key concept**: A trusted system outside your head frees mental RAM for actual thinking.\n**Project**: Any outcome requiring more than one action step.",
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
      "cal newport",
    ],
    content: `**Deep Work (Cal Newport)**\n\n- **Deep Work**: Cognitively demanding tasks performed in a state of distraction-free concentration.\n- **Shallow Work**: Non-cognitively demanding tasks (emails, meetings) — easy to replicate and low value.\n\n**Strategies:**\n- **Monastic**: Total isolation — eliminate all shallow work.\n- **Bimodal**: Deep work for full days/weeks; normal schedule otherwise.\n- **Rhythmic**: Daily deep work blocks (e.g., 6-9am every day).\n- **Journalistic**: Fit deep work whenever you can (best for busy people).\n\n**Tips**: Schedule deep work blocks. Embrace boredom (don't reach for phone). Quit social media or use intentionally. Track hours of deep work weekly.`,
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
      "consistency",
    ],
    content: `**Habit Building (Atomic Habits by James Clear)**\n\n**The 4 Laws of Behavior Change:**\n1. **Make it Obvious** (Cue): Place reminders where you'll see them.\n2. **Make it Attractive** (Craving): Pair habits with things you enjoy.\n3. **Make it Easy** (Response): Reduce friction — prepare the night before.\n4. **Make it Satisfying** (Reward): Celebrate small wins immediately.\n\n**Key concepts:**\n- **1% Better Daily**: Small improvements compound to 37x better in a year.\n- **Identity-Based Habits**: Focus on who you want to become, not what you want to achieve.\n- **Habit Stacking**: Chain new habits to existing ones (\"After I [existing habit], I will [new habit]\").\n- **Never miss twice**: Missing once is an accident; missing twice starts a new habit of not doing it.`,
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
      "knowledge management",
    ],
    content: `**Note-Taking Systems**\n\n- **Cornell Method**: Divide page into notes (right), cues/questions (left), summary (bottom). Good for lectures.\n- **Zettelkasten**: Create atomic notes linked to each other. Builds a personal knowledge graph over time.\n- **Second Brain (PARA)**: Organize notes by Projects, Areas, Resources, Archives.\n- **Mind Mapping**: Visual notes branching from a central topic. Great for brainstorming.\n- **Outline Method**: Hierarchical bullet points. Simple and fast.\n\n**Best Practices:**\n- Write in your own words — don't just copy.\n- Review notes within 24 hours to retain 80%+ of content.\n- Tag and link notes for future discoverability.\n- Keep an inbox for unprocessed captures.`,
  },
];

// Search built-in knowledge by query
export function searchBuiltinKnowledge(query: string): KnowledgeEntry[] {
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/).filter((w) => w.length > 2);

  const scored = BUILTIN_KNOWLEDGE.map((entry) => {
    let score = 0;
    // Check topic match
    if (entry.topic.toLowerCase().includes(lowerQuery)) score += 10;
    // Check keyword matches
    for (const kw of entry.keywords) {
      if (lowerQuery.includes(kw)) score += 5;
      for (const word of words) {
        if (kw.includes(word)) score += 2;
      }
    }
    // Check content match
    if (entry.content.toLowerCase().includes(lowerQuery)) score += 3;
    for (const word of words) {
      if (entry.content.toLowerCase().includes(word)) score += 1;
    }
    return { entry, score };
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.entry);
}

// Get all entries for a specific category
export function getKnowledgeByCategory(
  category: KnowledgeEntry["category"],
): KnowledgeEntry[] {
  return BUILTIN_KNOWLEDGE.filter((e) => e.category === category);
}
