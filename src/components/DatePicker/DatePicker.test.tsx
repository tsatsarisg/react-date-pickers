import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePicker } from './DatePicker';
import { createDate } from '../../utils/date';

describe('DatePicker', () => {
  it('renders without crashing', () => {
    render(<DatePicker />);
    expect(screen.getByRole('application')).toBeInTheDocument();
  });

  it('displays current month by default', () => {
    render(<DatePicker />);
    const now = new Date();
    const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    expect(screen.getByText(monthName)).toBeInTheDocument();
  });

  it('navigates to previous month', () => {
    render(<DatePicker defaultValue={createDate(2026, 2, 15)} />);
    
    const prevButton = screen.getByRole('button', { name: /previous month/i });
    fireEvent.click(prevButton);
    
    expect(screen.getByText('January 2026')).toBeInTheDocument();
  });

  it('navigates to next month', () => {
    render(<DatePicker defaultValue={createDate(2026, 1, 15)} />);
    
    const nextButton = screen.getByRole('button', { name: /next month/i });
    fireEvent.click(nextButton);
    
    expect(screen.getByText('February 2026')).toBeInTheDocument();
  });

  it('calls onChange when a date is selected', () => {
    const handleChange = vi.fn();
    render(<DatePicker onChange={handleChange} defaultValue={createDate(2026, 1, 1)} />);
    
    const day15 = screen.getByTestId('day_2026-01-15');
    fireEvent.click(day15);
    
    expect(handleChange).toHaveBeenCalledWith({
      year: 2026,
      month: 1,
      day: 15,
    });
  });

  it('shows selected date with proper styling', () => {
    render(<DatePicker value={createDate(2026, 1, 15)} />);
    
    const selectedDay = screen.getByTestId('day_2026-01-15');
    expect(selectedDay).toHaveAttribute('aria-selected', 'true');
  });

  it('disables dates before minDate', () => {
    render(
      <DatePicker
        defaultValue={createDate(2026, 1, 15)}
        minDate={createDate(2026, 1, 10)}
      />
    );
    
    const disabledDay = screen.getByTestId('day_2026-01-05');
    expect(disabledDay).toBeDisabled();
  });

  it('disables dates after maxDate', () => {
    render(
      <DatePicker
        defaultValue={createDate(2026, 1, 15)}
        maxDate={createDate(2026, 1, 20)}
      />
    );
    
    const disabledDay = screen.getByTestId('day_2026-01-25');
    expect(disabledDay).toBeDisabled();
  });

  it('supports custom className', () => {
    render(<DatePicker className="custom-class" />);
    expect(screen.getByRole('application')).toHaveClass('custom-class');
  });

  it('supports custom aria-label', () => {
    render(<DatePicker aria-label="Select your birthday" />);
    expect(screen.getByRole('application')).toHaveAttribute('aria-label', 'Select your birthday');
  });
});
