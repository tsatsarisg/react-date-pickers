import { useState, useCallback, useMemo } from 'react';
import { CalendarProvider } from '../../context/CalendarContext';
import { CalendarHeader } from '../CalendarHeader';
import { MonthGrid } from '../MonthGrid';
import { type DateRangePickerProps } from '../../types';
import { addMonths, today } from '../../utils/date';

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  locale,
  weekStartsOn,
  className,
  'aria-label': ariaLabel = 'Date range picker',
  numberOfMonths = 2,
  id,
  disabled = false,
  classNames,
  renderDay,
  header,
  footer,
}: DateRangePickerProps) {
  const initialMonth = value?.start ?? defaultValue?.start ?? today();
  const [leftMonth, setLeftMonth] = useState(initialMonth);

  const rightMonth = useMemo(() => addMonths(leftMonth, 1), [leftMonth]);

  const goToPreviousMonth = useCallback(() => {
    setLeftMonth((prev) => addMonths(prev, -1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setLeftMonth((prev) => addMonths(prev, 1));
  }, []);

  const sharedProps = {
    rangeValue: value,
    defaultRangeValue: defaultValue,
    onRangeChange: onChange,
    minDate,
    maxDate,
    disabledDates,
    locale,
    weekStartsOn,
  };

  if (numberOfMonths === 1) {
    return (
      <CalendarProvider {...sharedProps}>
        <div
          id={id}
          className={classNames?.root ?? className}
          role="group"
          aria-label={ariaLabel}
          aria-disabled={disabled || undefined}
          data-disabled={disabled || undefined}
        >
          {header ?? (
            <CalendarHeader
              className={classNames?.header}
              navButtonClassName={classNames?.navButton}
              captionClassName={classNames?.caption}
            />
          )}
          <MonthGrid
            className={classNames?.grid}
            weekdaysClassName={classNames?.weekdays}
            weekdayClassName={classNames?.weekday}
            daysClassName={classNames?.days}
            dayClassName={classNames?.day}
            renderDay={renderDay}
          />
          {footer && <div className={classNames?.footer}>{footer}</div>}
        </div>
      </CalendarProvider>
    );
  }

  // Two-month view
  return (
    <CalendarProvider {...sharedProps}>
      <div
        id={id}
        className={classNames?.root ?? className}
        role="group"
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
        style={{ display: 'inline-flex', gap: '1rem' }}
      >
        {/* Left month */}
        <div className={classNames?.month}>
          <CalendarHeader
            className={classNames?.header}
            navButtonClassName={classNames?.navButton}
            captionClassName={classNames?.caption}
            month={leftMonth}
            onPreviousMonth={goToPreviousMonth}
            showNextButton={false}
          />
          <MonthGrid
            className={classNames?.grid}
            weekdaysClassName={classNames?.weekdays}
            weekdayClassName={classNames?.weekday}
            daysClassName={classNames?.days}
            dayClassName={classNames?.day}
            month={leftMonth}
            renderDay={renderDay}
          />
        </div>

        {/* Right month */}
        <div className={classNames?.month}>
          <CalendarHeader
            className={classNames?.header}
            navButtonClassName={classNames?.navButton}
            captionClassName={classNames?.caption}
            month={rightMonth}
            onNextMonth={goToNextMonth}
            showPreviousButton={false}
          />
          <MonthGrid
            className={classNames?.grid}
            weekdaysClassName={classNames?.weekdays}
            weekdayClassName={classNames?.weekday}
            daysClassName={classNames?.days}
            dayClassName={classNames?.day}
            month={rightMonth}
            renderDay={renderDay}
          />
        </div>

        {footer && <div className={classNames?.footer}>{footer}</div>}
      </div>
    </CalendarProvider>
  );
}

export default DateRangePicker;
