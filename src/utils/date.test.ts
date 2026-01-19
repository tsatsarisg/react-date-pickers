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
  });
});
