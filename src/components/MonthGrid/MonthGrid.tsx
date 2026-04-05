import { useMemo } from 'react';
import { Day } from '../Day';
import { useCalendarContext } from '../../context/CalendarContext';
import { generateCalendarDays, getWeekdayNames, toISOString } from '../../utils/date';
import { type MonthGridProps } from '../../types';

export function MonthGrid({
  className,
  month,
  dayClassName,
  weekdaysClassName,
  weekdayClassName,
  daysClassName,
  renderDay,
}: MonthGridProps) {
  const { calendarDays, locale } = useCalendarContext();
  const weekdayNames = useMemo(() => getWeekdayNames(locale), [locale]);

  // Use override month or context calendar days
  const days = useMemo(() => {
    if (month) {
      return generateCalendarDays(month, locale.weekStartsOn);
    }
    return calendarDays;
  }, [month, locale.weekStartsOn, calendarDays]);

  return (
    <div
      className={className}
      role="grid"
      aria-label="Calendar"
    >
      {/* Weekday headers */}
      <div
        className={weekdaysClassName}
        role="row"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}
      >
        {weekdayNames.map((dayName, index) => (
          <div
            key={`weekday-${String(index)}`}
            className={weekdayClassName}
            role="columnheader"
            aria-label={dayName}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div
        className={daysClassName}
        role="rowgroup"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}
      >
        {days.map((date) => (
          <Day
            key={toISOString(date)}
            date={date}
            className={dayClassName}
            overrideCurrentMonth={month}
            renderDay={renderDay}
          />
        ))}
      </div>
    </div>
  );
}

export default MonthGrid;
