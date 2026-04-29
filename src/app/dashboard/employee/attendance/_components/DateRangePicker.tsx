// components/attendance/DateRangePicker.tsx
"use client"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

export default function DateRangePicker({ range , setRange }:any) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[260px] bg-white justify-between text-xs">
          {range?.from && range?.to
            ? `${format(range.from, "dd MMM")} → ${format(range.to, "dd MMM")}`
            : "Select date range"}
          <CalendarIcon size={14} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}