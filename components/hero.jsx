import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, CircleDollarSign, ShieldCheck, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary"><ShieldCheck className="size-3.5" /> Built for a calmer money routine</div>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl">Know where your money is going.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">WealthFlow brings accounts, transactions, budgets, and useful patterns into one focused workspace — without turning your finances into a spreadsheet.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button size="lg" asChild><Link href="/dashboard">Open your workspace <ArrowRight /></Link></Button><Button size="lg" variant="outline" asChild><a href="#features">See how it works</a></Button></div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> Multi-account tracking</span><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> Private by default</span><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> AI receipt capture</span></div>
        </div>
        <ProductPreview />
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <div className="relative isolate mx-auto w-full max-w-xl animate-fade-in-up">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-3xl motion-safe:animate-pulse" />
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
          <span className="size-2 rounded-full bg-destructive/70" />
          <span className="size-2 rounded-full bg-warning/70" />
          <span className="size-2 rounded-full bg-success/70" />
          <span className="ml-3 text-[11px] font-medium text-muted-foreground">wealthflow / overview</span>
        </div>
        <div className="grid gap-3 bg-muted/20 p-4 sm:grid-cols-[1.1fr_0.9fr] sm:p-5">
          <div className="space-y-3">
            <div className="rounded-xl border border-border/70 bg-card p-4 motion-safe:animate-fade-in-up">
              <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] text-muted-foreground">Total balance</p><p className="mt-1 text-2xl font-semibold tracking-tight">$12,480.00</p></div><span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><WalletCards className="size-4" /></span></div>
              <div className="mt-5 flex items-end gap-1.5" aria-hidden="true">{[32, 45, 38, 58, 52, 69, 62, 82, 76, 91].map((height, index) => <span key={index} className="flex-1 rounded-t-sm bg-primary/20 motion-safe:animate-fade-in-up" style={{ height: `${height}px`, animationDelay: `${index * 45}ms` }} />)}</div>
            </div>
            <div className="rounded-xl border border-border/70 bg-card p-4 motion-safe:animate-fade-in-up" style={{ animationDelay: "120ms" }}><div className="flex items-center justify-between"><p className="text-sm font-medium">Recent activity</p><span className="text-[11px] text-muted-foreground">View all</span></div><PreviewRow icon={ArrowUpRight} label="Salary" amount="+$3,200" tone="success" /><PreviewRow icon={ArrowDownRight} label="Groceries" amount="−$86.42" tone="danger" /></div>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-border/70 bg-primary p-4 text-primary-foreground motion-safe:animate-fade-in-up" style={{ animationDelay: "80ms" }}><CircleDollarSign className="size-5 opacity-80" /><p className="mt-5 text-[11px] opacity-75">Monthly budget</p><p className="mt-1 text-xl font-semibold">64% used</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-primary-foreground/20"><span className="block h-full w-[64%] rounded-full bg-primary-foreground motion-safe:animate-[progress_900ms_ease-out_both]" /></div></div>
            <div className="rounded-xl border border-border/70 bg-card p-4 motion-safe:animate-fade-in-up" style={{ animationDelay: "160ms" }}><div className="flex items-center justify-between"><p className="text-sm font-medium">Spending mix</p><span className="text-xs text-primary">This month</span></div><div className="mt-5 flex items-center gap-4"><div className="relative size-20 shrink-0 rounded-full" style={{ background: "conic-gradient(var(--primary) 0 42%, var(--chart-2) 42% 68%, var(--chart-3) 68% 84%, var(--muted) 84% 100%)" }}><span className="absolute inset-2 flex items-center justify-center rounded-full bg-card"><span className="text-[10px] font-semibold">$1,840</span></span></div><div className="space-y-2 text-[11px] text-muted-foreground"><p><i className="mr-1.5 inline-block size-2 rounded-full bg-primary" />Housing</p><p><i className="mr-1.5 inline-block size-2 rounded-full bg-chart-2" />Food</p><p><i className="mr-1.5 inline-block size-2 rounded-full bg-chart-3" />Travel</p></div></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewRow({ icon: Icon, label, amount, tone }) {
  return <div className="mt-4 flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-muted-foreground"><span className={`flex size-7 items-center justify-center rounded-full ${tone === "success" ? "bg-success-muted text-success" : "bg-destructive/10 text-destructive"}`}><Icon className="size-3.5" /></span>{label}</span><span className={`font-semibold ${tone === "success" ? "text-success" : "text-foreground"}`}>{amount}</span></div>;
}
