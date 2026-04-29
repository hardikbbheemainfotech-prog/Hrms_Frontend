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
          <button
            type="button"
            onClick={onClick}
            className={className}
          >
            {icon}
          </button>
        </TooltipTrigger>

        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}