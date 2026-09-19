import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Plus, WalletCards } from "lucide-react";

import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AccountCard } from "./_components/account-card";
import { DashboardContent } from "./_components/dashboard-content";

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default async function DashboardPage() {
  const [accounts = [], transactions = []] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);
  const defaultAccount = accounts.find((account) => account.isDefault);
  const budgetData = defaultAccount
    ? await getCurrentBudget(defaultAccount.id)
    : null;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthTransactions = transactions.filter(
    (transaction) => new Date(transaction.date) >= monthStart
  );
  const monthIncome = monthTransactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const monthExpenses = monthTransactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const savingsRate = monthIncome > 0
    ? Math.round(((monthIncome - monthExpenses) / monthIncome) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">Overview</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Good to see you.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Keep an eye on your balances, spending, and the decisions that move you forward.
          </p>
        </div>
        <Button asChild>
          <Link href="/transaction/create">
            <Plus />
            Add transaction
          </Link>
        </Button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total balance" value={money(totalBalance)} icon={WalletCards} tone="primary" />
        <SummaryCard label="Income this month" value={money(monthIncome)} icon={ArrowUpRight} tone="success" />
        <SummaryCard label="Spent this month" value={money(monthExpenses)} icon={ArrowDownRight} tone="danger" />
        <SummaryCard label="Savings rate" value={`${savingsRate}%`} icon={ArrowUpRight} tone="warning" detail="Monthly income less expenses" />
      </section>

      <DashboardContent
        accounts={accounts}
        transactions={transactions}
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
      />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Your accounts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {accounts.length ? `${accounts.length} connected account${accounts.length === 1 ? "" : "s"}` : "Start by adding an account"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CreateAccountDrawer>
            <Card className="min-h-52 cursor-pointer border-dashed transition-colors hover:border-primary/60 hover:bg-accent/40">
              <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Plus />
                </span>
                <p className="font-semibold">Add an account</p>
                <p className="mt-1 text-sm text-muted-foreground">Checking, savings, or another wallet.</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>
          {accounts.map((account) => <AccountCard key={account.id} account={account} />)}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, tone, detail }) {
  const toneClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success-muted text-success",
    danger: "bg-destructive/10 text-destructive",
    warning: "bg-warning-muted text-warning",
  };

  return (
    <Card className="gap-4 py-5">
      <CardContent className="px-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-muted-foreground">{label}</p>
          <span className={`flex size-8 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
            <Icon className="size-4" />
          </span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
        {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
      </CardContent>
    </Card>
  );
}
