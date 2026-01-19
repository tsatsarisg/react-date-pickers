import { describe, it, expect, vi } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import { CalendarProvider, useCalendarContext } from './CalendarContext';
import { createDate, today } from '../utils/date';
import type { ReactNode } from 'react';

function createWrapper(props: any = {}) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <CalendarProvider {...props}>{children}</CalendarProvider>;
  };
}

describe('CalendarContext', () => {
  describe('useCalendarContext', () => {
    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useCalendarContext());
      }).toThrow('useCalendarContext must be used within a CalendarProvider');
      
      spy.mockRestore();
    });

    it('returns context value when used inside provider', () => {
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.currentMonth).toBeDefined();
      expect(result.current.selectDate).toBeDefined();
    });
  });

  describe('CalendarProvider - Single Date Mode', () => {
    it('initializes with today as default', () => {
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper(),
      });

      const todayDate = today();
      expect(result.current.currentMonth.year).toBe(todayDate.year);
      expect(result.current.currentMonth.month).toBe(todayDate.month);
    });

    it('initializes with defaultValue', () => {
      const defaultDate = createDate(2026, 5, 15);
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ defaultValue: defaultDate }),
      });

      expect(result.current.selectedDate).toEqual(defaultDate);
    });

    it('uses controlled value', () => {
      const controlledDate = createDate(2026, 6, 20);
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ value: controlledDate }),
      });

      expect(result.current.selectedDate).toEqual(controlledDate);
    });

    it('calls onChange when date is selected', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ onChange }),
      });

      const dateToSelect = createDate(2026, 1, 15);
      
      act(() => {
        result.current.selectDate(dateToSelect);
      });

      expect(onChange).toHaveBeenCalledWith(dateToSelect);
    });

    it('toggles selection when clicking same date', () => {
      const onChange = vi.fn();
      const selectedDate = createDate(2026, 1, 15);
      
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ value: selectedDate, onChange }),
      });

      act(() => {
        result.current.selectDate(selectedDate);
      });

      expect(onChange).toHaveBeenCalledWith(null);
    });

    it('does not call onChange when selecting disabled date', () => {
      const onChange = vi.fn();
      const disabledDate = createDate(2026, 1, 15);
      
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ onChange, disabledDates: [disabledDate] }),
      });

      act(() => {
        result.current.selectDate(disabledDate);
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('CalendarProvider - Range Mode', () => {
    it('enters range mode when rangeValue is provided', () => {
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ rangeValue: { start: null, end: null } }),
      });

      expect(result.current.isRangeMode).toBe(true);
    });

    it('starts new range when selecting first date', () => {
      const onRangeChange = vi.fn();
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({
          rangeValue: { start: null, end: null },
          onRangeChange,
        }),
      });

      const firstDate = createDate(2026, 1, 10);
      
      act(() => {
        result.current.selectDate(firstDate);
      });

      expect(onRangeChange).toHaveBeenCalledWith({
        start: firstDate,
        end: null,
      });
    });

    it('completes range when selecting second date', () => {
      const onRangeChange = vi.fn();
      const startDate = createDate(2026, 1, 10);
      
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({
          rangeValue: { start: startDate, end: null },
          onRangeChange,
        }),
      });

      const endDate = createDate(2026, 1, 20);
      
      act(() => {
        result.current.selectDate(endDate);
      });

      expect(onRangeChange).toHaveBeenCalledWith({
        start: startDate,
        end: endDate,
      });
    });

    it('swaps dates when end is before start', () => {
      const onRangeChange = vi.fn();
      const startDate = createDate(2026, 1, 20);
      
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({
          rangeValue: { start: startDate, end: null },
          onRangeChange,
        }),
      });

      const endDate = createDate(2026, 1, 10);
      
      act(() => {
        result.current.selectDate(endDate);
      });

      expect(onRangeChange).toHaveBeenCalledWith({
        start: endDate,
        end: startDate,
      });
    });

    it('starts new range after completing a range', () => {
      const onRangeChange = vi.fn();
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({
          rangeValue: {
            start: createDate(2026, 1, 10),
            end: createDate(2026, 1, 20),
          },
          onRangeChange,
        }),
      });

      const newDate = createDate(2026, 1, 25);
      
      act(() => {
        result.current.selectDate(newDate);
      });

      expect(onRangeChange).toHaveBeenCalledWith({
        start: newDate,
        end: null,
      });
    });
  });

  describe('Month Navigation', () => {
    it('navigates to previous month', () => {
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ defaultValue: createDate(2026, 2, 15) }),
      });

      act(() => {
        result.current.goToPreviousMonth();
      });

      expect(result.current.currentMonth.month).toBe(1);
      expect(result.current.currentMonth.year).toBe(2026);
    });

    it('navigates to next month', () => {
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ defaultValue: createDate(2026, 1, 15) }),
      });

      act(() => {
        result.current.goToNextMonth();
      });

      expect(result.current.currentMonth.month).toBe(2);
      expect(result.current.currentMonth.year).toBe(2026);
    });

    it('handles year rollover when going to previous month', () => {
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ defaultValue: createDate(2026, 1, 15) }),
      });

      act(() => {
        result.current.goToPreviousMonth();
      });

      expect(result.current.currentMonth.month).toBe(12);
      expect(result.current.currentMonth.year).toBe(2025);
    });

    it('handles year rollover when going to next month', () => {
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ defaultValue: createDate(2025, 12, 15) }),
      });

      act(() => {
        result.current.goToNextMonth();
      });

      expect(result.current.currentMonth.month).toBe(1);
      expect(result.current.currentMonth.year).toBe(2026);
    });

    it('sets current month directly', () => {
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper(),
      });

      const newMonth = createDate(2026, 6, 1);
      
      act(() => {
        result.current.setCurrentMonth(newMonth);
      });

      expect(result.current.currentMonth).toEqual(newMonth);
    });
  });

  describe('Date State Checks', () => {
    it('isDisabled returns true for dates before minDate', () => {
      const minDate = createDate(2026, 1, 10);
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ minDate }),
      });

      expect(result.current.isDisabled(createDate(2026, 1, 5))).toBe(true);
      expect(result.current.isDisabled(createDate(2026, 1, 15))).toBe(false);
    });

    it('isDisabled returns true for dates after maxDate', () => {
      const maxDate = createDate(2026, 1, 20);
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ maxDate }),
      });

      expect(result.current.isDisabled(createDate(2026, 1, 25))).toBe(true);
      expect(result.current.isDisabled(createDate(2026, 1, 15))).toBe(false);
    });

    it('isDisabled returns true for dates in disabledDates', () => {
      const disabledDates = [createDate(2026, 1, 15), createDate(2026, 1, 20)];
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ disabledDates }),
      });

      expect(result.current.isDisabled(createDate(2026, 1, 15))).toBe(true);
      expect(result.current.isDisabled(createDate(2026, 1, 10))).toBe(false);
    });

    it('isSelected returns true for selected date', () => {
      const selectedDate = createDate(2026, 1, 15);
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ value: selectedDate }),
      });

      expect(result.current.isSelected(selectedDate)).toBe(true);
      expect(result.current.isSelected(createDate(2026, 1, 16))).toBe(false);
    });

    it('isInSelectedRange returns true for dates in range', () => {
      const range = {
        start: createDate(2026, 1, 10),
        end: createDate(2026, 1, 20),
      };
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ rangeValue: range }),
      });

      expect(result.current.isInSelectedRange(createDate(2026, 1, 15))).toBe(true);
      expect(result.current.isInSelectedRange(createDate(2026, 1, 10))).toBe(false); // start date
      expect(result.current.isInSelectedRange(createDate(2026, 1, 20))).toBe(false); // end date
      expect(result.current.isInSelectedRange(createDate(2026, 1, 5))).toBe(false);
    });

    it('isRangeStart returns true for start date', () => {
      const range = {
        start: createDate(2026, 1, 10),
        end: createDate(2026, 1, 20),
      };
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ rangeValue: range }),
      });

      expect(result.current.isRangeStart(createDate(2026, 1, 10))).toBe(true);
      expect(result.current.isRangeStart(createDate(2026, 1, 15))).toBe(false);
    });

    it('isRangeEnd returns true for end date', () => {
      const range = {
        start: createDate(2026, 1, 10),
        end: createDate(2026, 1, 20),
      };
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ rangeValue: range }),
      });

      expect(result.current.isRangeEnd(createDate(2026, 1, 20))).toBe(true);
      expect(result.current.isRangeEnd(createDate(2026, 1, 15))).toBe(false);
    });
  });

  describe('Calendar Days Generation', () => {
    it('generates 42 days for calendar grid', () => {
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ defaultValue: createDate(2026, 1, 15) }),
      });

      expect(result.current.calendarDays).toHaveLength(42);
    });

    it('respects weekStartsOn configuration', () => {
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({
          defaultValue: createDate(2026, 1, 15),
          weekStartsOn: 1, // Monday
        }),
      });

      expect(result.current.calendarDays).toHaveLength(42);
    });
  });

  describe('Locale Configuration', () => {
    it('uses default locale', () => {
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper(),
      });

      expect(result.current.locale.locale).toBe('en-US');
      expect(result.current.locale.weekStartsOn).toBe(0);
    });

    it('merges custom locale config', () => {
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({
          locale: { locale: 'es-ES' },
          weekStartsOn: 1,
        }),
      });

      expect(result.current.locale.locale).toBe('es-ES');
      expect(result.current.locale.weekStartsOn).toBe(1);
    });
  });

  describe('Focused Date', () => {
    it('initializes focused date to initial date', () => {
      const initialDate = createDate(2026, 5, 15);
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper({ defaultValue: initialDate }),
      });

      expect(result.current.focusedDate).toEqual(initialDate);
    });

    it('updates focused date', () => {
      const { result } = renderHook(() => useCalendarContext(), {
        wrapper: createWrapper(),
      });

      const newFocusedDate = createDate(2026, 6, 20);
      
      act(() => {
        result.current.setFocusedDate(newFocusedDate);
      });

      expect(result.current.focusedDate).toEqual(newFocusedDate);
    });
  });
});
