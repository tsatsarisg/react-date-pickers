import { type ReactNode } from 'react';

// ============================================
// Date Types
// ============================================

/** Represents a calendar date without time */
export interface CalendarDate {
  year: number;
  month: number; // 1-12
  day: number;
}

/** Date range for range pickers */
export interface DateRange {
  start: CalendarDate | null;
  end: CalendarDate | null;
}

/** Week day configuration */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Locale configuration */
export interface LocaleConfig {
  locale: string;
  weekStartsOn: WeekDay;
  monthNames?: string[];
  dayNames?: string[];
  dayNamesShort?: string[];
}

// ============================================
// ClassNames - headless styling API
// ============================================

/** Class names for styling calendar sub-components */
export interface CalendarClassNames {
  root?: string;
  header?: string;
  navButton?: string;
  caption?: string;
  grid?: string;
  weekdays?: string;
  weekday?: string;
  days?: string;
  day?: string;
  footer?: string;
  /** Container for multiple month panels (DateRangePicker) */
  months?: string;
  /** Individual month panel (DateRangePicker) */
  month?: string;
}

// ============================================
// Day state passed to renderDay
// ============================================

export interface DayState {
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isOutsideMonth: boolean;
  isFocused: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
}

// ============================================
// Component Props Types
// ============================================

/** Base props shared by all calendar components */
export interface CalendarBaseProps {
  /** Custom class name */
  className?: string;
  /** Minimum selectable date */
  minDate?: CalendarDate;
  /** Maximum selectable date */
  maxDate?: CalendarDate;
  /** Dates that should be disabled */
  disabledDates?: CalendarDate[];
  /** Locale configuration */
  locale?: Partial<LocaleConfig>;
  /** Called when month changes */
  onMonthChange?: (date: CalendarDate) => void;
  /** Unique identifier for form association */
  id?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
}

/** Props for the Day component */
export interface DayProps {
  date: CalendarDate;
  /** Custom class name */
  className?: string;
  /** Override the current month for display purposes (used in dual-month views) */
  overrideCurrentMonth?: CalendarDate;
  /** Custom render function for the day content */
  renderDay?: (date: CalendarDate, state: DayState) => ReactNode;
}

/** Props for the Month grid component */
export interface MonthGridProps {
  /** Custom class name */
  className?: string;
  /** Override which month to display (bypasses context) */
  month?: CalendarDate;
  /** Class name applied to each day button */
  dayClassName?: string;
  /** Class name applied to the weekday header row */
  weekdaysClassName?: string;
  /** Class name applied to each weekday header */
  weekdayClassName?: string;
  /** Class name applied to the days container */
  daysClassName?: string;
  /** Custom render function for day content */
  renderDay?: (date: CalendarDate, state: DayState) => ReactNode;
}

/** Props for the Calendar Header */
export interface CalendarHeaderProps {
  /** Custom class name */
  className?: string;
  /** Whether to show the previous month button */
  showPreviousButton?: boolean;
  /** Whether to show the next month button */
  showNextButton?: boolean;
  /** Override which month to display (bypasses context) */
  month?: CalendarDate;
  /** Override previous month handler */
  onPreviousMonth?: () => void;
  /** Override next month handler */
  onNextMonth?: () => void;
  /** Class name for navigation buttons */
  navButtonClassName?: string;
  /** Class name for the month/year caption */
  captionClassName?: string;
}

/** Props for single date picker */
export interface DatePickerProps extends CalendarBaseProps {
  /** Currently selected date */
  value?: CalendarDate | null;
  /** Default date when uncontrolled */
  defaultValue?: CalendarDate;
  /** Called when date selection changes */
  onChange?: (date: CalendarDate | null) => void;
  /** Accessible label */
  'aria-label'?: string;
  /** Day the week starts on (0 = Sunday, 1 = Monday, etc.) */
  weekStartsOn?: WeekDay;
  /** Custom header component */
  header?: ReactNode;
  /** Custom footer component */
  footer?: ReactNode;
  /** Class names for sub-components */
  classNames?: CalendarClassNames;
  /** Custom render function for day content */
  renderDay?: (date: CalendarDate, state: DayState) => ReactNode;
}

/** Props for date range picker */
export interface DateRangePickerProps extends CalendarBaseProps {
  /** Currently selected range */
  value?: DateRange;
  /** Default range when uncontrolled */
  defaultValue?: DateRange;
  /** Called when range selection changes */
  onChange?: (range: DateRange) => void;
  /** Accessible label */
  'aria-label'?: string;
  /** Day the week starts on */
  weekStartsOn?: WeekDay;
  /** Number of months to display */
  numberOfMonths?: 1 | 2;
  /** Class names for sub-components */
  classNames?: CalendarClassNames;
  /** Custom render function for day content */
  renderDay?: (date: CalendarDate, state: DayState) => ReactNode;
  /** Custom header component (single month mode only) */
  header?: ReactNode;
  /** Custom footer component */
  footer?: ReactNode;
}
