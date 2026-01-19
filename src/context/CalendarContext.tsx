import { createContext, useContext, useMemo, useCallback, useState, type ReactNode } from 'react';
import {
  type CalendarDate,
  type DateRange,
  type LocaleConfig,
  type WeekDay,
} from '../types';
import {
  today,
  isSameDay,
  addMonths,
  isDateDisabled,
  generateCalendarDays,
} from '../utils/date';

// ============================================
// Context Types
// ============================================

interface CalendarContextValue {
  // State
  currentMonth: CalendarDate;
  focusedDate: CalendarDate;
  selectedDate: CalendarDate | null;
  selectedRange: DateRange;
  isRangeMode: boolean;
  
  // Configuration
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
  disabledDates: CalendarDate[];
  locale: LocaleConfig;
  
  // Computed
  calendarDays: CalendarDate[];
  
  // Actions
  setCurrentMonth: (date: CalendarDate) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  selectDate: (date: CalendarDate) => void;
  setFocusedDate: (date: CalendarDate) => void;
  isDisabled: (date: CalendarDate) => boolean;
  isSelected: (date: CalendarDate) => boolean;
  isInSelectedRange: (date: CalendarDate) => boolean;
  isRangeStart: (date: CalendarDate) => boolean;
  isRangeEnd: (date: CalendarDate) => boolean;
}

const CalendarContext = createContext<CalendarContextValue | null>(null);

// ============================================
// Hook
// ============================================

export function useCalendarContext(): CalendarContextValue {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }
  return context;
}

// ============================================
// Provider Props
// ============================================

interface CalendarProviderProps {
  children: ReactNode;
  // Single date mode
  value?: CalendarDate | null;
  defaultValue?: CalendarDate;
  onChange?: (date: CalendarDate | null) => void;
  // Range mode
  rangeValue?: DateRange;
  defaultRangeValue?: DateRange;
  onRangeChange?: (range: DateRange) => void;
  // Common
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
  disabledDates?: CalendarDate[];
  locale?: Partial<LocaleConfig>;
  weekStartsOn?: WeekDay;
}

// ============================================
// Provider Component
// ============================================

export function CalendarProvider({
  children,
  value,
  defaultValue,
  onChange,
  rangeValue,
  defaultRangeValue,
  onRangeChange,
  minDate,
  maxDate,
  disabledDates = [],
  locale: localeConfig,
  weekStartsOn = 0,
}: CalendarProviderProps) {
  const isRangeMode = rangeValue !== undefined || defaultRangeValue !== undefined || onRangeChange !== undefined;
  
  const initialDate = value ?? defaultValue ?? today();
  
  // Internal state for uncontrolled mode
  const [internalSelectedDate, setInternalSelectedDate] = useState<CalendarDate | null>(
    defaultValue ?? null
  );
  const [internalRange, setInternalRange] = useState<DateRange>(
    defaultRangeValue ?? { start: null, end: null }
  );
  const [currentMonth, setCurrentMonth] = useState<CalendarDate>(initialDate);
  const [focusedDate, setFocusedDate] = useState<CalendarDate>(initialDate);
  
  // Determine if controlled or uncontrolled
  const isControlled = value !== undefined;
  const isRangeControlled = rangeValue !== undefined;
  
  const selectedDate = isControlled ? value : internalSelectedDate;
  const selectedRange = isRangeControlled ? rangeValue : internalRange;
  
  const locale: LocaleConfig = useMemo(() => ({
    locale: localeConfig?.locale ?? 'en-US',
    weekStartsOn: localeConfig?.weekStartsOn ?? weekStartsOn,
    monthNames: localeConfig?.monthNames,
    dayNames: localeConfig?.dayNames,
    dayNamesShort: localeConfig?.dayNamesShort,
  }), [localeConfig, weekStartsOn]);
  
  const calendarDays = useMemo(
    () => generateCalendarDays(currentMonth, locale.weekStartsOn),
    [currentMonth, locale.weekStartsOn]
  );
  
  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, -1));
  }, []);
  
  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);
  
  const isDisabled = useCallback(
    (date: CalendarDate) => isDateDisabled(date, minDate, maxDate, disabledDates),
    [minDate, maxDate, disabledDates]
  );
  
  const isSelected = useCallback(
    (date: CalendarDate) => isSameDay(date, selectedDate),
    [selectedDate]
  );
  
  const isInSelectedRange = useCallback(
    (date: CalendarDate) => {
      if (!selectedRange.start || !selectedRange.end) return false;
      const start = selectedRange.start;
      const end = selectedRange.end;
      
      const dateValue = date.year * 10000 + date.month * 100 + date.day;
      const startValue = start.year * 10000 + start.month * 100 + start.day;
      const endValue = end.year * 10000 + end.month * 100 + end.day;
      
      return dateValue > startValue && dateValue < endValue;
    },
    [selectedRange]
  );
  
  const isRangeStart = useCallback(
    (date: CalendarDate) => isSameDay(date, selectedRange.start),
    [selectedRange.start]
  );
  
  const isRangeEnd = useCallback(
    (date: CalendarDate) => isSameDay(date, selectedRange.end),
    [selectedRange.end]
  );
  
  const selectDate = useCallback(
    (date: CalendarDate) => {
      if (isDisabled(date)) return;
      
      if (isRangeMode) {
        let newRange: DateRange;
        
        if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
          // Start new range
          newRange = { start: date, end: null };
        } else {
          // Complete the range
          const startValue = selectedRange.start.year * 10000 + selectedRange.start.month * 100 + selectedRange.start.day;
          const dateValue = date.year * 10000 + date.month * 100 + date.day;
          
          if (dateValue < startValue) {
            newRange = { start: date, end: selectedRange.start };
          } else {
            newRange = { start: selectedRange.start, end: date };
          }
        }
        
        if (!isRangeControlled) {
          setInternalRange(newRange);
        }
        onRangeChange?.(newRange);
      } else {
        const newValue = isSameDay(date, selectedDate) ? null : date;
        
        if (!isControlled) {
          setInternalSelectedDate(newValue);
        }
        onChange?.(newValue);
      }
    },
    [isRangeMode, selectedRange, selectedDate, isControlled, isRangeControlled, onChange, onRangeChange, isDisabled]
  );
  
  const contextValue = useMemo<CalendarContextValue>(
    () => ({
      currentMonth,
      focusedDate,
      selectedDate: selectedDate ?? null,
      selectedRange,
      isRangeMode,
      minDate,
      maxDate,
      disabledDates,
      locale,
      calendarDays,
      setCurrentMonth,
      goToPreviousMonth,
      goToNextMonth,
      selectDate,
      setFocusedDate,
      isDisabled,
      isSelected,
      isInSelectedRange,
      isRangeStart,
      isRangeEnd,
    }),
    [
      currentMonth,
      focusedDate,
      selectedDate,
      selectedRange,
      isRangeMode,
      minDate,
      maxDate,
      disabledDates,
      locale,
      calendarDays,
      goToPreviousMonth,
      goToNextMonth,
      selectDate,
      isDisabled,
      isSelected,
      isInSelectedRange,
      isRangeStart,
      isRangeEnd,
    ]
  );
  
  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  );
}
