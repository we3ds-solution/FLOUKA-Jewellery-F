import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDir } from "@/lib/i18n";

type Props = {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
};

/** Reusable, direction-aware date picker. Submits an ISO date (yyyy-MM-dd) via a hidden input. */
export function DatePicker({ name, defaultValue, placeholder = "Pick a date", onChange, className }: Props) {
  const dir = useDir();
  const locale = dir === "rtl" ? ar : enUS;
  const initial = defaultValue ? parseISO(defaultValue) : undefined;
  const [date, setDate] = React.useState<Date | undefined>(initial && isValid(initial) ? initial : undefined);
  const [open, setOpen] = React.useState(false);
  const value = date ? format(date, "yyyy-MM-dd") : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-start gap-2 font-normal", !date && "text-muted-foreground", className)}
        >
          <CalendarIcon className="size-4 shrink-0" />
          <span className="truncate">{date ? format(date, "PPP", { locale }) : placeholder}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="date-picker-popover" align="start" dir={dir} collisionPadding={12}>
        <Calendar
          mode="single"
          {...(date ? { selected: date, defaultMonth: date } : {})}
          onSelect={(d) => { setDate(d); setOpen(false); onChange?.(d ? format(d, "yyyy-MM-dd") : ""); }}
          captionLayout="dropdown"
          startMonth={new Date(1940, 0)}
          endMonth={new Date()}
          disabled={{ after: new Date() }}
          locale={locale}
          dir={dir}
          className="pointer-events-auto"
        />
      </PopoverContent>
      {name && <input type="hidden" name={name} value={value} />}
    </Popover>
  );
}
