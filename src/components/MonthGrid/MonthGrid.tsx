import { Day } from '../Day';
import { useCalendarContext } from '../../context/CalendarContext';
import { getWeekdayNames, toISOString } from '../../utils/date';
import { clsx } from 'clsx';

interface MonthGridProps {
  className?: string;
}

export function MonthGrid({ className }: MonthGridProps) {
  const { calendarDays, locale } = useCalendarContext();
  const weekdayNames = getWeekdayNames(locale);

  return (
    <div
      className={clsx('w-full', className)}
      role="grid"
      aria-label="Calendar"
    >
      {/* Weekday headers */}
      <div
        className="mb-2 grid grid-cols-7 gap-1"
        role="row"
      >
        {weekdayNames.map((dayName, index) => (
          <div
            key={`weekday-${index}`}
            className="flex h-10 w-10 items-center justify-center text-xs font-medium text-gray-500"
            role="columnheader"
            aria-label={dayName}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div
        className="grid grid-cols-7 gap-1"
        role="rowgroup"
      >
        {calendarDays.map((date) => (
          <Day key={toISOString(date)} date={date} />
        ))}
      </div>
    </div>
  );
}

export default MonthGrid;
