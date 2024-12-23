"use client"

import * as React from "react"
import { cn } from "@/utils/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  config: {
    [key: string]: {
      label: string
      color: string
    }
  }
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ className, children, config, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("", className)} {...props}>
        <style>
          {Object.entries(config).map(
            ([key, value]) => `
            .${key} {
              fill: ${value.color};
            }
          `
          )}
        </style>
        {children}
      </div>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

// export const ChartTooltip = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement>
// >(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "border bg-background px-3 py-1.5 text-sm shadow-sm",
//       className
//     )}
//     {...props}
//   />
// ))
// ChartTooltip.displayName = "ChartTooltip"

// export const ChartTooltipContent = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement> & {
//     indicator?: "line" | "dashed"
//     hideLabel?: boolean
//   }
// >(({ className, indicator = "line", hideLabel = false, ...props }, ref) => (
//   <div ref={ref} className={cn("", className)} {...props} />
// ))
// ChartTooltipContent.displayName = "ChartTooltipContent"

// export const ChartLegend = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement>
// >(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn("flex flex-wrap items-center gap-4", className)}
//     {...props}
//   />
// ))
// ChartLegend.displayName = "ChartLegend"

// export const ChartLegendContent = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement>
// >(({ className, ...props }, ref) => (
//   <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
// ))
// ChartLegendContent.displayName = "ChartLegendContent"

