
// src/components/ui/date-picker.tsx
"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale" // Import French locale for date formatting
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, type CalendarProps } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect' | 'locale'>;
  buttonProps?: React.ComponentProps<typeof Button>;
  placeholder?: string;
}

export function DatePicker({ date, setDate, calendarProps, buttonProps, placeholder = "Choisissez une date" }: DatePickerProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          {...buttonProps}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {isClient && date ? format(date, "PPP", { locale: fr }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={fr} // Pass French locale to Calendar
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  )
}
