import Link from "next/link";
import { ArrowLeft, CreditCard, Plus } from "lucide-react";
import { notFound } from "next/navigation";

import { getAccountWithTransactions } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AccountChart } from "../_components/account-chart";
import { TransactionTable } from "../_components/transaction-table";

const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default async function AccountPage({ params }) {
  const accountData = await getAccountWithTransactions(params.id);
  if (!accountData) notFound();

  const { transactions, ...account } = accountData;
  const income = transactions.filter((item) => item.type === "INCOME").reduce((sum, item) => sum + item.amount, 0);
  const expenses = transactions.filter((item) => item.type === "EXPENSE").reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-3 mb-4">
          <Link href="/dashboard"><ArrowLeft /> Back to dashboard</Link>
        </Button>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><CreditCard /></span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{account.name}</h1>
                {account.isDefault && <Badge>Default</Badge>}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{account.type === "SAVINGS" ? "Savings" : "Current"} account · {transactions.length} transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="mr-2 text-right"><p className="text-xs text-muted-foreground">Current balance</p><p className="text-2xl font-semibold tracking-tight">{money(account.balance)}</p></div>
            <Button asChild><Link href="/transaction/create"><Plus /> Add transaction</Link></Button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Balance" value={money(account.balance)} />
        <Metric label="Income recorded" value={money(income)} tone="text-success" />
        <Metric label="Expenses recorded" value={money(expenses)} tone="text-destructive" />
      </div>

      <Card><CardContent className="p-5 sm:p-6"><AccountChart transactions={transactions} /></CardContent></Card>

      <section className="space-y-3">
        <div><h2 className="text-lg font-semibold tracking-tight">Transaction history</h2><p className="mt-1 text-sm text-muted-foreground">Search, filter, and manage activity in this account.</p></div>
        <Card><CardContent className="p-4 sm:p-6"><TransactionTable transactions={transactions} /></CardContent></Card>
      </section>
    </div>
  );
}

function Metric({ label, value, tone = "" }) {
  return <Card className="gap-2 py-4"><CardContent className="px-5"><p className="text-xs text-muted-foreground">{label}</p><p className={`mt-1 text-lg font-semibold ${tone}`}>{value}</p></CardContent></Card>;
}
