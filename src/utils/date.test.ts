import { describe, it, expect } from 'vitest';
import {
  createDate,
  today,
  isSameDay,
  isSameMonth,
  isBefore,
  isAfter,
  addMonths,
  addDays,
  getDaysInMonth,
  generateCalendarDays,
  toISOString,
  fromISOString,
  isWithinRange,
  isDateDisabled,
  startOfMonth,
  getWeekday,
  formatMonthYear,
  formatDate,
  getWeekdayNames,
} from './date';

describe('date utilities', () => {
  describe('createDate', () => {
    it('creates a date object with correct properties', () => {
      const date = createDate(2026, 1, 19);
      expect(date).toEqual({ year: 2026, month: 1, day: 19 });
    });
  });

  describe('today', () => {
    it('returns todays date', () => {
      const todayDate = today();
      const now = new Date();
      expect(todayDate.year).toBe(now.getFullYear());
      expect(todayDate.month).toBe(now.getMonth() + 1);
      expect(todayDate.day).toBe(now.getDate());
    });
  });

  describe('isSameDay', () => {
    it('returns true for same dates', () => {
      const date1 = createDate(2026, 1, 19);
      const date2 = createDate(2026, 1, 19);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('returns false for different dates', () => {
      const date1 = createDate(2026, 1, 19);
      const date2 = createDate(2026, 1, 20);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('returns false for null values', () => {
      const date = createDate(2026, 1, 19);
      expect(isSameDay(date, null)).toBe(false);
      expect(isSameDay(null, date)).toBe(false);
    });
  });

  describe('isSameMonth', () => {
    it('returns true for same month and year', () => {
      const date1 = createDate(2026, 1, 1);
      const date2 = createDate(2026, 1, 31);
      expect(isSameMonth(date1, date2)).toBe(true);
    });

    it('returns false for different months', () => {
      const date1 = createDate(2026, 1, 15);
      const date2 = createDate(2026, 2, 15);
      expect(isSameMonth(date1, date2)).toBe(false);
    });
  });

  describe('isBefore', () => {
    it('returns true when first date is before second', () => {
      const date1 = createDate(2026, 1, 18);
      const date2 = createDate(2026, 1, 19);
      expect(isBefore(date1, date2)).toBe(true);
    });

    it('returns false when dates are equal', () => {
      const date1 = createDate(2026, 1, 19);
      const date2 = createDate(2026, 1, 19);
      expect(isBefore(date1, date2)).toBe(false);
    });
  });

  describe('isAfter', () => {
    it('returns true when first date is after second', () => {
      const date1 = createDate(2026, 1, 20);
      const date2 = createDate(2026, 1, 19);
      expect(isAfter(date1, date2)).toBe(true);
    });
  });

  describe('addMonths', () => {
    it('adds months correctly', () => {
      const date = createDate(2026, 1, 15);
      const result = addMonths(date, 1);
      expect(result.month).toBe(2);
    });

    it('handles year rollover', () => {
      const date = createDate(2026, 12, 15);
      const result = addMonths(date, 1);
      expect(result.year).toBe(2027);
      expect(result.month).toBe(1);
    });
  });

  describe('addDays', () => {
    it('adds days correctly', () => {
      const date = createDate(2026, 1, 15);
      const result = addDays(date, 5);
      expect(result.day).toBe(20);
    });

    it('handles month rollover', () => {
      const date = createDate(2026, 1, 31);
      const result = addDays(date, 1);
      expect(result.month).toBe(2);
      expect(result.day).toBe(1);
    });
  });

  describe('getDaysInMonth', () => {
    it('returns correct days for January', () => {
      expect(getDaysInMonth(2026, 1)).toBe(31);
    });

    it('returns correct days for February in non-leap year', () => {
      expect(getDaysInMonth(2025, 2)).toBe(28);
    });

    it('returns correct days for February in leap year', () => {
      expect(getDaysInMonth(2024, 2)).toBe(29);
    });
  });

  describe('generateCalendarDays', () => {
    it('generates 42 days (6 weeks)', () => {
      const month = createDate(2026, 1, 1);
      const days = generateCalendarDays(month);
      expect(days.length).toBe(42);
    });

    it('includes days from previous and next months', () => {
      const month = createDate(2026, 1, 1);
      const days = generateCalendarDays(month);
      
      // Should have some days from December 2025
      const decemberDays = days.filter((d) => d.month === 12);
      expect(decemberDays.length).toBeGreaterThan(0);
      
      // Should have some days from February 2026
      const februaryDays = days.filter((d) => d.month === 2);
      expect(februaryDays.length).toBeGreaterThan(0);
    });
  });

  describe('toISOString / fromISOString', () => {
    it('converts date to ISO string', () => {
      const date = createDate(2026, 1, 19);
      expect(toISOString(date)).toBe('2026-01-19');
    });

    it('parses ISO string to date', () => {
      const date = fromISOString('2026-01-19');
      expect(date).toEqual({ year: 2026, month: 1, day: 19 });
    });

    it('returns null for invalid string', () => {
      expect(fromISOString('invalid')).toBeNull();
    });

    it('pads single digit month and day', () => {
      const date = createDate(2026, 3, 5);
      expect(toISOString(date)).toBe('2026-03-05');
    });
  });

  describe('isWithinRange', () => {
    it('returns true when date is within range', () => {
      const range = {
        start: createDate(2026, 1, 10),
        end: createDate(2026, 1, 20),
      };
      const date = createDate(2026, 1, 15);
      expect(isWithinRange(date, range)).toBe(true);
    });

    it('returns true when date equals start', () => {
      const range = {
        start: createDate(2026, 1, 10),
        end: createDate(2026, 1, 20),
      };
      expect(isWithinRange(createDate(2026, 1, 10), range)).toBe(true);
    });

    it('returns true when date equals end', () => {
      const range = {
        start: createDate(2026, 1, 10),
        end: createDate(2026, 1, 20),
      };
      expect(isWithinRange(createDate(2026, 1, 20), range)).toBe(true);
    });

    it('returns false when date is before range', () => {
      const range = {
        start: createDate(2026, 1, 10),
        end: createDate(2026, 1, 20),
      };
      expect(isWithinRange(createDate(2026, 1, 5), range)).toBe(false);
    });

    it('returns false when date is after range', () => {
      const range = {
        start: createDate(2026, 1, 10),
        end: createDate(2026, 1, 20),
      };
      expect(isWithinRange(createDate(2026, 1, 25), range)).toBe(false);
    });

    it('returns false when start is null', () => {
      const range = { start: null, end: createDate(2026, 1, 20) };
      expect(isWithinRange(createDate(2026, 1, 15), range)).toBe(false);
    });

    it('returns false when end is null', () => {
      const range = { start: createDate(2026, 1, 10), end: null };
      expect(isWithinRange(createDate(2026, 1, 15), range)).toBe(false);
    });
  });

  describe('isDateDisabled', () => {
    it('returns true when date is before minDate', () => {
      const date = createDate(2026, 1, 5);
      const minDate = createDate(2026, 1, 10);
      expect(isDateDisabled(date, minDate)).toBe(true);
    });

    it('returns true when date is after maxDate', () => {
      const date = createDate(2026, 1, 25);
      const maxDate = createDate(2026, 1, 20);
      expect(isDateDisabled(date, undefined, maxDate)).toBe(true);
    });

    it('returns true when date is in disabledDates', () => {
      const date = createDate(2026, 1, 15);
      const disabledDates = [createDate(2026, 1, 15), createDate(2026, 1, 20)];
      expect(isDateDisabled(date, undefined, undefined, disabledDates)).toBe(true);
    });

    it('returns false when date is valid', () => {
      const date = createDate(2026, 1, 15);
      const minDate = createDate(2026, 1, 1);
      const maxDate = createDate(2026, 1, 31);
      expect(isDateDisabled(date, minDate, maxDate)).toBe(false);
    });
  });

  describe('startOfMonth', () => {
    it('returns first day of month', () => {
      const date = createDate(2026, 1, 19);
      const result = startOfMonth(date);
      expect(result.day).toBe(1);
      expect(result.month).toBe(1);
      expect(result.year).toBe(2026);
    });
  });

  describe('getWeekday', () => {
    it('returns correct weekday', () => {
      // January 19, 2026 is a Monday (1)
      const date = createDate(2026, 1, 19);
      expect(getWeekday(date)).toBe(1);
    });

    it('returns Sunday as 0', () => {
      // January 18, 2026 is a Sunday
      const date = createDate(2026, 1, 18);
      expect(getWeekday(date)).toBe(0);
    });
  });

  describe('formatMonthYear', () => {
    it('formats month and year with default locale', () => {
      const date = createDate(2026, 1, 15);
      const result = formatMonthYear(date);
      expect(result).toBe('January 2026');
    });

    it('formats with custom locale', () => {
      const date = createDate(2026, 1, 15);
      const result = formatMonthYear(date, { locale: 'es-ES' });
      expect(result).toContain('2026');
    });
  });

  describe('formatDate', () => {
    it('formats date with default locale', () => {
      const date = createDate(2026, 1, 19);
      const result = formatDate(date);
      expect(result).toMatch(/01.*19.*2026/);
    });
  });

  describe('getWeekdayNames', () => {
    it('returns array of 7 weekday names', () => {
      const names = getWeekdayNames();
      expect(names).toHaveLength(7);
    });

    it('starts with Sunday when weekStartsOn is 0', () => {
      const names = getWeekdayNames({ weekStartsOn: 0 });
      expect(names[0]).toMatch(/sun/i);
    });

    it('starts with Monday when weekStartsOn is 1', () => {
      const names = getWeekdayNames({ weekStartsOn: 1 });
      expect(names[0]).toMatch(/mon/i);
    });

    it('uses custom dayNamesShort when provided', () => {
      const customNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
      const names = getWeekdayNames({ dayNamesShort: customNames });
      expect(names).toEqual(customNames);
    });
  });

  describe('isBefore edge cases', () => {
    it('compares different years', () => {
      expect(isBefore(createDate(2025, 6, 15), createDate(2026, 1, 1))).toBe(true);
      expect(isBefore(createDate(2027, 1, 1), createDate(2026, 12, 31))).toBe(false);
    });

    it('compares different months in same year', () => {
      expect(isBefore(createDate(2026, 1, 15), createDate(2026, 2, 1))).toBe(true);
      expect(isBefore(createDate(2026, 3, 1), createDate(2026, 2, 28))).toBe(false);
    });
  });

  describe('isAfter edge cases', () => {
    it('compares different years', () => {
      expect(isAfter(createDate(2027, 1, 1), createDate(2026, 12, 31))).toBe(true);
      expect(isAfter(createDate(2025, 12, 31), createDate(2026, 1, 1))).toBe(false);
    });

    it('compares different months in same year', () => {
      expect(isAfter(createDate(2026, 3, 1), createDate(2026, 2, 28))).toBe(true);
      expect(isAfter(createDate(2026, 1, 31), createDate(2026, 2, 1))).toBe(false);
    });
  });

  describe('generateCalendarDays with different weekStartsOn', () => {
    it('generates correct layout when week starts on Monday', () => {
      const month = createDate(2026, 1, 1);
      const days = generateCalendarDays(month, 1);
      expect(days.length).toBe(42);
      
      // First day should be from previous month if needed
      const firstDay = days[0];
      expect(firstDay).toBeDefined();
    });

    it('handles months that start on the weekStartsOn day', () => {
      // Find a month that starts on a specific day
      const month = createDate(2026, 6, 1); // June 1, 2026 is a Monday
      const days = generateCalendarDays(month, 1);
      expect(days[0].month).toBe(6);
      expect(days[0].day).toBe(1);
    });
  });
});
