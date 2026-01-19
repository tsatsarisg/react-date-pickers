// ============================================
// Date Types - No external dependencies (Luxon removed)
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
  header?: React.ReactNode;
  /** Custom footer component */
  footer?: React.ReactNode;
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
}

/** Props for the Day component */
export interface DayProps {
  date: CalendarDate;
  /** Custom class name */
  className?: string;
  /** Override the current month for display purposes (used in dual-month views) */
  overrideCurrentMonth?: CalendarDate;
}

/** Props for the Month grid component */
export interface MonthGridProps {
  /** Custom class name */
  className?: string;
}

/** Props for the Calendar Header */
export interface CalendarHeaderProps {
  /** Custom class name */
  className?: string;
  /** Whether to show the previous month button */
  showPreviousButton?: boolean;
  /** Whether to show the next month button */
  showNextButton?: boolean;
}

// ============================================
// Event Handler Types
// ============================================

export type DateChangeHandler = (date: CalendarDate | null) => void;
export type RangeChangeHandler = (range: DateRange) => void;
export type MonthChangeHandler = (date: CalendarDate) => void;

// ============================================
// Utility Types
// ============================================

export type CalendarView = 'days' | 'months' | 'years';
