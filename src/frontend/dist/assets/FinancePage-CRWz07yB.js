import { g as useFinanceEntries, o as useContextEngine, X as useAddFinanceEntry, Y as useDeleteFinanceEntry, r as reactExports, j as jsxRuntimeExports, k as ue } from "./index-D4lUgCCM.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-D6TXgbbC.js";
import { B as Badge } from "./badge-BMXMPn3_.js";
import { c as createLucideIcon, B as Button } from "./createLucideIcon-a11X8bAo.js";
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle } from "./card-iyETJf1A.js";
import { I as Input } from "./input-CqaNZ_b9.js";
import { L as Label } from "./label-Bf9_XisY.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C5iF8xTu.js";
import { L as Layout } from "./Layout-y-fTRwTO.js";
import { T as TrendingUp, a as TrendingDown } from "./trending-up-BvVn1384.js";
import { P as Plus } from "./plus-D6lHqroT.js";
import { L as LoaderCircle } from "./loader-circle-Tr-8VCUp.js";
import { T as Trash2 } from "./trash-2-BvljEyqY.js";
import "./index-DREpW-Gk.js";
import "./proxy-CDDWEtkX.js";
import "./index-IXOTxK3N.js";
import "./index-Cj4N10C2.js";
import "./chevron-up-QZ-Q9T3F.js";
import "./check-CyKGSNZc.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 3h12", key: "ggurg9" }],
  ["path", { d: "M6 8h12", key: "6g4wlu" }],
  ["path", { d: "m6 13 8.5 8", key: "u1kupk" }],
  ["path", { d: "M6 13h3", key: "wdp6ag" }],
  ["path", { d: "M9 13c6.667 0 6.667-10 0-10", key: "1nkvk2" }]
];
const IndianRupee = createLucideIcon("indian-rupee", __iconNode);
const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other"
];
const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Other"
];
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount);
}
function getEntryMonth(entry) {
  const d = new Date(Number(entry.entryDate) / 1e6);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function formatMonth(ym) {
  const [y, m] = ym.split("-");
  const d = new Date(Number(y), Number(m) - 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
function FinancePage() {
  const { data: entries = [], isLoading } = useFinanceEntries();
  const { logAction } = useContextEngine();
  const addEntry = useAddFinanceEntry();
  const deleteEntry = useDeleteFinanceEntry();
  const [type, setType] = reactExports.useState("expense");
  const [deleteEntryId, setDeleteEntryId] = reactExports.useState(null);
  const [amount, setAmount] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("Other");
  const [description, setDescription] = reactExports.useState("");
  const [date, setDate] = reactExports.useState(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const currentMonthKey = `${(/* @__PURE__ */ new Date()).getFullYear()}-${String((/* @__PURE__ */ new Date()).getMonth() + 1).padStart(2, "0")}`;
  const allMonths = reactExports.useMemo(() => {
    const months = new Set(entries.map(getEntryMonth));
    months.add(currentMonthKey);
    return Array.from(months).sort().reverse();
  }, [entries, currentMonthKey]);
  const [selectedMonth, setSelectedMonth] = reactExports.useState(currentMonthKey);
  const filteredEntries = reactExports.useMemo(
    () => entries.filter((e) => getEntryMonth(e) === selectedMonth).sort((a, b) => Number(b.entryDate - a.entryDate)),
    [entries, selectedMonth]
  );
  const totalIncome = reactExports.useMemo(
    () => entries.filter((e) => e.amount > 0n).reduce((s, e) => s + Number(e.amount), 0) / 100,
    [entries]
  );
  const totalExpenses = reactExports.useMemo(
    () => entries.filter((e) => e.amount < 0n).reduce((s, e) => s + Math.abs(Number(e.amount)), 0) / 100,
    [entries]
  );
  const balance = totalIncome - totalExpenses;
  const thisMonthCount = reactExports.useMemo(
    () => entries.filter((e) => getEntryMonth(e) === allMonths[0]).length,
    [entries, allMonths]
  );
  const categoryBreakdown = reactExports.useMemo(() => {
    const expenses = filteredEntries.filter((e) => e.amount < 0n);
    const totals = {};
    for (const e of expenses) {
      totals[e.category] = (totals[e.category] || 0) + Math.abs(Number(e.amount)) / 100;
    }
    const totalExp = Object.values(totals).reduce((s, v) => s + v, 0);
    return Object.entries(totals).sort((a, b) => b[1] - a[1]).map(([cat, val]) => ({
      cat,
      val,
      pct: totalExp > 0 ? val / totalExp * 100 : 0
    }));
  }, [filteredEntries]);
  const djSummary = reactExports.useMemo(() => {
    var _a;
    const monthIncome = filteredEntries.filter((e) => e.amount > 0n).reduce((s, e) => s + Number(e.amount), 0) / 100;
    const monthExpense = filteredEntries.filter((e) => e.amount < 0n).reduce((s, e) => s + Math.abs(Number(e.amount)), 0) / 100;
    const topCat = ((_a = categoryBreakdown[0]) == null ? void 0 : _a.cat) || "N/A";
    if (filteredEntries.length === 0)
      return "No transactions recorded for this month yet.";
    return `This month you earned ${formatCurrency(monthIncome)} and spent ${formatCurrency(monthExpense)}. Your top spending category is ${topCat}. Net: ${formatCurrency(monthIncome - monthExpense)}.`;
  }, [filteredEntries, categoryBreakdown]);
  const handleAdd = async () => {
    const amtNum = Number.parseFloat(amount);
    if (!amount || Number.isNaN(amtNum) || amtNum <= 0) {
      ue.error("Please enter a valid amount");
      return;
    }
    try {
      const amountBigint = BigInt(Math.round(amtNum * 100)) * (type === "expense" ? -1n : 1n);
      const entryDateBigint = BigInt(new Date(date).getTime()) * 1000000n;
      await addEntry.mutateAsync({
        amount: amountBigint,
        category,
        description,
        entryDate: entryDateBigint
      });
      setAmount("");
      setDescription("");
      setDate((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
      logAction("finance_entry_added", category);
      ue.success(`${type === "income" ? "Income" : "Expense"} recorded`);
    } catch {
      ue.error("Failed to record transaction");
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteEntry.mutateAsync(id);
      ue.success("Transaction deleted");
    } catch {
      ue.error(
        "I'm having trouble deleting that transaction. Please try again."
      );
    } finally {
      setDeleteEntryId(null);
    }
  };
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto space-y-6 px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-8 w-8 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "glow-text font-display text-3xl font-bold", children: "Finance Tracker" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-primary/40 bg-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-sm font-medium text-primary", children: "DJ's Financial Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: djSummary })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            "data-ocid": "finance.card",
            className: `border-2 ${balance >= 0 ? "border-green-500/40 bg-green-500/5" : "border-destructive/40 bg-destructive/5"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Balance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `font-display text-2xl font-bold ${balance >= 0 ? "text-green-400" : "text-destructive"}`,
                  children: formatCurrency(balance)
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            "data-ocid": "finance.card",
            className: "border-green-500/30 bg-green-500/5",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-start justify-between py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Income" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-green-400", children: formatCurrency(totalIncome) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "mt-1 h-5 w-5 text-green-400" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            "data-ocid": "finance.card",
            className: "border-destructive/30 bg-destructive/5",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-start justify-between py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Expenses" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-destructive", children: formatCurrency(totalExpenses) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "mt-1 h-5 w-5 text-destructive" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "finance.card", className: "border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Transactions (This Month)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-primary", children: thisMonthCount })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glow-border border-primary/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 text-primary" }),
          " Add Transaction"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "finance.toggle",
                variant: type === "income" ? "default" : "outline",
                onClick: () => {
                  setType("income");
                  setCategory("Other");
                },
                className: type === "income" ? "flex-1 bg-green-600 text-white hover:bg-green-700" : "flex-1 border-green-600/50 text-green-400 hover:bg-green-600/10",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "mr-2 h-4 w-4" }),
                  " Income"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "finance.toggle",
                variant: type === "expense" ? "default" : "outline",
                onClick: () => {
                  setType("expense");
                  setCategory("Other");
                },
                className: type === "expense" ? "flex-1 bg-destructive hover:bg-destructive/80" : "flex-1 border-destructive/50 text-destructive hover:bg-destructive/10",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "mr-2 h-4 w-4" }),
                  " Expense"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "finance.input",
                  type: "number",
                  min: "0",
                  step: "0.01",
                  placeholder: "0.00",
                  value: amount,
                  onChange: (e) => setAmount(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: category, onValueChange: setCategory, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "finance.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "finance.input",
                  placeholder: "What was this for?",
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && handleAdd()
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "finance.input",
                  type: "date",
                  value: date,
                  onChange: (e) => setDate(e.target.value),
                  className: "[color-scheme:dark]"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "finance.primary_button",
              onClick: handleAdd,
              disabled: addEntry.isPending,
              className: "w-full bg-primary hover:bg-primary/80 sm:w-auto",
              children: [
                addEntry.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                "Record Transaction"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Transactions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedMonth, onValueChange: setSelectedMonth, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "finance.select", className: "w-48", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: allMonths.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, children: formatMonth(m) }, m)) })
        ] })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "finance.loading_state",
          className: "py-12 text-center text-muted-foreground",
          children: "Loading transactions..."
        }
      ) : filteredEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "finance.empty_state", className: "py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "mx-auto mb-3 h-12 w-12 text-muted-foreground/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          "No transactions for ",
          formatMonth(selectedMonth),
          "."
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filteredEntries.map((entry, idx) => {
        const isIncome = entry.amount > 0n;
        const displayAmount = Math.abs(Number(entry.amount)) / 100;
        const entryDateMs = Number(entry.entryDate) / 1e6;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            "data-ocid": `finance.item.${idx + 1}`,
            className: "border-primary/20 transition-all hover:border-primary/40",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isIncome ? "bg-green-500/15" : "bg-destructive/15"}`,
                  children: isIncome ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-green-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-4 w-4 text-destructive" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: entry.description || entry.category }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border border-muted-foreground/30 bg-muted text-xs text-muted-foreground", children: entry.category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(entryDateMs).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `shrink-0 text-sm font-semibold ${isIncome ? "text-green-400" : "text-destructive"}`,
                  children: [
                    isIncome ? "+" : "-",
                    formatCurrency(displayAmount)
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `finance.delete_button.${idx + 1}`,
                  variant: "ghost",
                  size: "icon",
                  onClick: () => setDeleteEntryId(entry.id),
                  className: "min-h-[44px] min-w-[44px] shrink-0 text-muted-foreground hover:text-destructive",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                }
              )
            ] })
          },
          entry.id.toString()
        );
      }) }),
      categoryBreakdown.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg", children: "Spending Breakdown" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: categoryBreakdown.map(({ cat, val, pct }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: cat }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
              formatCurrency(val),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "(",
                pct.toFixed(1),
                "%)"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full bg-primary transition-all",
              style: { width: `${pct}%` }
            }
          ) })
        ] }, cat)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: deleteEntryId !== null,
        onOpenChange: (open) => {
          if (!open) setDeleteEntryId(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "finance.dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this transaction?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This action cannot be undone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogCancel,
              {
                "data-ocid": "finance.cancel_button",
                onClick: () => setDeleteEntryId(null),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                "data-ocid": "finance.confirm_button",
                onClick: () => deleteEntryId !== null && handleDelete(deleteEntryId),
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
  FinancePage
};
