import { useEffect, useState } from "react"

type CircleStatProps = {
  value: number
  total: number
  color: string
  label: string
}

function CircleStat({ value, total, color, label }: CircleStatProps) {
  const radius = 40
  const stroke = 8
  const normalizedRadius = radius - stroke / 2
  const circumference = 2 * Math.PI * normalizedRadius

  const percent = Math.round((value / total) * 100)

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setProgress(percent), 200)
    return () => clearTimeout(t)
  }, [percent])

  const strokeDashoffset =
    circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 1.5s ease",
          }}
        />

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-sm font-semibold fill-gray-700"
        >
          {progress}%
        </text>
      </svg>

      <p className="mt-2 text-sm capitalize">{label}</p>
    </div>
  )
}

export default CircleStat