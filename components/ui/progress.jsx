"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  indicatorClassName,
  extraStyles,
  ...props
}) {
  const progressValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    (<ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("bg-primary h-full transition-[width] duration-500", indicatorClassName, extraStyles)}
        style={{ width: `${progressValue}%` }} />
    </ProgressPrimitive.Root>)
  );
}

export { Progress }
