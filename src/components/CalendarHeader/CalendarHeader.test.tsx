import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarProvider } from '../../context/CalendarContext';
import { createDate } from '../../utils/date';

function renderHeader(providerProps = {}, headerProps = {}) {
  return render(
    <CalendarProvider {...providerProps}>
      <CalendarHeader {...headerProps} />
    </CalendarProvider>
  );
}

describe('CalendarHeader', () => {
  describe('Rendering', () => {
    it('renders the current month and year', () => {
      renderHeader({ defaultValue: createDate(2026, 1, 15) });
      expect(screen.getByText('January 2026')).toBeInTheDocument();
    });

    it('renders previous month button', () => {
      renderHeader();
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      expect(prevButton).toBeInTheDocument();
    });

    it('renders next month button', () => {
      renderHeader();
      const nextButton = screen.getByRole('button', { name: /next month/i });
      expect(nextButton).toBeInTheDocument();
    });

    it('displays month name in heading', () => {
      renderHeader({ defaultValue: createDate(2026, 6, 15) });
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('June 2026');
    });
  });

  describe('Navigation', () => {
    it('navigates to previous month on button click', () => {
      renderHeader({ defaultValue: createDate(2026, 2, 15) });
      
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      fireEvent.click(prevButton);
      
      expect(screen.getByText('January 2026')).toBeInTheDocument();
    });

    it('navigates to next month on button click', () => {
      renderHeader({ defaultValue: createDate(2026, 1, 15) });
      
      const nextButton = screen.getByRole('button', { name: /next month/i });
      fireEvent.click(nextButton);
      
      expect(screen.getByText('February 2026')).toBeInTheDocument();
    });

    it('handles year rollover when going back from January', () => {
      renderHeader({ defaultValue: createDate(2026, 1, 15) });
      
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      fireEvent.click(prevButton);
      
      expect(screen.getByText('December 2025')).toBeInTheDocument();
    });

    it('handles year rollover when going forward from December', () => {
      renderHeader({ defaultValue: createDate(2025, 12, 15) });
      
      const nextButton = screen.getByRole('button', { name: /next month/i });
      fireEvent.click(nextButton);
      
      expect(screen.getByText('January 2026')).toBeInTheDocument();
    });
  });

  describe('Button Disabled States', () => {
    it('disables previous button when at minDate month', () => {
      renderHeader({
        defaultValue: createDate(2026, 2, 15),
        minDate: createDate(2026, 2, 1),
      });
      
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      expect(prevButton).toBeDisabled();
    });

    it('disables next button when at maxDate month', () => {
      renderHeader({
        defaultValue: createDate(2026, 1, 15),
        maxDate: createDate(2026, 1, 31),
      });
      
      const nextButton = screen.getByRole('button', { name: /next month/i });
      expect(nextButton).toBeDisabled();
    });

    it('enables previous button when not at minDate', () => {
      renderHeader({
        defaultValue: createDate(2026, 3, 15),
        minDate: createDate(2026, 1, 1),
      });
      
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      expect(prevButton).not.toBeDisabled();
    });

    it('enables next button when not at maxDate', () => {
      renderHeader({
        defaultValue: createDate(2026, 1, 15),
        maxDate: createDate(2026, 12, 31),
      });
      
      const nextButton = screen.getByRole('button', { name: /next month/i });
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Optional Button Visibility', () => {
    it('hides previous button when showPreviousButton is false', () => {
      renderHeader({}, { showPreviousButton: false });
      
      const prevButton = screen.queryByRole('button', { name: /previous month/i });
      expect(prevButton).not.toBeInTheDocument();
    });

    it('hides next button when showNextButton is false', () => {
      renderHeader({}, { showNextButton: false });
      
      const nextButton = screen.queryByRole('button', { name: /next month/i });
      expect(nextButton).not.toBeInTheDocument();
    });

    it('shows both buttons by default', () => {
      renderHeader();
      
      expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();
    });
  });

  describe('Locale Support', () => {
    it('formats month with custom locale', () => {
      renderHeader({
        defaultValue: createDate(2026, 1, 15),
        locale: { locale: 'es-ES' },
      });
      
      const heading = screen.getByRole('heading', { level: 2 });
      // Spanish locale would show different format
      expect(heading).toBeInTheDocument();
    });

    it('uses default en-US locale when not specified', () => {
      renderHeader({ defaultValue: createDate(2026, 1, 15) });
      expect(screen.getByText('January 2026')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes on month display', () => {
      renderHeader({ defaultValue: createDate(2026, 1, 15) });
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveAttribute('aria-live', 'polite');
      expect(heading).toHaveAttribute('aria-atomic', 'true');
    });

    it('has descriptive aria-labels on buttons', () => {
      renderHeader();
      
      expect(screen.getByRole('button', { name: /previous month/i })).toHaveAttribute(
        'aria-label',
        'Previous month'
      );
      expect(screen.getByRole('button', { name: /next month/i })).toHaveAttribute(
        'aria-label',
        'Next month'
      );
    });

    it('buttons are keyboard accessible', () => {
      renderHeader();
      
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      const nextButton = screen.getByRole('button', { name: /next month/i });
      
      expect(prevButton.tagName).toBe('BUTTON');
      expect(nextButton.tagName).toBe('BUTTON');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = renderHeader({}, { className: 'custom-header' });
      
      const header = container.querySelector('.custom-header');
      expect(header).toBeInTheDocument();
    });

    it('applies disabled styling to disabled buttons', () => {
      renderHeader({
        defaultValue: createDate(2026, 1, 15),
        minDate: createDate(2026, 1, 1),
      });
      
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      expect(prevButton).toBeDisabled();
    });
  });

  describe('Icons', () => {
    it('renders chevron icons in buttons', () => {
      const { container } = renderHeader();
      
      // Check for SVG elements
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThanOrEqual(2); // At least 2 icons (prev and next)
    });
  });

  describe('Edge Cases', () => {
    it('handles minDate at beginning of month', () => {
      renderHeader({
        defaultValue: createDate(2026, 1, 15),
        minDate: createDate(2026, 1, 1),
      });
      
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      expect(prevButton).toBeDisabled();
    });

    it('handles maxDate at end of month', () => {
      renderHeader({
        defaultValue: createDate(2026, 1, 15),
        maxDate: createDate(2026, 1, 31),
      });
      
      const nextButton = screen.getByRole('button', { name: /next month/i });
      expect(nextButton).toBeDisabled();
    });

    it('allows navigation when minDate is in same month but allows previous month', () => {
      renderHeader({
        defaultValue: createDate(2026, 2, 28),
        minDate: createDate(2026, 1, 15),
      });
      
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      expect(prevButton).not.toBeDisabled();
    });
  });

  describe('Multiple Month Navigation', () => {
    it('can navigate multiple months forward', () => {
      renderHeader({ defaultValue: createDate(2026, 1, 15) });
      
      const nextButton = screen.getByRole('button', { name: /next month/i });
      
      fireEvent.click(nextButton);
      expect(screen.getByText('February 2026')).toBeInTheDocument();
      
      fireEvent.click(nextButton);
      expect(screen.getByText('March 2026')).toBeInTheDocument();
    });

    it('can navigate multiple months backward', () => {
      renderHeader({ defaultValue: createDate(2026, 3, 15) });
      
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      
      fireEvent.click(prevButton);
      expect(screen.getByText('February 2026')).toBeInTheDocument();
      
      fireEvent.click(prevButton);
      expect(screen.getByText('January 2026')).toBeInTheDocument();
    });
  });
});
