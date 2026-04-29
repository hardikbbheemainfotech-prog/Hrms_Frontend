"use client"

import * as React from "react"

export function ChartContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
}

export function ChartTooltip({ content }: any) {
  return content
}

export function ChartTooltipContent({ payload }: any) {
  if (!payload || payload.length === 0) return null

  return (
    <div className="bg-white border shadow p-2 rounded text-sm">
      {payload.map((item: any, i: number) => (
        <div key={i} className="flex justify-between gap-4">
          <span>{item.name}</span>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  )
}