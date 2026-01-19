import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DatePicker } from './DatePicker';
import { createDate, today } from '../../utils/date';
import type { CalendarDate } from '../../types';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    weekStartsOn: {
      control: { type: 'select' },
      options: [0, 1, 2, 3, 4, 5, 6],
      description: 'Day the week starts on (0 = Sunday)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

// Basic DatePicker
export const Default: Story = {
  args: {},
};

// Controlled DatePicker with state
export const Controlled: Story = {
  render: function ControlledDatePicker(args) {
    const [date, setDate] = useState<CalendarDate | null>(null);
    
    return (
      <div className="space-y-4">
        <DatePicker {...args} value={date} onChange={setDate} />
        <p className="text-sm text-gray-600">
          Selected: {date ? `${date.year}-${date.month}-${date.day}` : 'None'}
        </p>
      </div>
    );
  },
};

// With min and max dates
export const WithMinMaxDates: Story = {
  args: {
    minDate: createDate(2026, 1, 10),
    maxDate: createDate(2026, 1, 25),
  },
};

// With disabled dates
export const WithDisabledDates: Story = {
  args: {
    disabledDates: [
      createDate(2026, 1, 15),
      createDate(2026, 1, 16),
      createDate(2026, 1, 17),
      createDate(2026, 1, 20),
    ],
  },
};

// Week starts on Monday
export const WeekStartsOnMonday: Story = {
  args: {
    weekStartsOn: 1,
  },
};

// With default value
export const WithDefaultValue: Story = {
  args: {
    defaultValue: today(),
  },
};

// With custom footer
export const WithCustomFooter: Story = {
  render: function DatePickerWithFooter(args) {
    const [date, setDate] = useState<CalendarDate | null>(null);
    
    return (
      <DatePicker
        {...args}
        value={date}
        onChange={setDate}
        footer={
          <div className="mt-4 flex justify-between border-t pt-4">
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setDate(today())}
            >
              Today
            </button>
            <button
              className="text-sm text-gray-500 hover:underline"
              onClick={() => setDate(null)}
            >
              Clear
            </button>
          </div>
        }
      />
    );
  },
};

// French locale
export const FrenchLocale: Story = {
  args: {
    locale: { locale: 'fr-FR' },
    weekStartsOn: 1,
  },
};

// German locale
export const GermanLocale: Story = {
  args: {
    locale: { locale: 'de-DE' },
    weekStartsOn: 1,
  },
};
