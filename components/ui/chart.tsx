"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

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
        {/* Dynamic styles for configuration */}
        <style>
          {Object.entries(config).map(
            ([key, value]) => `
            .${key} {
              fill: ${value.color};
            }
          `
          )}
        </style>

        {/* Gradients for pseudo-3D effect */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
              <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </svg>

        {/* Render children (chart content) */}
        {children}
      </div>
    );
  }
);
ChartContainer.displayName = "ChartContainer"

export const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border bg-background px-3 py-1.5 text-sm shadow-sm",
      className
    )}
    {...props}
  />
))
ChartTooltip.displayName = "ChartTooltip"

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
ChartTooltipContent.displayName = "ChartTooltipContent"


export const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-wrap items-center gap-4", className)}
    {...props}
  />
))
ChartLegend.displayName = "ChartLegend"

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
))
ChartLegendContent.displayName = "ChartLegendContent"

