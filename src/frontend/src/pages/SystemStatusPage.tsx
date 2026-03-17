import {
  Activity,
  BookOpen,
  Brain,
  CheckSquare,
  Code,
  DollarSign,
  FileSpreadsheet,
  Globe,
  GraduationCap,
  Map as MapIcon,
  MessageSquare,
  StickyNote,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import {
  useActiveModules,
  useBehaviorRules,
  useCustomCommands,
  useFinanceEntries,
  useMemories,
  useNotes,
  usePlans,
  useTasks,
} from "../hooks/useQueries";
import { Link } from "../lib/router-shim";
import { isKnowledgeSource } from "../utils/knowledgeSources";

function HudCorners({ color = "cyan" }: { color?: "blue" | "cyan" }) {
  const c = color === "cyan" ? "oklch(0.75 0.18 195)" : "oklch(0.65 0.25 220)";
  return (
    <>
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderTop: `2px solid ${c}`,
          borderLeft: `2px solid ${c}`,
        }}
      />
      <span
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 10,
          height: 10,
          borderTop: `2px solid ${c}`,
          borderRight: `2px solid ${c}`,
        }}
      />
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 10,
          height: 10,
          borderBottom: `2px solid ${c}`,
          borderLeft: `2px solid ${c}`,
        }}
      />
      <span
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 10,
          height: 10,
          borderBottom: `2px solid ${c}`,
          borderRight: `2px solid ${c}`,
        }}
      />
    </>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-sm text-cyan-400/70 tabular-nums">
      {time.toLocaleTimeString()}
    </span>
  );
}

export function SystemStatusPage() {
  const { data: tasks = [] } = useTasks();
  const { data: financeEntries = [] } = useFinanceEntries();
  const { data: memories = [] } = useMemories();
  const { data: rules = [] } = useBehaviorRules();
  const { data: commands = [] } = useCustomCommands();
  const { data: activeModules = [] } = useActiveModules();
  const { data: notes = [] } = useNotes();
  const { data: plans = [] } = usePlans();

  const tasksPending = tasks.filter((t) => !t.completed).length;
  const tasksOverdue = tasks.filter(
    (t) => !t.completed && t.deadline && Number(t.deadline) / 1e6 < Date.now(),
  ).length;
  const knowledgeSources = memories.filter(isKnowledgeSource).length;
  const regularMemories = memories.filter((m) => !isKnowledgeSource(m)).length;
  const activePlansCount = plans.filter((p) => p.status === "active").length;

  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  ).getTime();
  const monthEntries = financeEntries.filter(
    (e) => Number(e.entryDate) / 1e6 >= monthStart,
  );
  const income =
    monthEntries
      .filter((e) => Number(e.amount) > 0)
      .reduce((acc, e) => acc + Number(e.amount), 0) / 100;
  const expenses =
    monthEntries
      .filter((e) => Number(e.amount) < 0)
      .reduce((acc, e) => acc + Math.abs(Number(e.amount)), 0) / 100;
  const balance = income - expenses;

  const totalTasks = tasks.length;
  const totalMemories = regularMemories;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRatio =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const allModules = [
    { name: "Tasks", icon: CheckSquare, path: "/tasks", key: "tasks" },
    { name: "Notes", icon: StickyNote, path: "/notes", key: "notes" },
    { name: "Finance", icon: DollarSign, path: "/finance", key: "finance" },
    { name: "Knowledge", icon: BookOpen, path: "/knowledge", key: "knowledge" },
    { name: "Excel", icon: FileSpreadsheet, path: "/excel", key: "excel" },
    { name: "Coding", icon: Code, path: "/coding", key: "coding" },
    { name: "Website", icon: Globe, path: "/website", key: "website" },
  ];

  const quickCommands = [
    { label: "Add Expense", icon: DollarSign, path: "/finance" },
    { label: "Add Task", icon: CheckSquare, path: "/tasks" },
    { label: "Add Note", icon: StickyNote, path: "/notes" },
    { label: "Open Chat", icon: MessageSquare, path: "/chat" },
    { label: "Knowledge", icon: BookOpen, path: "/knowledge" },
    { label: "Teach DJ", icon: GraduationCap, path: "/teach" },
  ];

  const maxHealthValue = Math.max(
    regularMemories,
    rules.length,
    commands.length,
    activeModules.length,
    1,
  );

  return (
    <Layout>
      <div
        className="relative z-10 min-h-screen p-4 md:p-6"
        data-ocid="system_status.page"
      >
        {/* Decorative page-level rings */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <svg
            className="absolute -bottom-20 -right-20 opacity-25"
            width="400"
            height="400"
            aria-hidden="true"
            style={{ animation: "hud-ring-rotate 18s linear infinite" }}
          >
            <circle
              cx="200"
              cy="200"
              r="185"
              fill="none"
              stroke="oklch(0.65 0.25 220)"
              strokeWidth="1.5"
              strokeDasharray="50 15"
            />
            <circle
              cx="200"
              cy="200"
              r="160"
              fill="none"
              stroke="oklch(0.75 0.18 195)"
              strokeWidth="0.5"
              strokeDasharray="30 10"
            />
          </svg>
          <svg
            className="absolute -top-20 -left-20 opacity-20"
            width="350"
            height="350"
            aria-hidden="true"
            style={{ animation: "hud-ring-rotate-reverse 12s linear infinite" }}
          >
            <circle
              cx="175"
              cy="175"
              r="160"
              fill="none"
              stroke="oklch(0.65 0.25 220)"
              strokeWidth="1"
              strokeDasharray="70 25"
            />
          </svg>
        </div>

        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start justify-between"
        >
          <div>
            <h1
              className="glow-text text-3xl font-bold tracking-[0.2em] text-primary md:text-4xl"
              style={{ fontFamily: "'Orbitron', 'JetBrains Mono', monospace" }}
            >
              SYSTEM STATUS
            </h1>
            <p className="mt-1 font-mono text-xs tracking-widest text-muted-foreground">
              DJ INTELLIGENCE FRAMEWORK v2.0
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <LiveClock />
            <span className="flex items-center gap-1.5 font-mono text-xs text-green-400">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 status-active" />
              ONLINE
            </span>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* TOP STATUS STRIP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex gap-2 overflow-x-auto pb-2"
        >
          {[
            {
              label: "TASKS",
              value: `${tasksPending} pending`,
              icon: CheckSquare,
              color: "text-blue-400",
            },
            {
              label: "OVERDUE",
              value: `${tasksOverdue}`,
              icon: Activity,
              color: tasksOverdue > 0 ? "text-red-400" : "text-green-400",
            },
            {
              label: "KNOWLEDGE",
              value: `${knowledgeSources} sources`,
              icon: BookOpen,
              color: "text-cyan-400",
            },
            {
              label: "MEMORY",
              value: `${totalMemories} stored`,
              icon: Brain,
              color: "text-purple-400",
            },
            {
              label: "PLANS",
              value: `${activePlansCount} active`,
              icon: MapIcon,
              color:
                activePlansCount > 0
                  ? "text-cyan-400"
                  : "text-muted-foreground",
            },
            {
              label: "STATUS",
              value: "ACTIVE",
              icon: Activity,
              color: "text-green-400",
            },
          ].map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="holo-border relative flex shrink-0 items-center gap-2 rounded-md bg-card/60 px-3 py-2 backdrop-blur"
              >
                <Icon className={`h-3.5 w-3.5 ${badge.color}`} />
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
                  {badge.label}:
                </span>
                <span
                  className={`font-mono text-[10px] font-bold ${badge.color}`}
                >
                  {badge.value}
                </span>
                {badge.label === "STATUS" && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 status-active" />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* MAIN STATUS CARDS GRID */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Task Command Center */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="holo-border relative rounded-lg bg-card/80 p-5 backdrop-blur"
            data-ocid="system_status.task_card"
          >
            <HudCorners color="blue" />
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                TASK COMMAND CENTER
              </span>
              <CheckSquare className="h-4 w-4 text-blue-400" />
            </div>
            <div
              className="mb-1 text-5xl font-bold text-blue-400"
              style={{
                textShadow: "0 0 20px oklch(0.65 0.25 220 / 0.6)",
                fontFamily: "'Orbitron', monospace",
              }}
            >
              {tasksPending}
            </div>
            <div className="mb-2 font-mono text-xs tracking-widest text-muted-foreground">
              TASKS PENDING
            </div>
            {tasksOverdue > 0 && (
              <div className="mb-2 font-mono text-xs font-bold text-red-400">
                {tasksOverdue} OVERDUE
              </div>
            )}
            <div className="mt-3">
              <div className="mb-1 flex justify-between font-mono text-[9px] text-muted-foreground">
                <span>COMPLETION</span>
                <span>{Math.round(completionRatio)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRatio}%` }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="h-full rounded-full bg-blue-400"
                  style={{ boxShadow: "0 0 6px oklch(0.65 0.25 220)" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Finance Matrix */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="holo-border relative rounded-lg bg-card/80 p-5 backdrop-blur"
            data-ocid="system_status.finance_card"
          >
            <HudCorners />
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                FINANCE MATRIX
              </span>
              <DollarSign className="h-4 w-4 text-cyan-400" />
            </div>
            <div
              className={`mb-1 text-4xl font-bold ${balance >= 0 ? "text-green-400" : "text-red-400"}`}
              style={{
                textShadow: `0 0 20px ${balance >= 0 ? "oklch(0.65 0.22 160 / 0.6)" : "oklch(0.55 0.24 25 / 0.6)"}`,
                fontFamily: "'Orbitron', monospace",
              }}
            >
              ₹{Math.abs(balance).toLocaleString()}
            </div>
            <div className="mb-3 font-mono text-xs tracking-widest text-muted-foreground">
              THIS MONTH BALANCE
            </div>
            <div className="space-y-1.5">
              {[
                { label: "INCOME", val: income, color: "text-green-400" },
                { label: "EXPENSES", val: expenses, color: "text-red-400" },
                {
                  label: "BALANCE",
                  val: balance,
                  color: balance >= 0 ? "text-green-400" : "text-red-400",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between font-mono text-[10px]"
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className={`font-bold ${row.color}`}>
                    ₹{Math.abs(row.val).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 3: Knowledge Core */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="holo-border relative rounded-lg bg-card/80 p-5 backdrop-blur"
            data-ocid="system_status.knowledge_card"
          >
            <HudCorners />
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                KNOWLEDGE CORE
              </span>
              <BookOpen className="h-4 w-4 text-cyan-400" />
            </div>
            <div
              className="mb-1 text-5xl font-bold text-cyan-400"
              style={{
                textShadow: "0 0 20px oklch(0.75 0.18 195 / 0.6)",
                fontFamily: "'Orbitron', monospace",
              }}
            >
              {knowledgeSources}
            </div>
            <div className="mb-1 font-mono text-xs tracking-widest text-muted-foreground">
              KNOWLEDGE SOURCES
            </div>
            <div className="font-mono text-xs text-cyan-400/70">
              {notes.length} NOTES INDEXED
            </div>
          </motion.div>

          {/* Card 4: DJ Neural Health (spans 2 cols) */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="holo-border relative rounded-lg bg-card/80 p-5 backdrop-blur sm:col-span-2"
            data-ocid="system_status.health_card"
          >
            <HudCorners color="blue" />
            <div className="mb-4 flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                DJ NEURAL HEALTH
              </span>
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "MEMORY",
                  value: regularMemories,
                  color: "bg-purple-400",
                  glow: "oklch(0.70 0.20 280)",
                },
                {
                  label: "RULES",
                  value: rules.length,
                  color: "bg-blue-400",
                  glow: "oklch(0.65 0.25 220)",
                },
                {
                  label: "COMMANDS",
                  value: commands.length,
                  color: "bg-cyan-400",
                  glow: "oklch(0.75 0.18 195)",
                },
                {
                  label: "ACTIVE MODULES",
                  value: activeModules.length,
                  color: "bg-green-400",
                  glow: "oklch(0.65 0.22 160)",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between font-mono text-[9px]">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-bold text-foreground">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(item.value / maxHealthValue) * 100}%`,
                      }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className={`h-full rounded-full ${item.color}`}
                      style={{ boxShadow: `0 0 6px ${item.glow}` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 5: Assistant Status */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="holo-border relative rounded-lg bg-card/80 p-5 backdrop-blur"
            data-ocid="system_status.assistant_card"
          >
            <HudCorners />
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                ASSISTANT STATUS
              </span>
              <Activity className="h-4 w-4 text-green-400" />
            </div>
            <div className="mb-3 flex items-center gap-3">
              <span
                className="inline-block h-3 w-3 rounded-full bg-green-400 status-active"
                style={{ boxShadow: "0 0 8px oklch(0.65 0.22 160)" }}
              />
              <span
                className="text-3xl font-bold text-green-400"
                style={{
                  textShadow: "0 0 20px oklch(0.65 0.22 160 / 0.7)",
                  fontFamily: "'Orbitron', monospace",
                }}
              >
                ONLINE
              </span>
            </div>
            <div className="space-y-2">
              {[
                {
                  label: "Context Engine",
                  status: "ACTIVE",
                  color: "bg-green-400",
                },
                {
                  label: "Voice Interface",
                  status: "READY",
                  color: "bg-cyan-400",
                },
                {
                  label: "Pattern Learning",
                  status: "ACTIVE",
                  color: "bg-green-400",
                },
                {
                  label: "Knowledge Refresh",
                  status: "ACTIVE",
                  color: "bg-blue-400",
                },
              ].map((sub) => (
                <div
                  key={sub.label}
                  className="flex items-center justify-between font-mono text-[10px]"
                >
                  <span className="text-muted-foreground">{sub.label}</span>
                  <span
                    className={`flex items-center gap-1.5 font-bold ${sub.color.replace("bg-", "text-")}`}
                  >
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${sub.color}`}
                    />
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* QUICK COMMAND SHORTCUT BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
          data-ocid="system_status.quick_commands.panel"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
              QUICK COMMANDS
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickCommands.map((cmd, i) => {
              const Icon = cmd.icon;
              const ocids = [
                "system_status.cmd.expense_button",
                "system_status.cmd.task_button",
                "system_status.cmd.note_button",
                "system_status.cmd.chat_button",
                "system_status.cmd.knowledge_button",
                "system_status.cmd.teach_button",
              ];
              return (
                <Link key={cmd.path} to={cmd.path} data-ocid={ocids[i]}>
                  <motion.div
                    whileTap={{ scale: 0.93 }}
                    whileHover={{ scale: 1.04 }}
                    className="holo-border relative flex shrink-0 cursor-pointer flex-col items-center gap-1.5 rounded-md bg-card/60 px-4 py-3 backdrop-blur transition-colors hover:bg-primary/10"
                  >
                    <HudCorners />
                    <Icon className="h-5 w-5 text-cyan-400" />
                    <span className="font-mono text-[9px] tracking-wider text-foreground whitespace-nowrap">
                      {cmd.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
          {/* Assistant Action Buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              data-ocid="system_status.daily_briefing.button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("dj-chat-command", {
                    detail: "DJ start my morning routine",
                  }),
                )
              }
              className="flex items-center gap-1.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 font-mono text-[10px] text-cyan-400 transition-colors hover:bg-cyan-500/20 min-h-[44px]"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Run Daily Briefing
            </button>
            <button
              type="button"
              data-ocid="system_status.review_goals.button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("dj-chat-command", {
                    detail: "DJ review my goals",
                  }),
                )
              }
              className="flex items-center gap-1.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 font-mono text-[10px] text-cyan-400 transition-colors hover:bg-cyan-500/20 min-h-[44px]"
            >
              <Activity className="h-3.5 w-3.5" />
              Review Goals
            </button>
            <button
              type="button"
              data-ocid="system_status.refresh_knowledge.button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("dj-show-briefing"))
              }
              className="flex items-center gap-1.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 font-mono text-[10px] text-cyan-400 transition-colors hover:bg-cyan-500/20 min-h-[44px]"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Refresh Knowledge
            </button>
          </div>
        </motion.div>

        {/* ACTIVE MODULE STATUS PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          data-ocid="system_status.module_status.panel"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
              MODULE STATUS MATRIX
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {allModules.map((mod, idx) => {
              const Icon = mod.icon;
              const isActive =
                activeModules.includes(mod.key) ||
                activeModules.includes(mod.name.toLowerCase());
              const entryCount =
                mod.key === "tasks"
                  ? tasks.length
                  : mod.key === "notes"
                    ? notes.length
                    : mod.key === "finance"
                      ? financeEntries.length
                      : mod.key === "knowledge"
                        ? knowledgeSources
                        : null;

              return (
                <motion.div
                  key={mod.name}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="holo-border relative rounded-md bg-card/60 p-3 backdrop-blur"
                >
                  <HudCorners color="blue" />
                  <div className="mb-2 flex items-center justify-between">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[9px] font-bold ${isActive ? "text-green-400" : "text-amber-400"}`}
                    >
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-400" : "bg-amber-400"}`}
                      />
                      {isActive ? "ACTIVE" : "STANDBY"}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-foreground">
                    {mod.name}
                  </div>
                  {entryCount !== null && (
                    <div className="mt-0.5 font-mono text-[9px] text-muted-foreground">
                      {entryCount} entries
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 border-t border-border/30 pt-4 text-center font-mono text-[10px] text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </Layout>
  );
}
