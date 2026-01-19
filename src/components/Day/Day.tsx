import { useCallback, useMemo, type KeyboardEvent } from 'react';
import { clsx } from 'clsx';
import { type CalendarDate } from '../../types';
import { isSameMonth, today, isSameDay, toISOString, addDays, addMonths, getDaysInMonth, createDate, isDateDisabled } from '../../utils/date';
import { useCalendarContext } from '../../context/CalendarContext';

interface DayProps {
  date: CalendarDate;
  className?: string;
  /** Override the current month for display purposes (used in dual-month views) */
  overrideCurrentMonth?: CalendarDate;
}

export function Day({ date, className, overrideCurrentMonth }: DayProps) {
  const {
    currentMonth,
    selectDate,
    isDisabled,
    isSelected,
    isInSelectedRange,
    isRangeStart,
    isRangeEnd,
    focusedDate,
    setFocusedDate,
    setCurrentMonth,
    isRangeMode,
    locale,
    minDate,
    maxDate,
  } = useCalendarContext();

  const displayMonth = overrideCurrentMonth ?? currentMonth;
  const isCurrentMonth = isSameMonth(date, displayMonth);
  const isToday = isSameDay(date, today());
  const disabled = isDisabled(date);
  const selected = isSelected(date);
  const inRange = isInSelectedRange(date);
  const rangeStart = isRangeStart(date);
  const rangeEnd = isRangeEnd(date);
  const isFocused = isSameDay(date, focusedDate);

  // Internationalized aria-label
  const ariaLabel = useMemo(() => {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.toLocaleDateString(locale.locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [date, locale.locale]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      selectDate(date);
    }
  }, [disabled, selectDate, date]);

  // Clamp date to min/max boundaries
  const clampDate = useCallback((newDate: CalendarDate): CalendarDate => {
    if (minDate && isDateDisabled(newDate, minDate, undefined, undefined)) {
      return minDate;
    }
    if (maxDate && isDateDisabled(newDate, undefined, maxDate, undefined)) {
      return maxDate;
    }
    return newDate;
  }, [minDate, maxDate]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      let newFocusedDate: CalendarDate | null = null;

      switch (event.key) {
        case 'ArrowLeft':
          newFocusedDate = clampDate(addDays(date, -1));
          break;
        case 'ArrowRight':
          newFocusedDate = clampDate(addDays(date, 1));
          break;
        case 'ArrowUp':
          newFocusedDate = clampDate(addDays(date, -7));
          break;
        case 'ArrowDown':
          newFocusedDate = clampDate(addDays(date, 7));
          break;
        case 'Home':
          // First day of month
          newFocusedDate = clampDate(createDate(date.year, date.month, 1));
          break;
        case 'End':
          // Last day of month
          newFocusedDate = clampDate(createDate(date.year, date.month, getDaysInMonth(date.year, date.month)));
          break;
        case 'PageUp':
          // Same day, previous month (or closest valid date)
          if (event.shiftKey) {
            // Previous year
            newFocusedDate = clampDate(createDate(date.year - 1, date.month, Math.min(date.day, getDaysInMonth(date.year - 1, date.month))));
          } else {
            const prevMonth = addMonths(date, -1);
            const maxDay = getDaysInMonth(prevMonth.year, prevMonth.month);
            newFocusedDate = clampDate(createDate(prevMonth.year, prevMonth.month, Math.min(date.day, maxDay)));
          }
          break;
        case 'PageDown':
          // Same day, next month (or closest valid date)
          if (event.shiftKey) {
            // Next year
            newFocusedDate = clampDate(createDate(date.year + 1, date.month, Math.min(date.day, getDaysInMonth(date.year + 1, date.month))));
          } else {
            const nextMonth = addMonths(date, 1);
            const maxDay = getDaysInMonth(nextMonth.year, nextMonth.month);
            newFocusedDate = clampDate(createDate(nextMonth.year, nextMonth.month, Math.min(date.day, maxDay)));
          }
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          handleClick();
          return;
        default:
          return;
      }

      if (newFocusedDate) {
        event.preventDefault();
        setFocusedDate(newFocusedDate);
        if (!isSameMonth(newFocusedDate, currentMonth)) {
          setCurrentMonth(newFocusedDate);
        }
      }
    },
    [date, handleClick, setFocusedDate, setCurrentMonth, currentMonth, clampDate]
  );

  return (
    <button
      type="button"
      data-testid={`day_${toISOString(date)}`}
      className={clsx(
        // Base styles
        'relative flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        // Disabled state
        disabled && 'cursor-not-allowed opacity-30',
        // Outside current month
        !isCurrentMonth && 'text-gray-400',
        // Today indicator
        isToday && !selected && 'ring-1 ring-blue-500',
        // Selected state (single date)
        selected && !isRangeMode && 'bg-blue-600 text-white hover:bg-blue-700',
        // Range selection states
        rangeStart && 'bg-blue-600 text-white rounded-l-lg rounded-r-none',
        rangeEnd && 'bg-blue-600 text-white rounded-r-lg rounded-l-none',
        inRange && 'bg-blue-100 rounded-none',
        // Hover state
        !disabled && !selected && !rangeStart && !rangeEnd && !inRange && 
          'hover:bg-gray-100',
        // Default text color
        isCurrentMonth && !selected && !rangeStart && !rangeEnd && 'text-gray-900',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      tabIndex={isFocused ? 0 : -1}
      aria-label={ariaLabel}
      aria-selected={selected || rangeStart || rangeEnd}
      aria-disabled={disabled}
      role="gridcell"
    >
      {date.day}
    </button>
  );
}

export default Day;
