
import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white shadow-md p-4",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mb-2", className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h3 className={cn("text-sm font-semibold", className)} {...props} />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("", className)} {...props} />
}
function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-4 flex items-center", className)}
      {...props}
    />
  )
}


export { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter }

type GaugeProps = {
  value: number // 0 - 100
  color?: string
}


export function Gauge({ value, color = "#f59e0b" }: GaugeProps) {
  const radius = 80
  const stroke = 12
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * Math.PI

  const strokeDashoffset =
    circumference - (value / 100) * circumference

  return (
    <svg
      height={radius}
      width={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius}`}
    >
      {/* background */}
      <path
        d={`
          M ${stroke} ${radius}
          A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${
          radius * 2 - stroke
        } ${radius}
        `}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={stroke}
        strokeLinecap="round"
      />

      {/* progress */}
      <path
        d={`
          M ${stroke} ${radius}
          A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${
          radius * 2 - stroke
        } ${radius}
        `}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />

      {/* value */}
      <text
        x="50%"
        y="85%"
        textAnchor="middle"
        fontSize="20"
        fontWeight="600"
        fill={color}
      >
        {value}%
      </text>
    </svg>
  )
}