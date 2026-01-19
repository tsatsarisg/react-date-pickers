import { useState, useCallback, useMemo } from 'react';
import { CalendarProvider } from '../../context/CalendarContext';
import { CalendarHeader } from '../CalendarHeader';
import { MonthGrid } from '../MonthGrid';
import { type CalendarDate, type DateRange, type LocaleConfig, type WeekDay } from '../../types';
import { addMonths, today } from '../../utils/date';
import { clsx } from 'clsx';

export interface DateRangePickerProps {
  /** Currently selected range (controlled) */
  value?: DateRange;
  /** Default range (uncontrolled) */
  defaultValue?: DateRange;
  /** Called when range changes */
  onChange?: (range: DateRange) => void;
  /** Minimum selectable date */
  minDate?: CalendarDate;
  /** Maximum selectable date */
  maxDate?: CalendarDate;
  /** Array of disabled dates */
  disabledDates?: CalendarDate[];
  /** Locale settings */
  locale?: Partial<LocaleConfig>;
  /** Day the week starts on */
  weekStartsOn?: WeekDay;
  /** Additional class name */
  className?: string;
  /** Accessible label */
  'aria-label'?: string;
  /** Number of months to display */
  numberOfMonths?: 1 | 2;
}

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  locale,
  weekStartsOn,
  className,
  'aria-label': ariaLabel = 'Date range picker',
  numberOfMonths = 2,
}: DateRangePickerProps) {
  const initialMonth = value?.start ?? defaultValue?.start ?? today();
  const [leftMonth, setLeftMonth] = useState<CalendarDate>(initialMonth);
  
  const rightMonth = useMemo(() => addMonths(leftMonth, 1), [leftMonth]);

  const handleLeftPreviousMonth = useCallback(() => {
    setLeftMonth((prev) => addMonths(prev, -1));
  }, []);

  const handleLeftNextMonth = useCallback(() => {
    setLeftMonth((prev) => addMonths(prev, 1));
  }, []);

  // Shared calendar provider for both months to sync range selection
  const sharedProps = {
    rangeValue: value,
    defaultRangeValue: defaultValue,
    onRangeChange: onChange,
    minDate,
    maxDate,
    disabledDates,
    locale,
    weekStartsOn,
  };

  if (numberOfMonths === 1) {
    return (
      <CalendarProvider {...sharedProps}>
        <div
          className={clsx(
            'inline-block rounded-xl border border-gray-200 bg-white p-4 shadow-lg',
            className
          )}
          role="application"
          aria-label={ariaLabel}
        >
          <CalendarHeader />
          <MonthGrid />
        </div>
      </CalendarProvider>
    );
  }

  return (
    <div
      className={clsx(
        'inline-flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-lg',
        className
      )}
      role="application"
      aria-label={ariaLabel}
    >
      {/* Left Calendar */}
      <CalendarProvider {...sharedProps}>
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-2 py-3">
            <button
              type="button"
              onClick={handleLeftPreviousMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous month"
            >
              <ChevronLeftIcon />
            </button>
            <h2 className="text-sm font-semibold text-gray-900">
              {formatMonthYear(leftMonth, locale)}
            </h2>
            <div className="w-8" />
          </div>
          <MonthGridForMonth month={leftMonth} locale={locale} weekStartsOn={weekStartsOn} />
        </div>
      </CalendarProvider>

      {/* Right Calendar */}
      <CalendarProvider {...sharedProps}>
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-2 py-3">
            <div className="w-8" />
            <h2 className="text-sm font-semibold text-gray-900">
              {formatMonthYear(rightMonth, locale)}
            </h2>
            <button
              type="button"
              onClick={handleLeftNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next month"
            >
              <ChevronRightIcon />
            </button>
          </div>
          <MonthGridForMonth month={rightMonth} locale={locale} weekStartsOn={weekStartsOn} />
        </div>
      </CalendarProvider>
    </div>
  );
}

// Internal helper components
import { Day } from '../Day';
import { generateCalendarDays, getWeekdayNames, formatMonthYear, toISOString } from '../../utils/date';

interface MonthGridForMonthProps {
  month: CalendarDate;
  locale?: Partial<LocaleConfig>;
  weekStartsOn?: WeekDay;
}

function MonthGridForMonth({ month, locale, weekStartsOn = 0 }: MonthGridForMonthProps) {
  const days = useMemo(() => generateCalendarDays(month, weekStartsOn), [month, weekStartsOn]);
  const weekdayNames = useMemo(() => getWeekdayNames(locale), [locale]);

  return (
    <div className="w-full" role="grid" aria-label="Calendar">
      <div className="mb-2 grid grid-cols-7 gap-1" role="row">
        {weekdayNames.map((dayName, index) => (
          <div
            key={`weekday-${index}`}
            className="flex h-10 w-10 items-center justify-center text-xs font-medium text-gray-500"
            role="columnheader"
          >
            {dayName}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1" role="rowgroup">
        {days.map((date) => (
          <Day key={toISOString(date)} date={date} />
        ))}
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default DateRangePicker;
