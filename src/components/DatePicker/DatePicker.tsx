import { CalendarProvider } from '../../context/CalendarContext';
import { CalendarHeader } from '../CalendarHeader';
import { MonthGrid } from '../MonthGrid';
import { type DatePickerProps } from '../../types';

export function DatePicker({
  value,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  locale,
  weekStartsOn,
  className,
  'aria-label': ariaLabel = 'Date picker',
  header,
  footer,
  id,
  disabled = false,
  classNames,
  renderDay,
}: DatePickerProps) {
  return (
    <CalendarProvider
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      disabledDates={disabledDates}
      locale={locale}
      weekStartsOn={weekStartsOn}
    >
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

export default DatePicker;
