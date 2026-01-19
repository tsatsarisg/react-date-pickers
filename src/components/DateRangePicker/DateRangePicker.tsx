import { useState, useCallback, useMemo, createContext, useContext } from 'react';
import { CalendarProvider, useCalendarContext } from '../../context/CalendarContext';
import { type CalendarDate, type DateRange, type LocaleConfig, type WeekDay } from '../../types';
import { addMonths, today, generateCalendarDays, getWeekdayNames, formatMonthYear, toISOString } from '../../utils/date';
import { clsx } from 'clsx';
import { Day } from '../Day';

// ============================================
// Dual Month Context - for syncing two calendars
// ============================================

interface DualMonthContextValue {
  leftMonth: CalendarDate;
  rightMonth: CalendarDate;
  setLeftMonth: (month: CalendarDate) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

const DualMonthContext = createContext<DualMonthContextValue | null>(null);

function useDualMonthContext() {
  const context = useContext(DualMonthContext);
  if (!context) {
    throw new Error('useDualMonthContext must be used within DualMonthProvider');
  }
  return context;
}

// ============================================
// Props
// ============================================

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
  /** Unique identifier for form association */
  id?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
}

// ============================================
// Main Component
// ============================================

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
  id,
  disabled = false,
}: DateRangePickerProps) {
  const initialMonth = value?.start ?? defaultValue?.start ?? today();
  const [leftMonth, setLeftMonth] = useState<CalendarDate>(initialMonth);
  
  const rightMonth = useMemo(() => addMonths(leftMonth, 1), [leftMonth]);

  const goToPreviousMonth = useCallback(() => {
    setLeftMonth((prev) => addMonths(prev, -1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setLeftMonth((prev) => addMonths(prev, 1));
  }, []);

  const dualMonthValue = useMemo<DualMonthContextValue>(() => ({
    leftMonth,
    rightMonth,
    setLeftMonth,
    goToPreviousMonth,
    goToNextMonth,
  }), [leftMonth, rightMonth, goToPreviousMonth, goToNextMonth]);

  // Shared calendar provider props
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
          id={id}
          className={clsx(
            'inline-block rounded-xl border border-gray-200 bg-white p-4 shadow-lg',
            disabled && 'pointer-events-none opacity-50',
            className
          )}
          role="application"
          aria-label={ariaLabel}
          aria-disabled={disabled}
        >
          <SingleMonthHeader />
          <MonthGridInternal />
        </div>
      </CalendarProvider>
    );
  }

  // Two-month view - wrap everything in a single CalendarProvider for shared state
  return (
    <CalendarProvider {...sharedProps}>
      <DualMonthContext.Provider value={dualMonthValue}>
        <div
          id={id}
          className={clsx(
            'inline-flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-lg',
            disabled && 'pointer-events-none opacity-50',
            className
          )}
          role="application"
          aria-label={ariaLabel}
          aria-disabled={disabled}
        >
          {/* Left Calendar */}
          <div className="flex flex-col">
            <LeftMonthHeader locale={locale} />
            <MonthGridForMonth month={leftMonth} locale={locale} weekStartsOn={weekStartsOn} />
          </div>

          {/* Right Calendar */}
          <div className="flex flex-col">
            <RightMonthHeader locale={locale} />
            <MonthGridForMonth month={rightMonth} locale={locale} weekStartsOn={weekStartsOn} />
          </div>
        </div>
      </DualMonthContext.Provider>
    </CalendarProvider>
  );
}

// ============================================
// Single Month Header (uses CalendarContext)
// ============================================

function SingleMonthHeader() {
  const { currentMonth, goToPreviousMonth, goToNextMonth, locale } = useCalendarContext();

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <button
        type="button"
        onClick={goToPreviousMonth}
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Previous month"
      >
        <ChevronLeftIcon />
      </button>
      <h2 className="text-sm font-semibold text-gray-900" aria-live="polite">
        {formatMonthYear(currentMonth, locale)}
      </h2>
      <button
        type="button"
        onClick={goToNextMonth}
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Next month"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}

// ============================================
// Dual Month Headers
// ============================================

interface MonthHeaderProps {
  locale?: Partial<LocaleConfig>;
}

function LeftMonthHeader({ locale }: MonthHeaderProps) {
  const { leftMonth, goToPreviousMonth } = useDualMonthContext();

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <button
        type="button"
        onClick={goToPreviousMonth}
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Previous month"
      >
        <ChevronLeftIcon />
      </button>
      <h2 className="text-sm font-semibold text-gray-900" aria-live="polite">
        {formatMonthYear(leftMonth, locale)}
      </h2>
      <div className="w-8" />
    </div>
  );
}

function RightMonthHeader({ locale }: MonthHeaderProps) {
  const { rightMonth, goToNextMonth } = useDualMonthContext();

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <div className="w-8" />
      <h2 className="text-sm font-semibold text-gray-900" aria-live="polite">
        {formatMonthYear(rightMonth, locale)}
      </h2>
      <button
        type="button"
        onClick={goToNextMonth}
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Next month"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}

// ============================================
// Month Grid Components
// ============================================

function MonthGridInternal() {
  const { calendarDays, locale } = useCalendarContext();
  const weekdayNames = useMemo(() => getWeekdayNames(locale), [locale]);

  return (
    <div className="w-full" role="grid" aria-label="Calendar">
      <div className="mb-2 grid grid-cols-7 gap-1" role="row">
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
      <div className="grid grid-cols-7 gap-1" role="rowgroup">
        {calendarDays.map((date) => (
          <Day key={toISOString(date)} date={date} />
        ))}
      </div>
    </div>
  );
}

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
            aria-label={dayName}
          >
            {dayName}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1" role="rowgroup">
        {days.map((date) => (
          <Day 
            key={toISOString(date)} 
            date={date} 
            overrideCurrentMonth={month}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// Icons
// ============================================

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
