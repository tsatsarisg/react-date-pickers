import { useCallback, type KeyboardEvent } from 'react';
import { clsx } from 'clsx';
import { type CalendarDate } from '../../types';
import { isSameMonth, today, isSameDay, toISOString, addDays } from '../../utils/date';
import { useCalendarContext } from '../../context/CalendarContext';

interface DayProps {
  date: CalendarDate;
  className?: string;
}

export function Day({ date, className }: DayProps) {
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
  } = useCalendarContext();

  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isToday = isSameDay(date, today());
  const disabled = isDisabled(date);
  const selected = isSelected(date);
  const inRange = isInSelectedRange(date);
  const rangeStart = isRangeStart(date);
  const rangeEnd = isRangeEnd(date);
  const isFocused = isSameDay(date, focusedDate);

  const handleClick = useCallback(() => {
    if (!disabled) {
      selectDate(date);
    }
  }, [disabled, selectDate, date]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      let newFocusedDate: CalendarDate | null = null;

      switch (event.key) {
        case 'ArrowLeft':
          newFocusedDate = addDays(date, -1);
          break;
        case 'ArrowRight':
          newFocusedDate = addDays(date, 1);
          break;
        case 'ArrowUp':
          newFocusedDate = addDays(date, -7);
          break;
        case 'ArrowDown':
          newFocusedDate = addDays(date, 7);
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
    [date, handleClick, setFocusedDate, setCurrentMonth, currentMonth]
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
      aria-label={`${date.day}, ${date.month}/${date.year}`}
      aria-selected={selected || rangeStart || rangeEnd}
      aria-disabled={disabled}
      role="gridcell"
    >
      {date.day}
    </button>
  );
}

export default Day;
