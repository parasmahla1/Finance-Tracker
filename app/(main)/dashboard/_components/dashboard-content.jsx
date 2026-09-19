"use client";

import { useState } from "react";

import { BudgetProgress } from "./budget-progress";
import { DashboardOverview } from "./transaction-overview";

export function DashboardContent({ accounts = [], transactions = [], initialBudget, currentExpenses = 0 }) {
  const [budgetAmount, setBudgetAmount] = useState(initialBudget?.amount || 0);

  return (
    <>
      <BudgetProgress
        initialBudget={initialBudget}
        currentExpenses={currentExpenses}
        onBudgetUpdated={setBudgetAmount}
      />
      <DashboardOverview
        accounts={accounts}
        transactions={transactions}
        budgetAmount={budgetAmount}
        budgetExpenses={currentExpenses}
      />
    </>
  );
}
