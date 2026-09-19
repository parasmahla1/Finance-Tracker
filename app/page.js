import Link from "next/link";
import { ArrowRight, BarChart3, Camera, ChartNoAxesCombined, CreditCard, ListChecks, WalletCards } from "lucide-react";

import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: WalletCards, title: "One clear overview", detail: "See balances, recent activity, and your monthly position without hopping between apps." },
  { icon: ListChecks, title: "Transactions that stay useful", detail: "Search, filter, edit, and schedule entries so your history stays accurate over time." },
  { icon: ChartNoAxesCombined, title: "Trends you can act on", detail: "Use simple, readable charts to spot spending patterns and make the next decision with context." },
  { icon: Camera, title: "Receipt capture", detail: "Upload a receipt and let Gemini prefill the details. You stay in control before anything is saved." },
];

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl"><p className="text-sm font-medium text-primary">A better daily check-in</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">The useful parts of finance tracking, thoughtfully arranged.</h2><p className="mt-4 text-base leading-7 text-muted-foreground">No noise, no invented benchmarks, and no pretending that a chart is insight. WealthFlow gives your real data a calmer home.</p></div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(({ icon: Icon, title, detail }) => <Card key={title} className="gap-4 py-5"><CardContent className="px-5"><span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p></CardContent></Card>)}</div>
      </section>
      <section id="testimonials" className="border-y border-border/70 bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8"><div><p className="text-sm font-medium text-primary">A focused system</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Small habits become clearer when the system gets out of the way.</h2></div><div className="grid gap-4 sm:grid-cols-2"><Principle icon={CreditCard} title="Start with your accounts" detail="Track the places your money actually lives, then see the combined picture." /><Principle icon={BarChart3} title="Learn from the record" detail="Use history and budgets to make informed changes, not reactive guesses." /></div></div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"><div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center sm:p-10"><div><h2 className="text-2xl font-semibold tracking-tight">Ready to make money feel less scattered?</h2><p className="mt-2 text-sm text-muted-foreground">Set up your first account and build from there.</p></div><Button asChild><Link href="/dashboard">Get started <ArrowRight /></Link></Button></div></section>
    </div>
  );
}

function Principle({ icon: Icon, title, detail }) {
  return <div className="rounded-xl border border-border/70 bg-card p-5"><Icon className="size-5 text-primary" /><p className="mt-5 font-semibold">{title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p></div>;
}
