import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Day } from './Day';
import { MonthGrid } from '../MonthGrid';
import { CalendarProvider } from '../../context/CalendarContext';
import { type CalendarDate } from '../../types';
import { createDate } from '../../utils/date';

function renderDay(date: CalendarDate, providerProps = {}) {
  return render(
    <CalendarProvider {...providerProps}>
      <Day date={date} />
    </CalendarProvider>
  );
}

function renderGrid(providerProps = {}) {
  return render(
    <CalendarProvider {...providerProps}>
      <MonthGrid />
    </CalendarProvider>
  );
}

describe('Day', () => {
  const testDate = createDate(2026, 1, 15);

  describe('Rendering', () => {
    it('renders the day button', () => {
      renderDay(testDate, { defaultValue: createDate(2026, 1, 1) });
      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('15');
    });

    it('renders with correct test id', () => {
      renderDay(createDate(2026, 3, 5), { defaultValue: createDate(2026, 3, 1) });
      expect(screen.getByTestId('day_2026-03-05')).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('calls selectDate when clicked', () => {
      const onChange = vi.fn();
      renderDay(testDate, { onChange, defaultValue: createDate(2026, 1, 1) });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.click(button);

      expect(onChange).toHaveBeenCalledWith(testDate);
    });

    it('does not call selectDate when disabled', () => {
      const onChange = vi.fn();
      renderDay(testDate, {
        onChange,
        defaultValue: createDate(2026, 1, 1),
        minDate: createDate(2026, 1, 20),
      });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.click(button);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('moves focus left with ArrowLeft', () => {
      renderGrid({ defaultValue: testDate });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.keyDown(button, { key: 'ArrowLeft' });

      const day14 = screen.getByTestId('day_2026-01-14');
      expect(day14).toHaveAttribute('tabindex', '0');
      expect(button).toHaveAttribute('tabindex', '-1');
    });

    it('moves focus right with ArrowRight', () => {
      renderGrid({ defaultValue: testDate });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.keyDown(button, { key: 'ArrowRight' });

      const day16 = screen.getByTestId('day_2026-01-16');
      expect(day16).toHaveAttribute('tabindex', '0');
      expect(button).toHaveAttribute('tabindex', '-1');
    });

    it('moves focus up with ArrowUp', () => {
      renderGrid({ defaultValue: testDate });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.keyDown(button, { key: 'ArrowUp' });

      const day8 = screen.getByTestId('day_2026-01-08');
      expect(day8).toHaveAttribute('tabindex', '0');
      expect(button).toHaveAttribute('tabindex', '-1');
    });

    it('moves focus down with ArrowDown', () => {
      renderGrid({ defaultValue: testDate });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.keyDown(button, { key: 'ArrowDown' });

      const day22 = screen.getByTestId('day_2026-01-22');
      expect(day22).toHaveAttribute('tabindex', '0');
      expect(button).toHaveAttribute('tabindex', '-1');
    });

    it('selects date with Enter key', () => {
      const onChange = vi.fn();
      renderDay(testDate, {
        onChange,
        defaultValue: createDate(2026, 1, 1),
      });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith(testDate);
    });

    it('selects date with Space key', () => {
      const onChange = vi.fn();
      renderDay(testDate, {
        onChange,
        defaultValue: createDate(2026, 1, 1),
      });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.keyDown(button, { key: ' ' });

      expect(onChange).toHaveBeenCalledWith(testDate);
    });

    it('does nothing for other keys', () => {
      const onChange = vi.fn();
      renderDay(testDate, { onChange, defaultValue: createDate(2026, 1, 1) });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.keyDown(button, { key: 'a' });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Visual States', () => {
    it('applies disabled state correctly', () => {
      renderDay(testDate, {
        defaultValue: createDate(2026, 1, 1),
        minDate: createDate(2026, 1, 20),
      });

      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('data-disabled');
    });

    it('applies selected state in single date mode', () => {
      renderDay(testDate, {
        value: testDate,
      });

      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toHaveAttribute('aria-selected', 'true');
      expect(button).toHaveAttribute('data-selected');
    });

    it('applies range start state', () => {
      renderDay(testDate, {
        rangeValue: {
          start: testDate,
          end: createDate(2026, 1, 20),
        },
      });

      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toHaveAttribute('data-range-start');
    });

    it('applies range end state', () => {
      renderDay(testDate, {
        rangeValue: {
          start: createDate(2026, 1, 10),
          end: testDate,
        },
      });

      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toHaveAttribute('data-range-end');
    });

    it('applies in-range state', () => {
      const inRangeDate = createDate(2026, 1, 15);
      renderDay(inRangeDate, {
        rangeValue: {
          start: createDate(2026, 1, 10),
          end: createDate(2026, 1, 20),
        },
      });

      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toHaveAttribute('data-in-range');
    });

    it('applies outside month state', () => {
      renderDay(createDate(2025, 12, 31), {
        defaultValue: createDate(2026, 1, 15),
      });

      const button = screen.getByTestId('day_2025-12-31');
      expect(button).toHaveAttribute('data-outside');
    });
  });

  describe('Accessibility', () => {
    it('has button type', () => {
      renderDay(testDate, { defaultValue: createDate(2026, 1, 1) });
      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('sets aria-selected when selected', () => {
      renderDay(testDate, { value: testDate });
      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toHaveAttribute('aria-selected', 'true');
    });

    it('has role gridcell', () => {
      renderDay(testDate, { defaultValue: createDate(2026, 1, 1) });
      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toHaveAttribute('role', 'gridcell');
    });

    it('has internationalized aria-label', () => {
      renderDay(testDate, { defaultValue: createDate(2026, 1, 1) });
      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toHaveAttribute('aria-label');
      expect(button.getAttribute('aria-label')).toContain('15');
    });
  });

  describe('Month Navigation on Arrow Keys', () => {
    it('navigates to previous month when arrowing left from first day', () => {
      const firstDay = createDate(2026, 2, 1);
      renderGrid({ defaultValue: firstDay });

      const button = screen.getByTestId('day_2026-02-01');
      fireEvent.keyDown(button, { key: 'ArrowLeft' });

      // Jan 31 should now be focused (month changed)
      const jan31 = screen.getByTestId('day_2026-01-31');
      expect(jan31).toHaveAttribute('tabindex', '0');
    });

    it('navigates to next month when arrowing right from last day', () => {
      const lastDay = createDate(2026, 1, 31);
      renderGrid({ defaultValue: lastDay });

      const button = screen.getByTestId('day_2026-01-31');
      fireEvent.keyDown(button, { key: 'ArrowRight' });

      const feb1 = screen.getByTestId('day_2026-02-01');
      expect(feb1).toHaveAttribute('tabindex', '0');
    });
  });

  describe('renderDay', () => {
    it('uses custom renderDay when provided', () => {
      render(
        <CalendarProvider defaultValue={createDate(2026, 1, 1)}>
          <Day
            date={testDate}
            renderDay={(date, state) => (
              <span data-testid="custom-day">
                {date.day} {state.isToday ? '(today)' : ''}
              </span>
            )}
          />
        </CalendarProvider>
      );

      expect(screen.getByTestId('custom-day')).toBeInTheDocument();
    });
  });
});
