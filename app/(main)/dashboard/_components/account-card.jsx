"use client";

import Link from "next/link";
import { CreditCard, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { updateDefaultAccount } from "@/actions/account";
import useFetch from "@/hooks/use-fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault, _count } = account;
  const { loading, fn, data, error } = useFetch(updateDefaultAccount);

  useEffect(() => {
    if (data?.success) toast.success("Default account updated");
    if (data && !data.success) toast.error(data.error || "Unable to update default account");
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error.message || "Unable to update default account");
  }, [error]);

  const handleDefaultChange = async (checked) => {
    if (!checked || isDefault) {
      toast.message("Keep one default account selected to speed up entry.");
      return;
    }
    await fn(id);
  };

  return (
    <Card className="gap-0 overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 px-5 pb-4">
        <Link href={`/account/${id}`} className="group flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-semibold group-hover:text-primary">{name}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {type === "SAVINGS" ? "Savings" : "Current"} account
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Default</span>
          <Switch checked={isDefault} onCheckedChange={handleDefaultChange} disabled={loading} aria-label={`Set ${name} as default`} />
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <p className="text-2xl font-semibold tracking-tight">{money(balance)}</p>
        <p className="mt-1 text-sm text-muted-foreground">{_count?.transactions || 0} transactions</p>
      </CardContent>
      <CardFooter className="justify-between border-t border-border/70 px-5 py-3">
        <span className={isDefault ? "text-xs font-medium text-primary" : "text-xs text-muted-foreground"}>
          {isDefault ? "Primary account" : "Not selected"}
        </span>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/account/${id}`}>
            View account <ExternalLink className="size-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
