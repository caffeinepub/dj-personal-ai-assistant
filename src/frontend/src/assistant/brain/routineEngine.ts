/**
 * Routine Engine
 *
 * Generates structured daily routine summaries for DJ.
 * Provides morning briefing, work mode, and end-of-day review.
 */

import type { FinanceEntry, Task } from "../../hooks/useQueries";

function todayMs(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function formatCurrency(cents: number): string {
  return `₹${Math.abs(cents / 100).toFixed(2)}`;
}

/**
 * Morning routine: daily briefing + today's tasks + finance summary
 */
export function getMorningRoutine(
  tasks: Task[],
  financeEntries: FinanceEntry[],
): string {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const today = todayMs();
  const todayEnd = today + 86400000;

  const pendingTasks = tasks.filter((t) => !t.completed);
  const todayTasks = pendingTasks.filter((t) => {
    if (!t.deadline) return false;
    const ms = Number(t.deadline) / 1_000_000;
    return ms >= today && ms < todayEnd;
  });
  const overdueTasks = pendingTasks.filter((t) => {
    if (!t.deadline) return false;
    return Number(t.deadline) / 1_000_000 < today;
  });
  const highPriority = pendingTasks.filter((t) => t.priority === "High");

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEntries = financeEntries.filter(
    (e) => Number(e.entryDate) / 1_000_000 >= monthStart,
  );
  const income =
    monthEntries
      .filter((e) => Number(e.amount) > 0)
      .reduce((s, e) => s + Number(e.amount), 0) / 100;
  const expenses =
    monthEntries
      .filter((e) => Number(e.amount) < 0)
      .reduce((s, e) => s + Math.abs(Number(e.amount)), 0) / 100;

  const lines: string[] = [];
  lines.push(`${greeting}! Here's your daily briefing.`);
  lines.push("");

  // Tasks summary
  lines.push("\u{1F4CB} **Tasks**");
  if (overdueTasks.length > 0) {
    lines.push(
      `⚠ ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? "s" : ""}`,
    );
  }
  if (todayTasks.length > 0) {
    lines.push(`Today: ${todayTasks.map((t) => t.title).join(", ")}`);
  } else if (pendingTasks.length > 0) {
    lines.push(
      `${pendingTasks.length} pending task${pendingTasks.length > 1 ? "s" : ""}`,
    );
  } else {
    lines.push("No pending tasks — great work!");
  }
  if (highPriority.length > 0) {
    lines.push(
      `🔴 High priority: ${highPriority
        .slice(0, 3)
        .map((t) => t.title)
        .join(", ")}`,
    );
  }

  // Finance summary
  lines.push("");
  lines.push("\u{1F4B0} **Finance (this month)**");
  lines.push(
    `Income: ${formatCurrency(income * 100)} | Expenses: ${formatCurrency(expenses * 100)} | Balance: ${formatCurrency((income - expenses) * 100)}`,
  );

  lines.push("");
  lines.push("Have a productive day!");

  return lines.join("\n");
}

/**
 * Work mode: highlight priority tasks
 */
export function getWorkModeRoutine(tasks: Task[]): string {
  const pending = tasks.filter((t) => !t.completed);
  const high = pending.filter((t) => t.priority === "High");
  const medium = pending.filter((t) => t.priority === "Medium");
  const overdue = pending.filter(
    (t) => t.deadline && Number(t.deadline) / 1_000_000 < Date.now(),
  );

  const lines: string[] = [];
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

/**
 * End-of-day review: completed tasks + expense summary
 */
export function getEveningRoutine(
  tasks: Task[],
  financeEntries: FinanceEntry[],
): string {
  const today = todayMs();
  const todayEnd = today + 86400000;

  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);

  const todayExpenses = financeEntries.filter(
    (e) =>
      Number(e.entryDate) / 1_000_000 >= today &&
      Number(e.entryDate) / 1_000_000 < todayEnd &&
      Number(e.amount) < 0,
  );
  const totalSpentToday =
    todayExpenses.reduce((s, e) => s + Math.abs(Number(e.amount)), 0) / 100;

  const lines: string[] = [];
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
    `💸 **Today's expenses:** ${formatCurrency(totalSpentToday * 100)}`,
  );
  if (todayExpenses.length > 0) {
    for (const e of todayExpenses.slice(0, 3)) {
      lines.push(
        `  • ${e.description}: ${formatCurrency(Math.abs(Number(e.amount)))}`,
      );
    }
  }

  lines.push("");
  lines.push("Good work today. Rest well!");

  return lines.join("\n");
}
