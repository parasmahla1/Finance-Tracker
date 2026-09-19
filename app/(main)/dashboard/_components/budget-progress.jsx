"use client";

import { useEffect, useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import useFetch from "@/hooks/use-fetch";
import { updateBudget } from "@/actions/budget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export function BudgetProgress({ initialBudget, currentExpenses, onBudgetUpdated }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(initialBudget?.amount || 0);
  const [newBudget, setNewBudget] = useState(initialBudget?.amount?.toString() || "");
  const { loading, fn, data, error } = useFetch(updateBudget);

  useEffect(() => {
    const amount = initialBudget?.amount || 0;
    setBudgetAmount(amount);
    setNewBudget(amount ? amount.toString() : "");
  }, [initialBudget?.amount]);

  useEffect(() => {
    if (data?.success) {
      const amount = data.data.amount;
      setBudgetAmount(amount);
      setNewBudget(String(amount));
      setIsEditing(false);
      onBudgetUpdated?.(amount);
      toast.success("Budget updated");
      router.refresh();
    }
    if (data && !data.success) toast.error(data.error || "Unable to update budget");
    if (error) toast.error(error.message || "Unable to update budget");
  }, [data, error, router]);

  const percentUsed = budgetAmount > 0 ? (currentExpenses / budgetAmount) * 100 : 0;
  const progressValue = Math.min(100, Math.max(0, percentUsed));
  const remaining = Math.max(0, budgetAmount - currentExpenses);
  const status = percentUsed >= 100 ? "Over budget" : percentUsed >= 75 ? "Approaching limit" : "On track";
  const statusClass = percentUsed >= 100 ? "text-destructive" : percentUsed >= 75 ? "text-warning" : "text-success";

  const handleUpdateBudget = async () => {
    const amount = Number(newBudget);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a budget greater than zero");
      return;
    }
    await fn(amount);
  };

  const handleCancel = () => {
    setNewBudget(budgetAmount ? String(budgetAmount) : "");
    setIsEditing(false);
  };

  return (
    <Card className="gap-0 overflow-hidden">
      <CardHeader className="flex flex-col gap-4 px-5 pb-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2"><CardTitle className="text-base">Monthly budget</CardTitle>{budgetAmount > 0 && <span className={`rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold ${statusClass}`}>{status}</span>}</div>
          <p className="mt-1 text-sm text-muted-foreground">{budgetAmount > 0 ? `${money(currentExpenses)} spent of ${money(budgetAmount)}` : "Set a monthly limit to keep spending visible."}</p>
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2"><Input type="number" min="1" step="0.01" value={newBudget} onChange={(event) => setNewBudget(event.target.value)} className="w-32" placeholder="Amount" autoFocus disabled={loading} /><Button variant="ghost" size="icon" onClick={handleUpdateBudget} disabled={loading} aria-label="Save budget"><Check className="size-4 text-success" /></Button><Button variant="ghost" size="icon" onClick={handleCancel} disabled={loading} aria-label="Cancel budget edit"><X className="size-4 text-destructive" /></Button></div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}><Pencil className="size-3.5" /> {budgetAmount > 0 ? "Edit budget" : "Set budget"}</Button>
        )}
      </CardHeader>
      <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
        {budgetAmount > 0 && <><Progress value={progressValue} indicatorClassName={percentUsed >= 100 ? "bg-destructive" : percentUsed >= 75 ? "bg-warning" : "bg-success"} /><div className="mt-3 flex items-center justify-between gap-4 text-xs"><span className="text-muted-foreground">{money(remaining)} remaining</span><span className={`font-semibold ${statusClass}`}>{percentUsed.toFixed(0)}% used</span></div></>}
      </CardContent>
    </Card>
  );
}
