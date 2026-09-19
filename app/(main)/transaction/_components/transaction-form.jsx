"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import useFetch from "@/hooks/use-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";

export function AddTransactionForm({ accounts, categories, editMode = false, initialData = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = initialData?.id || searchParams.get("edit");
  const defaultAccount = accounts.find((account) => account.isDefault)?.id || accounts[0]?.id;

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: editMode && initialData ? {
      type: initialData.type,
      amount: String(initialData.amount),
      description: initialData.description || "",
      accountId: initialData.accountId,
      category: initialData.category,
      date: new Date(initialData.date),
      isRecurring: initialData.isRecurring,
      recurringInterval: initialData.recurringInterval || undefined,
    } : {
      type: "EXPENSE",
      amount: "",
      description: "",
      accountId: defaultAccount,
      category: undefined,
      date: new Date(),
      isRecurring: false,
      recurringInterval: undefined,
    },
  });

  const { loading, fn, data: result, error } = useFetch(editMode ? updateTransaction : createTransaction);
  const type = watch("type");
  const date = watch("date");
  const isRecurring = watch("isRecurring");
  const filteredCategories = categories.filter((category) => category.type === type);

  useEffect(() => {
    if (result?.success && !loading) {
      toast.success(editMode ? "Transaction updated" : "Transaction added");
      reset();
      router.push(`/account/${result.data.accountId}`);
    }
  }, [editMode, loading, reset, result, router]);

  useEffect(() => {
    if (error) toast.error(error.message || "Unable to save transaction");
  }, [error]);

  const onSubmit = (data) => {
    const payload = { ...data, amount: Number(data.amount) };
    if (editMode) fn(editId, payload);
    else fn(payload);
  };

  const handleScanComplete = (scannedData) => {
    if (!scannedData) return;
    if (scannedData.amount) setValue("amount", String(scannedData.amount), { shouldValidate: true });
    if (scannedData.date) setValue("date", new Date(scannedData.date), { shouldValidate: true });
    if (scannedData.description) setValue("description", scannedData.description, { shouldValidate: true });
    if (scannedData.category && filteredCategories.some((category) => category.id === scannedData.category)) setValue("category", scannedData.category, { shouldValidate: true });
    toast.success("Receipt details added — review before saving");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Type" error={errors.type}>
          <Select value={type} onValueChange={(value) => { setValue("type", value, { shouldValidate: true }); setValue("category", undefined, { shouldValidate: true }); }}>
            <SelectTrigger><SelectValue placeholder="Choose type" /></SelectTrigger>
            <SelectContent><SelectItem value="EXPENSE">Expense</SelectItem><SelectItem value="INCOME">Income</SelectItem></SelectContent>
          </Select>
        </Field>
        <Field label="Amount" error={errors.amount}>
          <div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span><Input type="number" min="0.01" step="0.01" placeholder="0.00" className="pl-7" {...register("amount")} /></div>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Account" error={errors.accountId}>
          <Select value={watch("accountId")} onValueChange={(value) => setValue("accountId", value, { shouldValidate: true })}>
            <SelectTrigger><SelectValue placeholder="Choose account" /></SelectTrigger>
            <SelectContent>{accounts.map((account) => <SelectItem key={account.id} value={account.id}>{account.name} · ${account.balance.toFixed(2)}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Category" error={errors.category}>
          <Select value={watch("category")} onValueChange={(value) => setValue("category", value, { shouldValidate: true })}>
            <SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
            <SelectContent>{filteredCategories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Date" error={errors.date}>
          <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-between font-normal", !date && "text-muted-foreground")}>{date ? format(date, "PPP") : "Pick a date"}<CalendarIcon className="size-4" /></Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={date} onSelect={(value) => setValue("date", value, { shouldValidate: true })} disabled={(value) => value > new Date() || value < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover>
        </Field>
        <Field label="Description" error={errors.description}>
          <Input placeholder="e.g. Weekly groceries" {...register("description")} />
        </Field>
      </div>

      <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
        <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold">Recurring transaction</p><p className="mt-1 text-xs text-muted-foreground">Automatically schedule the next occurrence.</p></div><Switch checked={isRecurring} onCheckedChange={(checked) => setValue("isRecurring", checked, { shouldValidate: true })} /></div>
      </div>
      {isRecurring && <Field label="Repeats" error={errors.recurringInterval}><Select value={watch("recurringInterval")} onValueChange={(value) => setValue("recurringInterval", value, { shouldValidate: true })}><SelectTrigger><SelectValue placeholder="Choose frequency" /></SelectTrigger><SelectContent><SelectItem value="DAILY">Daily</SelectItem><SelectItem value="WEEKLY">Weekly</SelectItem><SelectItem value="MONTHLY">Monthly</SelectItem><SelectItem value="YEARLY">Yearly</SelectItem></SelectContent></Select></Field>}

      <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading && <Loader2 className="animate-spin" />}{loading ? "Saving…" : editMode ? "Save changes" : "Add transaction"}</Button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return <div className="space-y-2"><label className="text-sm font-medium">{label}</label>{children}{error && <p className="text-xs text-destructive">{error.message}</p>}</div>;
}
