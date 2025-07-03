"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";

export function AddTransactionForm({
  accounts, 
  categories,
  editMode = false,
  initialData = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );


  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
      toast.success("Receipt scanned successfully");
    }
  };



  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Receipt Scanner - Only show in create mode */}
      {!editMode && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30">
          <ReceiptScanner onScanComplete={handleScanComplete} />
        </div>
      )}

      {/* Transaction Type */}
      <div className="space-y-3">
        <label className="text-base font-semibold text-foreground flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          Transaction Type
        </label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={type}
        >
          <SelectTrigger className="h-12 text-base border-2 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE" className="text-base py-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Expense</span>
              </div>
            </SelectItem>
            <SelectItem value="INCOME" className="text-base py-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Income</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-red-500"></span>
            {errors.type.message}
          </p>
        )}
      </div>

      {/* Amount and Account Row */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <label className="text-base font-semibold text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">$</span>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="h-12 pl-8 text-base border-2 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              {...register("amount")}
            />
          </div>
          {errors.amount && (
            <p className="text-sm text-red-500 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>
              {errors.amount.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-base font-semibold text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            Account
          </label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}
          >
            <SelectTrigger className="h-12 text-base border-2 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id} className="text-base py-3">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{account.name}</span>
                    <span className="text-muted-foreground ml-2">
                      ${parseFloat(account.balance).toFixed(2)}
                    </span>
                  </div>
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  variant="ghost"
                  className="relative flex w-full cursor-default select-none items-center rounded-lg py-3 pl-4 pr-2 text-base outline-none hover:bg-accent hover:text-accent-foreground border-t mt-2"
                >
                  <span className="mr-2">+</span> Create New Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-sm text-red-500 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>
              {errors.accountId.message}
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-3">
        <label className="text-base font-semibold text-foreground flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          Category
        </label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}
        >
          <SelectTrigger className="h-12 text-base border-2 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id} className="text-base py-3">
                <div className="flex items-center gap-3">
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-red-500"></span>
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Date and Description Row */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <label className="text-base font-semibold text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-12 w-full pl-4 text-left font-normal text-base border-2 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => setValue("date", date)}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-sm text-red-500 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>
              {errors.date.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-base font-semibold text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"></div>
            Description
          </label>
          <Input 
            placeholder="Enter transaction description..." 
            className="h-12 text-base border-2 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
            {...register("description")} 
          />
          {errors.description && (
            <p className="text-sm text-red-500 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* Recurring Toggle */}
      <div className="bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800 dark:to-indigo-900/20 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
        <div className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500"></div>
              <label className="text-base font-semibold text-foreground">Recurring Transaction</label>
            </div>
            <div className="text-sm text-muted-foreground">
              Set up automatic recurring schedule for this transaction
            </div>
          </div>
          <Switch
            checked={isRecurring}
            onCheckedChange={(checked) => setValue("isRecurring", checked)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-600 data-[state=checked]:to-purple-600"
          />
        </div>
      </div>

      {/* Recurring Interval */}
      {isRecurring && (
        <div className="space-y-3 animate-fade-in-up">
          <label className="text-base font-semibold text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
            Recurring Interval
          </label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger className="h-12 text-base border-2 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
              <SelectValue placeholder="Select recurring frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY" className="text-base py-3">
                <div className="flex items-center gap-3">
                  <span>📅</span>
                  <span>Daily</span>
                </div>
              </SelectItem>
              <SelectItem value="WEEKLY" className="text-base py-3">
                <div className="flex items-center gap-3">
                  <span>🗓️</span>
                  <span>Weekly</span>
                </div>
              </SelectItem>
              <SelectItem value="MONTHLY" className="text-base py-3">
                <div className="flex items-center gap-3">
                  <span>📊</span>
                  <span>Monthly</span>
                </div>
              </SelectItem>
              <SelectItem value="YEARLY" className="text-base py-3">
                <div className="flex items-center gap-3">
                  <span>📈</span>
                  <span>Yearly</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-sm text-red-500 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-12 text-base font-medium"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300" 
          disabled={transactionLoading}
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            <>
              <span className="mr-2"></span>
              Update Transaction
            </>
          ) : (
            <>
              <span className="mr-2"></span>
              Create Transaction
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
