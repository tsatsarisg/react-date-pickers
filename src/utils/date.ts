import { type CalendarDate, type DateRange, type LocaleConfig, type WeekDay } from '../types';

const DAYS_IN_WEEK = 7;
const CALENDAR_WEEKS = 6;
export const DAYS_PER_CALENDAR = DAYS_IN_WEEK * CALENDAR_WEEKS;

// ============================================
// Date Creation & Comparison
// ============================================

export function createDate(year: number, month: number, day: number): CalendarDate {
  return { year, month, day };
}

export function today(): CalendarDate {
  const now = new Date();
  return createDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function isSameDay(a: CalendarDate | null | undefined, b: CalendarDate | null | undefined): boolean {
  if (!a || !b) return false;
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

export function isSameMonth(a: CalendarDate, b: CalendarDate): boolean {
  return a.year === b.year && a.month === b.month;
}

export function isBefore(a: CalendarDate, b: CalendarDate): boolean {
  if (a.year !== b.year) return a.year < b.year;
  if (a.month !== b.month) return a.month < b.month;
  return a.day < b.day;
}

export function isAfter(a: CalendarDate, b: CalendarDate): boolean {
  if (a.year !== b.year) return a.year > b.year;
  if (a.month !== b.month) return a.month > b.month;
  return a.day > b.day;
}

export function isWithinRange(date: CalendarDate, range: DateRange): boolean {
  if (!range.start || !range.end) return false;
  return (isAfter(date, range.start) || isSameDay(date, range.start)) &&
         (isBefore(date, range.end) || isSameDay(date, range.end));
}

export function isDateDisabled(
  date: CalendarDate,
  minDate?: CalendarDate,
  maxDate?: CalendarDate,
  disabledDates?: CalendarDate[]
): boolean {
  if (minDate && isBefore(date, minDate)) return true;
  if (maxDate && isAfter(date, maxDate)) return true;
  if (disabledDates?.some((d) => isSameDay(d, date))) return true;
  return false;
}

// ============================================
// Date Arithmetic
// ============================================

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function addMonths(date: CalendarDate, amount: number): CalendarDate {
  const d = new Date(date.year, date.month - 1 + amount, 1);
  return createDate(d.getFullYear(), d.getMonth() + 1, 1);
}

export function addDays(date: CalendarDate, amount: number): CalendarDate {
  const d = new Date(date.year, date.month - 1, date.day + amount);
  return createDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

export function startOfMonth(date: CalendarDate): CalendarDate {
  return createDate(date.year, date.month, 1);
}

export function getWeekday(date: CalendarDate): WeekDay {
  const d = new Date(date.year, date.month - 1, date.day);
  return d.getDay() as WeekDay;
}

// ============================================
// Calendar Grid Generation
// ============================================

export function generateCalendarDays(
  month: CalendarDate,
  weekStartsOn: WeekDay = 0
): CalendarDate[] {
  const days: CalendarDate[] = [];
  const firstOfMonth = startOfMonth(month);
  const firstWeekday = getWeekday(firstOfMonth);
  
  // Calculate days to show from previous month
  const daysFromPrevMonth = (firstWeekday - weekStartsOn + 7) % 7;
  
  // Add days from previous month
  const prevMonth = addMonths(month, -1);
  const daysInPrevMonth = getDaysInMonth(prevMonth.year, prevMonth.month);
  
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    days.push(createDate(prevMonth.year, prevMonth.month, daysInPrevMonth - i));
  }
  
  // Add days from current month
  const daysInMonth = getDaysInMonth(month.year, month.month);
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(createDate(month.year, month.month, day));
  }
  
  // Add days from next month to fill the grid
  const nextMonth = addMonths(month, 1);
  const remainingDays = DAYS_PER_CALENDAR - days.length;
  
  for (let day = 1; day <= remainingDays; day++) {
    days.push(createDate(nextMonth.year, nextMonth.month, day));
  }
  
  return days;
}

// ============================================
// Formatting
// ============================================

const DEFAULT_LOCALE: LocaleConfig = {
  locale: 'en-US',
  weekStartsOn: 0,
};

export function formatMonthYear(date: CalendarDate, locale: Partial<LocaleConfig> = {}): string {
  const config = { ...DEFAULT_LOCALE, ...locale };
  const d = new Date(date.year, date.month - 1, 1);
  return d.toLocaleDateString(config.locale, { month: 'long', year: 'numeric' });
}

export function formatDate(date: CalendarDate, locale: Partial<LocaleConfig> = {}): string {
  const config = { ...DEFAULT_LOCALE, ...locale };
  const d = new Date(date.year, date.month - 1, date.day);
  return d.toLocaleDateString(config.locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export function getWeekdayNames(locale: Partial<LocaleConfig> = {}): string[] {
  const config = { ...DEFAULT_LOCALE, ...locale };
  if (config.dayNamesShort) return config.dayNamesShort;
  
  const names: string[] = [];
  // Start from a known Sunday (Jan 4, 1970 was a Sunday)
  const baseDate = new Date(1970, 0, 4);
  
  for (let i = 0; i < 7; i++) {
    const dayIndex = (config.weekStartsOn + i) % 7;
    const date = new Date(baseDate);
    date.setDate(4 + dayIndex);
    names.push(date.toLocaleDateString(config.locale, { weekday: 'short' }));
  }
  
  return names;
}

export function toISOString(date: CalendarDate): string {
  const year = date.year.toString().padStart(4, '0');
  const month = date.month.toString().padStart(2, '0');
  const day = date.day.toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromISOString(str: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
  if (!match) return null;
  const [, yearStr, monthStr, dayStr] = match;
  if (!yearStr || !monthStr || !dayStr) return null;
  return createDate(parseInt(yearStr, 10), parseInt(monthStr, 10), parseInt(dayStr, 10));
}
