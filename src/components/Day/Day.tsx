import { useCallback, useMemo, useRef, useEffect, type KeyboardEvent } from 'react';
import { type CalendarDate, type DayProps, type DayState } from '../../types';
import { isSameMonth, isSameDay, toISOString, addDays, addMonths, getDaysInMonth, createDate, isDateDisabled } from '../../utils/date';
import { useCalendarContext } from '../../context/CalendarContext';

export function Day({ date, className, overrideCurrentMonth, renderDay }: DayProps) {
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
    todayDate,
  } = useCalendarContext();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const displayMonth = overrideCurrentMonth ?? currentMonth;
  const isCurrentMonth = isSameMonth(date, displayMonth);
  const isToday = isSameDay(date, todayDate);
  const disabled = isDisabled(date);
  const selected = isSelected(date);
  const inRange = isInSelectedRange(date);
  const rangeStart = isRangeStart(date);
  const rangeEnd = isRangeEnd(date);
  const isFocused = isSameDay(date, focusedDate);

  // Move DOM focus when this day becomes the focused date
  useEffect(() => {
    if (isFocused) {
      buttonRef.current?.focus();
    }
  }, [isFocused]);

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
      let newFocusedDate: CalendarDate;

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
          newFocusedDate = clampDate(createDate(date.year, date.month, 1));
          break;
        case 'End':
          newFocusedDate = clampDate(createDate(date.year, date.month, getDaysInMonth(date.year, date.month)));
          break;
        case 'PageUp':
          if (event.shiftKey) {
            newFocusedDate = clampDate(createDate(date.year - 1, date.month, Math.min(date.day, getDaysInMonth(date.year - 1, date.month))));
          } else {
            const prevMonth = addMonths(date, -1);
            const maxDay = getDaysInMonth(prevMonth.year, prevMonth.month);
            newFocusedDate = clampDate(createDate(prevMonth.year, prevMonth.month, Math.min(date.day, maxDay)));
          }
          break;
        case 'PageDown':
          if (event.shiftKey) {
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

      event.preventDefault();
      setFocusedDate(newFocusedDate);
      if (!isSameMonth(newFocusedDate, currentMonth)) {
        setCurrentMonth(newFocusedDate);
      }
    },
    [date, handleClick, setFocusedDate, setCurrentMonth, currentMonth, clampDate]
  );

  const state: DayState = {
    isToday,
    isSelected: selected,
    isDisabled: disabled,
    isOutsideMonth: !isCurrentMonth,
    isFocused,
    isRangeStart: rangeStart,
    isRangeEnd: rangeEnd,
    isInRange: inRange,
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      data-testid={`day_${toISOString(date)}`}
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      tabIndex={isFocused ? 0 : -1}
      aria-label={ariaLabel}
      aria-selected={selected || rangeStart || rangeEnd}
      aria-disabled={disabled}
      role="gridcell"
      data-today={isToday || undefined}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      data-outside={!isCurrentMonth || undefined}
      data-range-start={rangeStart || undefined}
      data-range-end={rangeEnd || undefined}
      data-in-range={inRange || undefined}
      data-focused={isFocused || undefined}
      data-range-mode={isRangeMode || undefined}
    >
      {renderDay ? renderDay(date, state) : date.day}
    </button>
  );
}

export default Day;
