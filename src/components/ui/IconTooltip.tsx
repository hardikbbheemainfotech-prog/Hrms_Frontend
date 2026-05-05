"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Props = {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  className?: string
}

export default function IconTooltip({
  icon,
  label,
  onClick,
  className,
}: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
         <span
  onClick={onClick}
  className={className}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick?.()
    }
  }}
>
  {icon}
</span>
        </TooltipTrigger>

        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}