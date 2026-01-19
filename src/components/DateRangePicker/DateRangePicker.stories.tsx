import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DateRangePicker } from './DateRangePicker';
import { createDate } from '../../utils/date';
import type { DateRange } from '../../types';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    numberOfMonths: {
      control: { type: 'select' },
      options: [1, 2],
      description: 'Number of months to display',
    },
    weekStartsOn: {
      control: { type: 'select' },
      options: [0, 1, 2, 3, 4, 5, 6],
      description: 'Day the week starts on (0 = Sunday)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

// Default two-month view
export const Default: Story = {
  args: {
    numberOfMonths: 2,
  },
};

// Single month view
export const SingleMonth: Story = {
  args: {
    numberOfMonths: 1,
  },
};

// Controlled with state
export const Controlled: Story = {
  render: function ControlledRangePicker(args) {
    const [range, setRange] = useState<DateRange>({ start: null, end: null });
    
    return (
      <div className="space-y-4">
        <DateRangePicker {...args} value={range} onChange={setRange} />
        <p className="text-sm text-gray-600">
          Start: {range.start ? `${range.start.year}-${range.start.month}-${range.start.day}` : 'None'}
          <br />
          End: {range.end ? `${range.end.year}-${range.end.month}-${range.end.day}` : 'None'}
        </p>
      </div>
    );
  },
};

// With min and max dates
export const WithMinMaxDates: Story = {
  args: {
    numberOfMonths: 2,
    minDate: createDate(2026, 1, 5),
    maxDate: createDate(2026, 2, 25),
  },
};

// With disabled dates
export const WithDisabledDates: Story = {
  args: {
    numberOfMonths: 2,
    disabledDates: [
      createDate(2026, 1, 15),
      createDate(2026, 1, 16),
      createDate(2026, 1, 17),
      createDate(2026, 2, 10),
      createDate(2026, 2, 11),
    ],
  },
};

// Week starts on Monday
export const WeekStartsOnMonday: Story = {
  args: {
    numberOfMonths: 2,
    weekStartsOn: 1,
  },
};

// With pre-selected range
export const WithDefaultRange: Story = {
  args: {
    numberOfMonths: 2,
    defaultValue: {
      start: createDate(2026, 1, 10),
      end: createDate(2026, 1, 20),
    },
  },
};

// French locale
export const FrenchLocale: Story = {
  args: {
    numberOfMonths: 2,
    locale: { locale: 'fr-FR' },
    weekStartsOn: 1,
  },
};
