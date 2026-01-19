import { useCalendarContext } from '../../context/CalendarContext';
import { formatMonthYear, addMonths, isBefore, isAfter, startOfMonth } from '../../utils/date';
import { clsx } from 'clsx';

interface CalendarHeaderProps {
  className?: string;
  showPreviousButton?: boolean;
  showNextButton?: boolean;
}

export function CalendarHeader({
  className,
  showPreviousButton = true,
  showNextButton = true,
}: CalendarHeaderProps) {
  const { currentMonth, goToPreviousMonth, goToNextMonth, minDate, maxDate, locale } =
    useCalendarContext();

  const canGoToPrevious = !minDate || !isBefore(startOfMonth(currentMonth), startOfMonth(addMonths(minDate, 1)));
  const canGoToNext = !maxDate || !isAfter(startOfMonth(addMonths(currentMonth, 1)), startOfMonth(maxDate));

  return (
    <div
      className={clsx(
        'flex items-center justify-between px-2 py-3',
        className
      )}
    >
      {showPreviousButton ? (
        <button
          type="button"
          onClick={goToPreviousMonth}
          disabled={!canGoToPrevious}
          className={clsx(
            'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
            'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
            !canGoToPrevious && 'cursor-not-allowed opacity-30'
          )}
          aria-label="Previous month"
        >
          <ChevronLeftIcon />
        </button>
      ) : (
        <div className="w-8" />
      )}

      <h2
        className="text-sm font-semibold text-gray-900"
        aria-live="polite"
        aria-atomic="true"
      >
        {formatMonthYear(currentMonth, locale)}
      </h2>

      {showNextButton ? (
        <button
          type="button"
          onClick={goToNextMonth}
          disabled={!canGoToNext}
          className={clsx(
            'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
            'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
            !canGoToNext && 'cursor-not-allowed opacity-30'
          )}
          aria-label="Next month"
        >
          <ChevronRightIcon />
        </button>
      ) : (
        <div className="w-8" />
      )}
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      className="h-5 w-5 text-gray-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="h-5 w-5 text-gray-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default CalendarHeader;
