"use client"

import * as React from "react"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { Grid } from "@visx/grid"
import { Group } from "@visx/group"
import { scaleBand, scaleLinear } from "@visx/scale"
import { Bar } from "@visx/shape"
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip"
import { localPoint } from "@visx/event"

import { cn } from "@/utils/utils"

const tooltipStyles = {
  ...defaultStyles,
  background: "white",
  border: "1px solid #999",
  color: "black",
  fontSize: "14px",
  fontWeight: "bold",
  padding: "8px",
  borderRadius: "4px",
}

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: { name: string; value: number }[]
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  xAxisLabel?: string
  yAxisLabel?: string
}

interface DataPoint {
  name: string
  value: number
}

export function Chart({
  data,
  width = 500,
  height = 300,
  margin = { top: 20, right: 20, bottom: 40, left: 40 },
  xAxisLabel,
  yAxisLabel,
  className,
  ...props
}: ChartProps) {
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  const xScale = scaleBand<string>({
    range: [0, xMax],
    round: true,
    domain: data.map((d) => d.name),
    padding: 0.4,
  })

  const yScale = scaleLinear<number>({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...data.map((d) => d.value))],
  })

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<DataPoint>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  })

  return (
    <div className={cn("relative", className)} {...props} ref={containerRef}>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
            strokeOpacity={0.1}
          />
          <AxisBottom
            top={yMax}
            scale={xScale}
            tickLabelProps={() => ({
              fill: "black",
              fontSize: 11,
              textAnchor: "middle",
            })}
            label={xAxisLabel}
          />
          <AxisLeft
            scale={yScale}
            tickLabelProps={() => ({
              fill: "black",
              fontSize: 11,
              textAnchor: "end",
              dx: "-0.25em",
              dy: "0.25em",
            })}
            label={yAxisLabel}
          />
          {data.map((d) => {
            const barWidth = xScale.bandwidth()
            const barHeight = yMax - (yScale(d.value) ?? 0)
            const barX = xScale(d.name)
            const barY = yMax - barHeight
            return (
              <Bar
                key={`bar-${d.name}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="rgba(23, 233, 217, .5)"
                onClick={() => {
                  alert(`clicked: ${JSON.stringify(d)}`)
                }}
                onMouseLeave={() => {
                  hideTooltip()
                }}
                onMouseMove={(event) => {
                  const eventSvgCoords = localPoint(event) 
                  if (eventSvgCoords) {
                    showTooltip({
                      tooltipData: d,
                      tooltipTop: eventSvgCoords.y,
                      tooltipLeft: eventSvgCoords.x,
                    })
                  }
                }}
              />
            )
          })}
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div>
            <strong>{tooltipData.name}</strong>
          </div>
          <div>{tooltipData.value}</div>
        </TooltipInPortal>
      )}
    </div>
  )
}