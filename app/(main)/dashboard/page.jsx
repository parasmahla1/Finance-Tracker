import { getDashboardData, getUserAccounts } from "@/actions/dashboard";

import { CreateAccountDrawer } from "@/components/create-account-drawer";

import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AccountCard } from "./_components/account-card";
import { getCurrentBudget } from "@/actions/budget";
import { BudgetProgress } from "./_components/budget-progress";
import { Suspense } from "react";
import { DashboardOverview } from "./_components/transaction-overview";
 
export default async function DashboardPage() {
    // const accounts = await getUserAccounts();
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);
  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  return (
    <div className="space-y-8 px-4 md:px-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
            Financial Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back! Here's what's happening with your money today.
          </p>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/30">
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      </div>

      {/* Dashboard Overview */}
      <Suspense fallback={<div className="animate-pulse bg-muted rounded-2xl h-64"></div>}>
        <DashboardOverview
          accounts={accounts}
          transactions={transactions || []}
        />
      </Suspense>

      {/* Accounts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Your Accounts</h2>
          <p className="text-muted-foreground">{accounts?.length || 0} accounts</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CreateAccountDrawer>
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-dashed border-muted-foreground/30 hover:border-indigo-400 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-800 dark:to-indigo-900/20 group">
              <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-8 pb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-lg font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Add New Account</p>
                <p className="text-sm text-muted-foreground mt-1">Track another financial account</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>
          {accounts.length > 0 &&
            accounts?.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
        </div>
      </div>
    </div>
  );
}
