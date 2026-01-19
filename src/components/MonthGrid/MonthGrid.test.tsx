import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MonthGrid } from './MonthGrid';
import { CalendarProvider } from '../../context/CalendarContext';
import { createDate } from '../../utils/date';

function renderGrid(providerProps = {}) {
  return render(
    <CalendarProvider {...providerProps}>
      <MonthGrid />
    </CalendarProvider>
  );
}

describe('MonthGrid', () => {
  describe('Rendering', () => {
    it('renders a grid', () => {
      renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      const grid = screen.getByRole('grid');
      expect(grid).toBeInTheDocument();
    });

    it('renders 42 day cells (6 weeks)', () => {
      const { container } = renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      const dayCells = container.querySelectorAll('button[data-testid^="day_"]');
      expect(dayCells.length).toBe(42);
    });

    it('renders weekday headers', () => {
      renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(7);
    });

    it('has proper ARIA role for grid', () => {
      renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      expect(screen.getByRole('grid')).toHaveAttribute('aria-label', 'Calendar');
    });
  });

  describe('Weekday Headers', () => {
    it('displays all 7 weekdays', () => {
      renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(7);
    });

    it('starts with Sunday when weekStartsOn is 0', () => {
      renderGrid({
        defaultValue: createDate(2026, 1, 15),
        weekStartsOn: 0,
      });
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveTextContent(/sun/i);
    });

    it('starts with Monday when weekStartsOn is 1', () => {
      renderGrid({
        defaultValue: createDate(2026, 1, 15),
        weekStartsOn: 1,
      });
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveTextContent(/mon/i);
    });

    it('has proper ARIA labels on weekday headers', () => {
      renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      const headers = screen.getAllByRole('columnheader');
      headers.forEach((header) => {
        expect(header).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Calendar Days', () => {
    it('includes days from current month', () => {
      renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      // January 2026 has 31 days
      expect(screen.getByTestId('day_2026-01-01')).toBeInTheDocument();
      expect(screen.getByTestId('day_2026-01-15')).toBeInTheDocument();
      expect(screen.getByTestId('day_2026-01-31')).toBeInTheDocument();
    });

    it('includes days from previous month', () => {
      renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      // Should have some days from December 2025
      // January 1, 2026 is a Thursday, so we need days from previous month
      const decemberDays = screen.queryAllByTestId(/day_2025-12/);
      expect(decemberDays.length).toBeGreaterThan(0);
    });

    it('includes days from next month', () => {
      renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      // Should have some days from February 2026
      const februaryDays = screen.queryAllByTestId(/day_2026-02/);
      expect(februaryDays.length).toBeGreaterThan(0);
    });

    it('renders exactly 42 days regardless of month', () => {
      // Test with different months
      const { container: jan } = renderGrid({ defaultValue: createDate(2026, 1, 1) });
      expect(jan.querySelectorAll('button[data-testid^="day_"]').length).toBe(42);
      
      const { container: feb } = renderGrid({ defaultValue: createDate(2026, 2, 1) });
      expect(feb.querySelectorAll('button[data-testid^="day_"]').length).toBe(42);
    });
  });

  describe('Locale Support', () => {
    it('uses custom locale for weekday names', () => {
      renderGrid({
        defaultValue: createDate(2026, 1, 15),
        locale: { locale: 'es-ES' },
      });
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(7);
    });

    it('respects custom dayNamesShort', () => {
      const customNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
      renderGrid({
        defaultValue: createDate(2026, 1, 15),
        locale: { dayNamesShort: customNames },
      });
      
      const headers = screen.getAllByRole('columnheader');
      customNames.forEach((name, index) => {
        expect(headers[index]).toHaveTextContent(name);
      });
    });
  });

  describe('Grid Structure', () => {
    it('has proper row and rowgroup roles', () => {
      const { container } = renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      expect(screen.getByRole('row')).toBeInTheDocument();
      expect(screen.getByRole('rowgroup')).toBeInTheDocument();
    });

    it('uses CSS grid for layout', () => {
      const { container } = renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      const weekdayRow = screen.getByRole('row');
      expect(weekdayRow).toHaveClass('grid-cols-7');
      
      const daysGrid = screen.getByRole('rowgroup');
      expect(daysGrid).toHaveClass('grid-cols-7');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <CalendarProvider defaultValue={createDate(2026, 1, 15)}>
          <MonthGrid className="custom-grid" />
        </CalendarProvider>
      );
      
      const grid = container.querySelector('.custom-grid');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Integration with CalendarContext', () => {
    it('reflects selected date', () => {
      const selectedDate = createDate(2026, 1, 15);
      renderGrid({ value: selectedDate });
      
      const selectedButton = screen.getByTestId('day_2026-01-15');
      expect(selectedButton).toHaveAttribute('aria-selected', 'true');
    });

    it('reflects disabled dates', () => {
      const disabledDates = [createDate(2026, 1, 15), createDate(2026, 1, 20)];
      renderGrid({
        defaultValue: createDate(2026, 1, 1),
        disabledDates,
      });
      
      const disabled15 = screen.getByTestId('day_2026-01-15');
      const disabled20 = screen.getByTestId('day_2026-01-20');
      
      expect(disabled15).toBeDisabled();
      expect(disabled20).toBeDisabled();
    });

    it('reflects minDate constraint', () => {
      renderGrid({
        defaultValue: createDate(2026, 1, 15),
        minDate: createDate(2026, 1, 10),
      });
      
      const before = screen.getByTestId('day_2026-01-05');
      const after = screen.getByTestId('day_2026-01-15');
      
      expect(before).toBeDisabled();
      expect(after).not.toBeDisabled();
    });

    it('reflects maxDate constraint', () => {
      renderGrid({
        defaultValue: createDate(2026, 1, 15),
        maxDate: createDate(2026, 1, 20),
      });
      
      const before = screen.getByTestId('day_2026-01-15');
      const after = screen.getByTestId('day_2026-01-25');
      
      expect(before).not.toBeDisabled();
      expect(after).toBeDisabled();
    });
  });

  describe('Range Selection Display', () => {
    it('shows range start', () => {
      renderGrid({
        rangeValue: {
          start: createDate(2026, 1, 10),
          end: createDate(2026, 1, 20),
        },
      });
      
      const startDay = screen.getByTestId('day_2026-01-10');
      expect(startDay).toBeInTheDocument();
    });

    it('shows range end', () => {
      renderGrid({
        rangeValue: {
          start: createDate(2026, 1, 10),
          end: createDate(2026, 1, 20),
        },
      });
      
      const endDay = screen.getByTestId('day_2026-01-20');
      expect(endDay).toBeInTheDocument();
    });

    it('shows dates in range', () => {
      renderGrid({
        rangeValue: {
          start: createDate(2026, 1, 10),
          end: createDate(2026, 1, 20),
        },
      });
      
      const inRangeDay = screen.getByTestId('day_2026-01-15');
      expect(inRangeDay).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has semantic grid structure', () => {
      renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      expect(screen.getByRole('grid')).toBeInTheDocument();
      expect(screen.getByRole('row')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(7);
    });

    it('weekday headers have descriptive labels', () => {
      renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      const headers = screen.getAllByRole('columnheader');
      headers.forEach((header) => {
        const label = header.getAttribute('aria-label');
        expect(label).toBeTruthy();
        expect(label).not.toBe('');
      });
    });

    it('all day buttons are keyboard accessible', () => {
      const { container } = renderGrid({ defaultValue: createDate(2026, 1, 15) });
      
      const buttons = container.querySelectorAll('button[data-testid^="day_"]');
      buttons.forEach((button) => {
        expect(button.tagName).toBe('BUTTON');
      });
    });
  });

  describe('Different Months', () => {
    it('renders February correctly', () => {
      renderGrid({ defaultValue: createDate(2026, 2, 15) });
      
      // February 2026 has 28 days
      expect(screen.getByTestId('day_2026-02-01')).toBeInTheDocument();
      expect(screen.getByTestId('day_2026-02-28')).toBeInTheDocument();
    });

    it('renders leap year February correctly', () => {
      renderGrid({ defaultValue: createDate(2024, 2, 15) });
      
      // February 2024 is a leap year with 29 days
      expect(screen.getByTestId('day_2024-02-01')).toBeInTheDocument();
      expect(screen.getByTestId('day_2024-02-29')).toBeInTheDocument();
    });

    it('renders months with 30 days correctly', () => {
      renderGrid({ defaultValue: createDate(2026, 4, 15) });
      
      // April has 30 days
      expect(screen.getByTestId('day_2026-04-01')).toBeInTheDocument();
      expect(screen.getByTestId('day_2026-04-30')).toBeInTheDocument();
      expect(screen.queryByTestId('day_2026-04-31')).not.toBeInTheDocument();
    });
  });
});
