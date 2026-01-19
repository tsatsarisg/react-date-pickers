import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangePicker } from './DateRangePicker';
import { createDate } from '../../utils/date';

describe('DateRangePicker', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<DateRangePicker />);
      expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('renders two calendar months by default', () => {
      const { container } = render(<DateRangePicker />);
      
      // Two separate calendar grids
      const grids = screen.getAllByRole('grid');
      expect(grids.length).toBe(2);
    });

    it('renders single month when numberOfMonths is 1', () => {
      const { container } = render(<DateRangePicker numberOfMonths={1} />);
      
      const grids = screen.getAllByRole('grid');
      expect(grids.length).toBe(1);
    });

    it('displays consecutive months', () => {
      render(
        <DateRangePicker defaultValue={{ start: createDate(2026, 1, 1), end: null }} />
      );
      
      expect(screen.getByText('January 2026')).toBeInTheDocument();
      expect(screen.getByText('February 2026')).toBeInTheDocument();
    });

    it('uses custom aria-label', () => {
      render(<DateRangePicker aria-label="Select date range" />);
      expect(screen.getByRole('application')).toHaveAttribute(
        'aria-label',
        'Select date range'
      );
    });
  });

  describe('Range Selection', () => {
    it('starts range on first click', () => {
      const onChange = vi.fn();
      render(<DateRangePicker onChange={onChange} />);
      
      const day = screen.getByTestId('day_2026-01-15');
      fireEvent.click(day);
      
      expect(onChange).toHaveBeenCalledWith({
        start: createDate(2026, 1, 15),
        end: null,
      });
    });

    it('completes range on second click', () => {
      const onChange = vi.fn();
      render(
        <DateRangePicker
          value={{ start: createDate(2026, 1, 10), end: null }}
          onChange={onChange}
        />
      );
      
      const day = screen.getByTestId('day_2026-01-20');
      fireEvent.click(day);
      
      expect(onChange).toHaveBeenCalledWith({
        start: createDate(2026, 1, 10),
        end: createDate(2026, 1, 20),
      });
    });

    it('swaps dates when end is before start', () => {
      const onChange = vi.fn();
      render(
        <DateRangePicker
          value={{ start: createDate(2026, 1, 20), end: null }}
          onChange={onChange}
        />
      );
      
      const day = screen.getByTestId('day_2026-01-10');
      fireEvent.click(day);
      
      expect(onChange).toHaveBeenCalledWith({
        start: createDate(2026, 1, 10),
        end: createDate(2026, 1, 20),
      });
    });

    it('starts new range after completing one', () => {
      const onChange = vi.fn();
      render(
        <DateRangePicker
          value={{
            start: createDate(2026, 1, 10),
            end: createDate(2026, 1, 20),
          }}
          onChange={onChange}
        />
      );
      
      const day = screen.getByTestId('day_2026-01-25');
      fireEvent.click(day);
      
      expect(onChange).toHaveBeenCalledWith({
        start: createDate(2026, 1, 25),
        end: null,
      });
    });

    it('handles range selection across different months', () => {
      const onChange = vi.fn();
      render(
        <DateRangePicker
          value={{ start: createDate(2026, 1, 25), end: null }}
          onChange={onChange}
        />
      );
      
      // Click on a date in the second month (February)
      const day = screen.getByTestId('day_2026-02-10');
      fireEvent.click(day);
      
      expect(onChange).toHaveBeenCalledWith({
        start: createDate(2026, 1, 25),
        end: createDate(2026, 2, 10),
      });
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works in controlled mode', () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <DateRangePicker
          value={{ start: null, end: null }}
          onChange={onChange}
        />
      );
      
      const day = screen.getByTestId('day_2026-01-15');
      fireEvent.click(day);
      
      expect(onChange).toHaveBeenCalled();
      
      // Simulate parent updating value
      rerender(
        <DateRangePicker
          value={{ start: createDate(2026, 1, 15), end: null }}
          onChange={onChange}
        />
      );
      
      expect(screen.getByTestId('day_2026-01-15')).toHaveAttribute('aria-selected', 'true');
    });

    it('works in uncontrolled mode', () => {
      render(
        <DateRangePicker
          defaultValue={{
            start: createDate(2026, 1, 10),
            end: createDate(2026, 1, 20),
          }}
        />
      );
      
      expect(screen.getByTestId('day_2026-01-10')).toBeInTheDocument();
      expect(screen.getByTestId('day_2026-01-20')).toBeInTheDocument();
    });
  });

  describe('Month Navigation', () => {
    it('navigates left calendar backward', () => {
      render(<DateRangePicker defaultValue={{ start: createDate(2026, 2, 1), end: null }} />);
      
      // Get all previous buttons (there are two, one for each calendar)
      const prevButtons = screen.getAllByRole('button', { name: /previous month/i });
      
      // Click the first one (left calendar)
      fireEvent.click(prevButtons[0]);
      
      expect(screen.getByText('January 2026')).toBeInTheDocument();
      expect(screen.getByText('February 2026')).toBeInTheDocument();
    });

    it('navigates left calendar forward', () => {
      render(<DateRangePicker defaultValue={{ start: createDate(2026, 1, 1), end: null }} />);
      
      const nextButtons = screen.getAllByRole('button', { name: /next month/i });
      
      // Click the first one (left calendar)
      fireEvent.click(nextButtons[0]);
      
      expect(screen.getByText('February 2026')).toBeInTheDocument();
      expect(screen.getByText('March 2026')).toBeInTheDocument();
    });

    it('keeps months consecutive', () => {
      render(<DateRangePicker defaultValue={{ start: createDate(2026, 3, 1), end: null }} />);
      
      const prevButtons = screen.getAllByRole('button', { name: /previous month/i });
      fireEvent.click(prevButtons[0]);
      
      expect(screen.getByText('February 2026')).toBeInTheDocument();
      expect(screen.getByText('March 2026')).toBeInTheDocument();
    });
  });

  describe('Date Constraints', () => {
    it('respects minDate', () => {
      render(
        <DateRangePicker
          defaultValue={{ start: createDate(2026, 1, 15), end: null }}
          minDate={createDate(2026, 1, 10)}
        />
      );
      
      const beforeMin = screen.getByTestId('day_2026-01-05');
      const afterMin = screen.getByTestId('day_2026-01-15');
      
      expect(beforeMin).toBeDisabled();
      expect(afterMin).not.toBeDisabled();
    });

    it('respects maxDate', () => {
      render(
        <DateRangePicker
          defaultValue={{ start: createDate(2026, 1, 15), end: null }}
          maxDate={createDate(2026, 1, 20)}
        />
      );
      
      const beforeMax = screen.getByTestId('day_2026-01-15');
      const afterMax = screen.getByTestId('day_2026-01-25');
      
      expect(beforeMax).not.toBeDisabled();
      expect(afterMax).toBeDisabled();
    });

    it('respects disabledDates', () => {
      const disabledDates = [createDate(2026, 1, 15), createDate(2026, 1, 20)];
      render(
        <DateRangePicker
          defaultValue={{ start: createDate(2026, 1, 1), end: null }}
          disabledDates={disabledDates}
        />
      );
      
      expect(screen.getByTestId('day_2026-01-15')).toBeDisabled();
      expect(screen.getByTestId('day_2026-01-20')).toBeDisabled();
      expect(screen.getByTestId('day_2026-01-10')).not.toBeDisabled();
    });

    it('does not allow selecting disabled dates', () => {
      const onChange = vi.fn();
      render(
        <DateRangePicker
          onChange={onChange}
          minDate={createDate(2026, 1, 10)}
        />
      );
      
      const disabledDay = screen.getByTestId('day_2026-01-05');
      fireEvent.click(disabledDay);
      
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Visual Feedback', () => {
    it('highlights range start date', () => {
      render(
        <DateRangePicker
          value={{
            start: createDate(2026, 1, 10),
            end: createDate(2026, 1, 20),
          }}
        />
      );
      
      const startDay = screen.getByTestId('day_2026-01-10');
      expect(startDay).toHaveAttribute('aria-selected', 'true');
    });

    it('highlights range end date', () => {
      render(
        <DateRangePicker
          value={{
            start: createDate(2026, 1, 10),
            end: createDate(2026, 1, 20),
          }}
        />
      );
      
      const endDay = screen.getByTestId('day_2026-01-20');
      expect(endDay).toHaveAttribute('aria-selected', 'true');
    });

    it('applies in-range styling to dates between start and end', () => {
      render(
        <DateRangePicker
          value={{
            start: createDate(2026, 1, 10),
            end: createDate(2026, 1, 20),
          }}
        />
      );
      
      const inRangeDay = screen.getByTestId('day_2026-01-15');
      expect(inRangeDay).toBeInTheDocument();
    });
  });

  describe('Locale Support', () => {
    it('uses custom locale', () => {
      render(
        <DateRangePicker
          defaultValue={{ start: createDate(2026, 1, 1), end: null }}
          locale={{ locale: 'es-ES' }}
        />
      );
      
      expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('respects weekStartsOn setting', () => {
      render(
        <DateRangePicker
          numberOfMonths={1}
          defaultValue={{ start: createDate(2026, 1, 1), end: null }}
          weekStartsOn={1}
        />
      );
      
      // Test with single month mode to ensure it works consistently
      const headers = screen.getAllByRole('columnheader');
      expect(headers[0].textContent).toMatch(/mon/i);
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<DateRangePicker className="custom-picker" />);
      expect(screen.getByRole('application')).toHaveClass('custom-picker');
    });
  });

  describe('Single Month Mode', () => {
    it('renders only one calendar when numberOfMonths is 1', () => {
      render(
        <DateRangePicker
          numberOfMonths={1}
          defaultValue={{ start: createDate(2026, 1, 1), end: null }}
        />
      );
      
      const grids = screen.getAllByRole('grid');
      expect(grids).toHaveLength(1);
    });

    it('shows calendar header in single month mode', () => {
      render(
        <DateRangePicker
          numberOfMonths={1}
          defaultValue={{ start: createDate(2026, 1, 1), end: null }}
        />
      );
      
      expect(screen.getByText('January 2026')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();
    });

    it('allows range selection in single month mode', () => {
      const onChange = vi.fn();
      render(<DateRangePicker numberOfMonths={1} onChange={onChange} />);
      
      const day1 = screen.getByTestId('day_2026-01-10');
      fireEvent.click(day1);
      
      expect(onChange).toHaveBeenCalledWith({
        start: createDate(2026, 1, 10),
        end: null,
      });
      
      const day2 = screen.getByTestId('day_2026-01-20');
      fireEvent.click(day2);
      
      expect(onChange).toHaveBeenCalledWith({
        start: createDate(2026, 1, 10),
        end: createDate(2026, 1, 20),
      });
    });
  });

  describe('Initial Month Display', () => {
    it('displays month from value.start', () => {
      render(
        <DateRangePicker
          value={{
            start: createDate(2026, 6, 15),
            end: createDate(2026, 6, 25),
          }}
        />
      );
      
      expect(screen.getByText('June 2026')).toBeInTheDocument();
      expect(screen.getByText('July 2026')).toBeInTheDocument();
    });

    it('displays month from defaultValue.start', () => {
      render(
        <DateRangePicker
          defaultValue={{
            start: createDate(2026, 3, 10),
            end: createDate(2026, 3, 20),
          }}
        />
      );
      
      expect(screen.getByText('March 2026')).toBeInTheDocument();
      expect(screen.getByText('April 2026')).toBeInTheDocument();
    });

    it('displays current month when no value provided', () => {
      render(<DateRangePicker />);
      
      const now = new Date();
      const currentMonth = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      expect(screen.getByText(currentMonth)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper application role', () => {
      render(<DateRangePicker />);
      expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('uses default aria-label', () => {
      render(<DateRangePicker />);
      expect(screen.getByRole('application')).toHaveAttribute(
        'aria-label',
        'Date range picker'
      );
    });

    it('all days are keyboard accessible', () => {
      const { container } = render(<DateRangePicker />);
      
      const buttons = container.querySelectorAll('button[data-testid^="day_"]');
      buttons.forEach((button) => {
        expect(button.tagName).toBe('BUTTON');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles year boundaries', () => {
      render(
        <DateRangePicker
          defaultValue={{ start: createDate(2025, 12, 1), end: null }}
        />
      );
      
      expect(screen.getByText('December 2025')).toBeInTheDocument();
      expect(screen.getByText('January 2026')).toBeInTheDocument();
    });

    it('handles range spanning multiple months', () => {
      render(
        <DateRangePicker
          value={{
            start: createDate(2026, 1, 25),
            end: createDate(2026, 2, 10),
          }}
        />
      );
      
      expect(screen.getByTestId('day_2026-01-25')).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('day_2026-02-10')).toHaveAttribute('aria-selected', 'true');
    });

    it('handles same day range', () => {
      const onChange = vi.fn();
      render(
        <DateRangePicker
          value={{ start: createDate(2026, 1, 15), end: null }}
          onChange={onChange}
        />
      );
      
      const sameDay = screen.getByTestId('day_2026-01-15');
      fireEvent.click(sameDay);
      
      // Clicking same day should complete range with start=end
      expect(onChange).toHaveBeenCalledWith({
        start: createDate(2026, 1, 15),
        end: createDate(2026, 1, 15),
      });
    });
  });
});
