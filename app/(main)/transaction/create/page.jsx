import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

import { getUserAccounts } from "@/actions/dashboard";
import { getTransaction } from "@/actions/transaction";
import { defaultCategories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddTransactionForm } from "../_components/transaction-form";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const editId = searchParams?.edit;
  const initialData = editId ? await getTransaction(editId) : null;
  const editMode = Boolean(editId && initialData);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-3 mb-4"><Link href="/dashboard"><ArrowLeft /> Back to dashboard</Link></Button>
        <p className="text-sm font-medium text-primary">{editMode ? "Update a record" : "New record"}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{editMode ? "Edit transaction" : "Add transaction"}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Capture the details while they are fresh. You can always refine them later.</p>
      </div>

      {accounts.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center p-8 text-center sm:p-12"><span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Plus /></span><h2 className="mt-4 text-lg font-semibold">Create an account first</h2><p className="mt-1 max-w-sm text-sm text-muted-foreground">Transactions need an account to belong to. Add your first account from the dashboard, then come back here.</p><Button asChild className="mt-5"><Link href="/dashboard">Go to dashboard</Link></Button></CardContent></Card>
      ) : (
        <Card><CardContent className="p-5 sm:p-8"><AddTransactionForm accounts={accounts} categories={defaultCategories} editMode={editMode} initialData={initialData} /></CardContent></Card>
      )}
    </div>
  );
}
