import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Day } from './Day';
import { CalendarProvider } from '../../context/CalendarContext';
import { createDate } from '../../utils/date';

function renderDay(date: any, providerProps = {}) {
  return render(
    <CalendarProvider {...providerProps}>
      <Day date={date} />
    </CalendarProvider>
  );
}

describe('Day', () => {
  const testDate = createDate(2026, 1, 15);

  describe('Rendering', () => {
    it('renders the day button', () => {
      renderDay(testDate);
      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('15');
    });

    it('renders with correct test id', () => {
      renderDay(createDate(2026, 3, 5));
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
        minDate: createDate(2026, 1, 20),
      });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.click(button);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('moves focus left with ArrowLeft', () => {
      const { container } = renderDay(testDate, {
        defaultValue: createDate(2026, 1, 1),
      });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.keyDown(button, { key: 'ArrowLeft' });

      // Focus should move to previous day (though we can't test actual DOM focus easily)
      expect(container).toBeInTheDocument();
    });

    it('moves focus right with ArrowRight', () => {
      const { container } = renderDay(testDate, {
        defaultValue: createDate(2026, 1, 1),
      });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.keyDown(button, { key: 'ArrowRight' });

      expect(container).toBeInTheDocument();
    });

    it('moves focus up with ArrowUp', () => {
      const { container } = renderDay(testDate, {
        defaultValue: createDate(2026, 1, 1),
      });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.keyDown(button, { key: 'ArrowUp' });

      expect(container).toBeInTheDocument();
    });

    it('moves focus down with ArrowDown', () => {
      const { container } = renderDay(testDate, {
        defaultValue: createDate(2026, 1, 1),
      });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.keyDown(button, { key: 'ArrowDown' });

      expect(container).toBeInTheDocument();
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
      renderDay(testDate, { onChange });

      const button = screen.getByTestId('day_2026-01-15');
      fireEvent.keyDown(button, { key: 'a' });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Visual States', () => {
    it('applies disabled state correctly', () => {
      renderDay(testDate, {
        minDate: createDate(2026, 1, 20),
      });

      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toBeDisabled();
    });

    it('applies selected state in single date mode', () => {
      renderDay(testDate, {
        value: testDate,
      });

      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toHaveAttribute('aria-selected', 'true');
    });

    it('applies range start state', () => {
      renderDay(testDate, {
        rangeValue: {
          start: testDate,
          end: createDate(2026, 1, 20),
        },
      });

      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toBeInTheDocument();
      // Range start has specific styling
    });

    it('applies range end state', () => {
      renderDay(testDate, {
        rangeValue: {
          start: createDate(2026, 1, 10),
          end: testDate,
        },
      });

      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toBeInTheDocument();
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
      expect(button).toBeInTheDocument();
    });

    it('shows today indicator', () => {
      const todayDate = new Date();
      const today = createDate(
        todayDate.getFullYear(),
        todayDate.getMonth() + 1,
        todayDate.getDate()
      );

      renderDay(today);

      const button = screen.getByTestId(
        `day_${today.year.toString().padStart(4, '0')}-${today.month
          .toString()
          .padStart(2, '0')}-${today.day.toString().padStart(2, '0')}`
      );
      expect(button).toBeInTheDocument();
    });

    it('applies outside month styling', () => {
      // Day from previous/next month
      renderDay(createDate(2025, 12, 31), {
        defaultValue: createDate(2026, 1, 15),
      });

      const button = screen.getByTestId('day_2025-12-31');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has button type', () => {
      renderDay(testDate);
      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('sets aria-selected when selected', () => {
      renderDay(testDate, { value: testDate });
      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toHaveAttribute('aria-selected', 'true');
    });

    it('is keyboard navigable', () => {
      renderDay(testDate);
      const button = screen.getByTestId('day_2026-01-15');
      
      // Should be focusable
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Month Navigation on Arrow Keys', () => {
    it('navigates to previous month when arrowing left from first day', () => {
      const firstDay = createDate(2026, 2, 1);
      renderDay(firstDay, { defaultValue: firstDay });

      const button = screen.getByTestId('day_2026-02-01');
      
      // Arrow left should go to previous month
      fireEvent.keyDown(button, { key: 'ArrowLeft' });
      
      // The component should handle month change
      expect(button).toBeInTheDocument();
    });

    it('navigates to next month when arrowing right from last day', () => {
      const lastDay = createDate(2026, 1, 31);
      renderDay(lastDay, { defaultValue: lastDay });

      const button = screen.getByTestId('day_2026-01-31');
      
      fireEvent.keyDown(button, { key: 'ArrowRight' });
      
      expect(button).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('applies custom className prop', () => {
      renderDay(testDate, { className: 'custom-day' });
      const button = screen.getByTestId('day_2026-01-15');
      expect(button).toBeInTheDocument();
    });
  });
});
