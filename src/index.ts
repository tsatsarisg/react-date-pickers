// Components
export { DatePicker } from './components/DatePicker';
export { DateRangePicker } from './components/DateRangePicker';

// Building blocks for custom implementations
export { Day } from './components/Day';
export { MonthGrid } from './components/MonthGrid';
export { CalendarHeader } from './components/CalendarHeader';

// Context for advanced customization
export { CalendarProvider, useCalendarContext } from './context/CalendarContext';

// Types
export type {
  CalendarDate,
  DateRange,
  LocaleConfig,
  WeekDay,
  CalendarBaseProps,
  CalendarClassNames,
  DayState,
  DayProps,
  MonthGridProps,
  CalendarHeaderProps,
  DatePickerProps,
  DateRangePickerProps,
} from './types';

// Utility functions
export {
  createDate,
  today,
  isSameDay,
  isSameMonth,
  isBefore,
  isAfter,
  isWithinRange,
  addMonths,
  addDays,
  getDaysInMonth,
  formatDate,
  formatMonthYear,
  toISOString,
  fromISOString,
  toDate,
  fromDate,
} from './utils/date';
