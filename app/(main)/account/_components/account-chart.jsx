"use client";

import { useMemo, useState } from "react";
import { format, startOfDay, subDays } from "date-fns";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DATE_RANGES = {
  "7D": { label: "7 days", days: 7 },
  "1M": { label: "30 days", days: 30 },
  "3M": { label: "90 days", days: 90 },
  "6M": { label: "6 months", days: 180 },
  ALL: { label: "All time", days: null },
};

const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export function AccountChart({ transactions = [] }) {
  const [dateRange, setDateRange] = useState("1M");
  const range = DATE_RANGES[dateRange];

  const { data, totals } = useMemo(() => {
    const now = new Date();
    const earliestTransaction = transactions.length
      ? Math.min(...transactions.map((transaction) => new Date(transaction.date).getTime()))
      : now.getTime();
    const requestedStart = range.days
      ? startOfDay(subDays(now, range.days - 1))
      : startOfDay(new Date(earliestTransaction));
    const start = range.days || now - requestedStart <= 365 * 86400000
      ? requestedStart
      : startOfDay(subDays(now, 364));
    const days = [];
    const dayCount = Math.min(365, Math.max(1, Math.ceil((now - start) / 86400000)) + 1);

    for (let index = 0; index < dayCount; index += 1) {
      const date = startOfDay(new Date(start.getTime() + index * 86400000));
      days.push({ key: date.toISOString().slice(0, 10), date, income: 0, expense: 0 });
    }

    const byDay = new Map(days.map((day) => [day.key, day]));
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      if (date < start || date > now) return;
      const day = byDay.get(startOfDay(date).toISOString().slice(0, 10));
      if (day) day[transaction.type === "INCOME" ? "income" : "expense"] += transaction.amount;
    });

    const totals = days.reduce((result, day) => ({ income: result.income + day.income, expense: result.expense + day.expense }), { income: 0, expense: 0 });
    return { data: days.map((day) => ({ ...day, label: format(day.date, range.days && range.days > 90 ? "MMM d" : "MMM d") })), totals };
  }, [range.days, transactions]);

  return (
    <Card className="gap-5 border-0 py-0 shadow-none">
      <CardHeader className="flex flex-col gap-3 px-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base">Transaction overview</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Income and expenses over time.</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full sm:w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>{Object.entries(DATE_RANGES).map(([key, item]) => <SelectItem key={key} value={key}>{item.label}</SelectItem>)}</SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-0">
        <div className="mb-5 grid grid-cols-3 gap-3 border-y border-border/60 py-4">
          <ChartStat label="Income" value={money(totals.income)} tone="text-success" />
          <ChartStat label="Expenses" value={money(totals.expense)} tone="text-destructive" />
          <ChartStat label="Net" value={money(totals.income - totals.expense)} tone={totals.income >= totals.expense ? "text-success" : "text-destructive"} />
        </div>
        {transactions.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">Transactions will appear here once you add them.</div>
        ) : (
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} minTickGap={28} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={(value) => `$${value}`} width={55} />
                <Tooltip
                  labelFormatter={(label) => label}
                  formatter={(value, name) => [money(value), name === "income" ? "Income" : "Expenses"]}
                  contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.75rem", color: "var(--popover-foreground)" }}
                />
                <Line type="monotone" dataKey="income" name="income" stroke="var(--success)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="expense" name="expense" stroke="var(--destructive)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChartStat({ label, value, tone }) {
  return <div><p className="text-xs text-muted-foreground">{label}</p><p className={`mt-1 text-sm font-semibold ${tone}`}>{value}</p></div>;
}
