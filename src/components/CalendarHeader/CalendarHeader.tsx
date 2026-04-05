import { useCalendarContext } from '../../context/CalendarContext';
import { formatMonthYear, addMonths, isBefore, isAfter, startOfMonth } from '../../utils/date';
import { type CalendarHeaderProps } from '../../types';

export function CalendarHeader({
  className,
  showPreviousButton = true,
  showNextButton = true,
  month,
  onPreviousMonth,
  onNextMonth,
  navButtonClassName,
  captionClassName,
}: CalendarHeaderProps) {
  const { currentMonth, goToPreviousMonth, goToNextMonth, minDate, maxDate, locale } =
    useCalendarContext();

  const displayMonth = month ?? currentMonth;
  const handlePrevious = onPreviousMonth ?? goToPreviousMonth;
  const handleNext = onNextMonth ?? goToNextMonth;

  const canGoToPrevious = !minDate || !isBefore(startOfMonth(displayMonth), startOfMonth(addMonths(minDate, 1)));
  const canGoToNext = !maxDate || !isAfter(startOfMonth(addMonths(displayMonth, 1)), startOfMonth(maxDate));

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      {showPreviousButton ? (
        <button
          type="button"
          onClick={handlePrevious}
          disabled={!canGoToPrevious}
          className={navButtonClassName}
          aria-label="Previous month"
        >
          <ChevronLeftIcon />
        </button>
      ) : (
        <span />
      )}

      <h2
        className={captionClassName}
        aria-live="polite"
        aria-atomic="true"
      >
        {formatMonthYear(displayMonth, locale)}
      </h2>

      {showNextButton ? (
        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoToNext}
          className={navButtonClassName}
          aria-label="Next month"
        >
          <ChevronRightIcon />
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      width={20}
      height={20}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      width={20}
      height={20}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default CalendarHeader;
