import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Loader2,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  type FinanceEntry,
  useAddFinanceEntry,
  useDeleteFinanceEntry,
  useFinanceEntries,
} from "../hooks/useQueries";

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
];
const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getEntryMonth(entry: FinanceEntry): string {
  const d = new Date(Number(entry.entryDate) / 1_000_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const d = new Date(Number(y), Number(m) - 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function FinancePage() {
  const { data: entries = [], isLoading } = useFinanceEntries();
  const addEntry = useAddFinanceEntry();
  const deleteEntry = useDeleteFinanceEntry();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

  const allMonths = useMemo(() => {
    const months = new Set(entries.map(getEntryMonth));
    months.add(currentMonthKey);
    return Array.from(months).sort().reverse();
  }, [entries, currentMonthKey]);

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);

  const filteredEntries = useMemo(
    () =>
      entries
        .filter((e) => getEntryMonth(e) === selectedMonth)
        .sort((a, b) => Number(b.entryDate - a.entryDate)),
    [entries, selectedMonth],
  );

  const totalIncome = useMemo(
    () =>
      entries
        .filter((e) => e.amount > 0n)
        .reduce((s, e) => s + Number(e.amount), 0) / 100,
    [entries],
  );
  const totalExpenses = useMemo(
    () =>
      entries
        .filter((e) => e.amount < 0n)
        .reduce((s, e) => s + Math.abs(Number(e.amount)), 0) / 100,
    [entries],
  );
  const balance = totalIncome - totalExpenses;
  const thisMonthCount = useMemo(
    () => entries.filter((e) => getEntryMonth(e) === allMonths[0]).length,
    [entries, allMonths],
  );

  const categoryBreakdown = useMemo(() => {
    const expenses = filteredEntries.filter((e) => e.amount < 0n);
    const totals: Record<string, number> = {};
    for (const e of expenses) {
      totals[e.category] =
        (totals[e.category] || 0) + Math.abs(Number(e.amount)) / 100;
    }
    const totalExp = Object.values(totals).reduce((s, v) => s + v, 0);
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, val]) => ({
        cat,
        val,
        pct: totalExp > 0 ? (val / totalExp) * 100 : 0,
      }));
  }, [filteredEntries]);

  const djSummary = useMemo(() => {
    const monthIncome =
      filteredEntries
        .filter((e) => e.amount > 0n)
        .reduce((s, e) => s + Number(e.amount), 0) / 100;
    const monthExpense =
      filteredEntries
        .filter((e) => e.amount < 0n)
        .reduce((s, e) => s + Math.abs(Number(e.amount)), 0) / 100;
    const topCat = categoryBreakdown[0]?.cat || "N/A";
    if (filteredEntries.length === 0)
      return "No transactions recorded for this month yet.";
    return `This month you earned ${formatCurrency(monthIncome)} and spent ${formatCurrency(monthExpense)}. Your top spending category is ${topCat}. Net: ${formatCurrency(monthIncome - monthExpense)}.`;
  }, [filteredEntries, categoryBreakdown]);

  const handleAdd = async () => {
    const amtNum = Number.parseFloat(amount);
    if (!amount || Number.isNaN(amtNum) || amtNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      const amountBigint =
        BigInt(Math.round(amtNum * 100)) * (type === "expense" ? -1n : 1n);
      const entryDateBigint = BigInt(new Date(date).getTime()) * 1_000_000n;
      await addEntry.mutateAsync({
        amount: amountBigint,
        category,
        description,
        entryDate: entryDateBigint,
      });
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().slice(0, 10));
      toast.success(`${type === "income" ? "Income" : "Expense"} recorded`);
    } catch {
      toast.error("Failed to record transaction");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteEntry.mutateAsync(id);
      toast.success("Transaction deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Layout>
      <div className="container mx-auto space-y-6 px-4 py-8">
        <div className="flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-primary" />
          <h1 className="glow-text font-display text-3xl font-bold">
            Finance Tracker
          </h1>
        </div>

        {/* DJ Summary */}
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="py-4">
            <p className="mb-1 text-sm font-medium text-primary">
              DJ's Financial Summary
            </p>
            <p className="text-sm text-muted-foreground">{djSummary}</p>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            data-ocid="finance.card"
            className={`border-2 ${
              balance >= 0
                ? "border-green-500/40 bg-green-500/5"
                : "border-destructive/40 bg-destructive/5"
            }`}
          >
            <CardContent className="py-4">
              <p className="text-xs text-muted-foreground">Total Balance</p>
              <p
                className={`font-display text-2xl font-bold ${balance >= 0 ? "text-green-400" : "text-destructive"}`}
              >
                {formatCurrency(balance)}
              </p>
            </CardContent>
          </Card>
          <Card
            data-ocid="finance.card"
            className="border-green-500/30 bg-green-500/5"
          >
            <CardContent className="flex items-start justify-between py-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Income</p>
                <p className="font-display text-2xl font-bold text-green-400">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <TrendingUp className="mt-1 h-5 w-5 text-green-400" />
            </CardContent>
          </Card>
          <Card
            data-ocid="finance.card"
            className="border-destructive/30 bg-destructive/5"
          >
            <CardContent className="flex items-start justify-between py-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Expenses</p>
                <p className="font-display text-2xl font-bold text-destructive">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <TrendingDown className="mt-1 h-5 w-5 text-destructive" />
            </CardContent>
          </Card>
          <Card data-ocid="finance.card" className="border-primary/30">
            <CardContent className="py-4">
              <p className="text-xs text-muted-foreground">
                Transactions (This Month)
              </p>
              <p className="font-display text-2xl font-bold text-primary">
                {thisMonthCount}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add Transaction Form */}
        <Card className="glow-border border-primary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Plus className="h-5 w-5 text-primary" /> Add Transaction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                data-ocid="finance.toggle"
                variant={type === "income" ? "default" : "outline"}
                onClick={() => {
                  setType("income");
                  setCategory("Other");
                }}
                className={
                  type === "income"
                    ? "flex-1 bg-green-600 text-white hover:bg-green-700"
                    : "flex-1 border-green-600/50 text-green-400 hover:bg-green-600/10"
                }
              >
                <TrendingUp className="mr-2 h-4 w-4" /> Income
              </Button>
              <Button
                data-ocid="finance.toggle"
                variant={type === "expense" ? "default" : "outline"}
                onClick={() => {
                  setType("expense");
                  setCategory("Other");
                }}
                className={
                  type === "expense"
                    ? "flex-1 bg-destructive hover:bg-destructive/80"
                    : "flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                }
              >
                <TrendingDown className="mr-2 h-4 w-4" /> Expense
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Amount ($)</Label>
                <Input
                  data-ocid="finance.input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger data-ocid="finance.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input
                  data-ocid="finance.input"
                  placeholder="What was this for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input
                  data-ocid="finance.input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="[color-scheme:dark]"
                />
              </div>
            </div>

            <Button
              data-ocid="finance.primary_button"
              onClick={handleAdd}
              disabled={addEntry.isPending}
              className="w-full bg-primary hover:bg-primary/80 sm:w-auto"
            >
              {addEntry.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Record Transaction
            </Button>
          </CardContent>
        </Card>

        {/* Month Filter + Transactions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold">Transactions</h2>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger data-ocid="finance.select" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allMonths.map((m) => (
                <SelectItem key={m} value={m}>
                  {formatMonth(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div
            data-ocid="finance.loading_state"
            className="py-12 text-center text-muted-foreground"
          >
            Loading transactions...
          </div>
        ) : filteredEntries.length === 0 ? (
          <div data-ocid="finance.empty_state" className="py-16 text-center">
            <DollarSign className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">
              No transactions for {formatMonth(selectedMonth)}.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEntries.map((entry, idx) => {
              const isIncome = entry.amount > 0n;
              const displayAmount = Math.abs(Number(entry.amount)) / 100;
              const entryDateMs = Number(entry.entryDate) / 1_000_000;
              return (
                <Card
                  key={entry.id.toString()}
                  data-ocid={`finance.item.${idx + 1}`}
                  className="border-primary/20 transition-all hover:border-primary/40"
                >
                  <CardContent className="flex items-center gap-4 py-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isIncome ? "bg-green-500/15" : "bg-destructive/15"
                      }`}
                    >
                      {isIncome ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {entry.description || entry.category}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <Badge className="border border-muted-foreground/30 bg-muted text-xs text-muted-foreground">
                          {entry.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entryDateMs).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-sm font-semibold ${
                        isIncome ? "text-green-400" : "text-destructive"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(displayAmount)}
                    </span>
                    <Button
                      data-ocid={`finance.delete_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(entry.id)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {categoryBreakdown.length > 0 && (
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="font-display text-lg">
                Spending Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryBreakdown.map(({ cat, val, pct }) => (
                <div key={cat}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">{cat}</span>
                    <span className="font-medium">
                      {formatCurrency(val)}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({pct.toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="h-4" />
      </div>
    </Layout>
  );
}
