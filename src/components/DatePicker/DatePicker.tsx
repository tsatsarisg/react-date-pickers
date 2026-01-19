import { type ReactNode } from 'react';
import { CalendarProvider } from '../../context/CalendarContext';
import { CalendarHeader } from '../CalendarHeader';
import { MonthGrid } from '../MonthGrid';
import { type CalendarDate, type LocaleConfig, type WeekDay } from '../../types';
import { clsx } from 'clsx';

export interface DatePickerProps {
  /** Currently selected date (controlled) */
  value?: CalendarDate | null;
  /** Default date (uncontrolled) */
  defaultValue?: CalendarDate;
  /** Called when date changes */
  onChange?: (date: CalendarDate | null) => void;
  /** Minimum selectable date */
  minDate?: CalendarDate;
  /** Maximum selectable date */
  maxDate?: CalendarDate;
  /** Array of disabled dates */
  disabledDates?: CalendarDate[];
  /** Locale settings */
  locale?: Partial<LocaleConfig>;
  /** Day the week starts on (0 = Sunday, 1 = Monday, etc.) */
  weekStartsOn?: WeekDay;
  /** Additional class name */
  className?: string;
  /** Accessible label */
  'aria-label'?: string;
  /** Custom header component */
  header?: ReactNode;
  /** Custom footer component */
  footer?: ReactNode;
}

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
        className={clsx(
          'inline-block rounded-xl border border-gray-200 bg-white p-4 shadow-lg',
          className
        )}
        role="application"
        aria-label={ariaLabel}
      >
        {header ?? <CalendarHeader />}
        <MonthGrid />
        {footer}
      </div>
    </CalendarProvider>
  );
}

export default DatePicker;
