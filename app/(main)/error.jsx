"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainError({ reset }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive"><AlertTriangle /></span>
      <h1 className="mt-5 text-xl font-semibold">We couldn’t load this workspace</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Try again in a moment. If the problem continues, check your database and authentication configuration.</p>
      <Button className="mt-6" onClick={() => reset()}><RefreshCw /> Try again</Button>
    </div>
  );
}
