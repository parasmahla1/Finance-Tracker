"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

import { categoryColors } from "@/data/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const labelFor = (value) => value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export function DashboardOverview({ accounts = [], transactions = [], budgetAmount = 0, budgetExpenses = 0 }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((account) => account.isDefault)?.id || accounts[0]?.id || "all"
  );
  const currentMonth = new Date();

  const accountTransactions = useMemo(
    () => transactions.filter((transaction) => selectedAccountId === "all" || transaction.accountId === selectedAccountId),
    [selectedAccountId, transactions]
  );

  const recentTransactions = useMemo(
    () => [...accountTransactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6),
    [accountTransactions]
  );

  const categoryData = useMemo(() => {
    const totals = accountTransactions
      .filter((transaction) => {
        const date = new Date(transaction.date);
        return transaction.type === "EXPENSE" && date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear();
      })
      .reduce((result, transaction) => {
        result[transaction.category] = (result[transaction.category] || 0) + transaction.amount;
        return result;
      }, {});

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [accountTransactions, currentMonth]);

  const expenseTotal = categoryData.reduce((sum, item) => sum + item.value, 0);
  const budgetPercent = budgetAmount > 0 ? (budgetExpenses / budgetAmount) * 100 : 0;
  const budgetProgress = Math.min(100, Math.max(0, budgetPercent));
  const budgetRemaining = Math.max(0, budgetAmount - budgetExpenses);
  const visibleCategories = categoryData.slice(0, 5);
  const otherTotal = categoryData.slice(5).reduce((sum, item) => sum + item.value, 0);
  if (otherTotal > 0) visibleCategories.push({ name: "other", value: otherTotal });

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="min-w-0 overflow-hidden">
        <CardHeader className="flex flex-col gap-3 border-b border-border/70 px-5 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Recent activity</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">The latest movement across your accounts.</p>
          </div>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-full sm:w-[170px]"><SelectValue placeholder="Select account" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All accounts</SelectItem>
              {accounts.map((account) => <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          {recentTransactions.length === 0 ? (
            <EmptyState title="No transactions yet" detail="Add your first transaction to see activity here." />
          ) : (
            <>
              <div className="hidden grid-cols-[minmax(0,1fr)_120px_120px] gap-4 border-b border-border/60 bg-muted/20 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:grid"><span>Description</span><span>Date</span><span className="text-right">Amount</span></div>
              <div className="divide-y divide-border/60">
                {recentTransactions.map((transaction) => {
                  const isIncome = transaction.type === "INCOME";
                  return (
                    <div key={transaction.id} className="grid gap-3 px-5 py-3.5 transition-colors hover:bg-muted/20 sm:grid-cols-[minmax(0,1fr)_120px_120px] sm:items-center sm:gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", isIncome ? "bg-success-muted text-success" : "bg-destructive/10 text-destructive")}>
                          {isIncome ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{transaction.description || "Untitled transaction"}</p>
                          <span className="mt-1 inline-flex rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:hidden">{labelFor(transaction.category)}</span>
                        </div>
                      </div>
                      <p className="pl-11 text-xs text-muted-foreground sm:pl-0">{format(new Date(transaction.date), "MMM d, yyyy")}<span className="ml-2 sm:hidden">· {labelFor(transaction.category)}</span></p>
                      <p className={cn("pl-11 text-sm font-semibold sm:pl-0 sm:text-right", isIncome ? "text-success" : "text-foreground")}>
                        {isIncome ? "+" : "−"}{money(transaction.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader className="px-5 pb-0">
          <div className="flex items-start justify-between gap-4"><div><CardTitle className="text-base">Spending this month</CardTitle><p className="mt-1 text-sm text-muted-foreground">A ranked view of your expense categories.</p></div><div className="text-right"><p className="text-lg font-semibold tracking-tight">{money(expenseTotal)}</p><p className="text-[11px] text-muted-foreground">Total expenses</p></div></div>
        </CardHeader>
          <CardContent className="space-y-6 px-5 pt-6">
          {budgetAmount > 0 && (
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium">Monthly budget</span>
                <span className="text-muted-foreground">{money(budgetExpenses)} of {money(budgetAmount)}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", budgetPercent >= 100 ? "bg-destructive" : budgetPercent >= 75 ? "bg-warning" : "bg-success")}
                  style={{ width: `${budgetProgress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{budgetRemaining > 0 ? `${money(budgetRemaining)} remaining` : "Budget reached"}</span>
                <span>{budgetPercent.toFixed(0)}% used</span>
              </div>
            </div>
          )}
          {categoryData.length === 0 ? (
            <EmptyState title="No spending to break down" detail="Expenses will appear here as you record them." />
          ) : (
            <div className="space-y-5">
              {visibleCategories.map((item) => {
                const percentage = expenseTotal ? (item.value / expenseTotal) * 100 : 0;
                const color = item.name === "other" ? "var(--muted-foreground)" : categoryColors[item.name] || "var(--chart-2)";
                return <div key={item.name} className="space-y-2"><div className="flex items-center justify-between gap-3 text-sm"><span className="flex min-w-0 items-center gap-2 font-medium"><i className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} /> <span className="truncate">{labelFor(item.name)}</span></span><span className="shrink-0 font-semibold">{money(item.value)}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }} /></div><p className="text-right text-[11px] text-muted-foreground">{percentage.toFixed(0)}% of spending</p></div>;
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({ title, detail }) {
  return <div className="flex min-h-48 flex-col items-center justify-center px-5 text-center"><p className="text-sm font-medium">{title}</p><p className="mt-1 max-w-xs text-xs text-muted-foreground">{detail}</p></div>;
}
