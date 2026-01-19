# @tsatsarisg/react-date-pickers

A modern, accessible, and extensible React date picker library built with TypeScript. Zero dependencies (except `clsx` for class management), fully typed, and designed for maximum flexibility.

## ✨ Features

- 🎯 **Zero date library dependency** - Uses native JavaScript `Date` with a simple `CalendarDate` type
- ♿ **Accessible** - Full keyboard navigation and ARIA support
- 🎨 **Tailwind CSS styling** - Modern, customizable design out of the box
- 🧩 **Composable architecture** - Use pre-built components or build your own
- 📦 **Tree-shakeable** - Import only what you need
- 🔧 **TypeScript first** - Fully typed API
- ⚛️ **React 18 & 19 support** - Works with latest React versions
- 🌐 **i18n ready** - Configurable locale and week start day

## 📦 Installation

```bash
npm install @tsatsarisg/react-date-pickers
# or
pnpm add @tsatsarisg/react-date-pickers
# or
yarn add @tsatsarisg/react-date-pickers
```

## 🚀 Quick Start

### DatePicker (Single Date Selection)

```tsx
import { DatePicker, createDate } from '@tsatsarisg/react-date-pickers';

function App() {
  const [date, setDate] = useState(null);

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      minDate={createDate(2024, 1, 1)}
      maxDate={createDate(2026, 12, 31)}
    />
  );
}
```

### DateRangePicker (Date Range Selection)

```tsx
import { DateRangePicker } from '@tsatsarisg/react-date-pickers';

function App() {
  const [range, setRange] = useState({ start: null, end: null });

  return (
    <DateRangePicker
      value={range}
      onChange={setRange}
      numberOfMonths={2}
    />
  );
}
```

## 📖 API Reference

### CalendarDate Type

All dates in this library use a simple object format:

```typescript
interface CalendarDate {
  year: number;   // e.g., 2026
  month: number;  // 1-12 (January = 1)
  day: number;    // 1-31
}
```

### DatePicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `CalendarDate \| null` | - | Controlled selected date |
| `defaultValue` | `CalendarDate` | - | Default date (uncontrolled) |
| `onChange` | `(date: CalendarDate \| null) => void` | - | Called when date changes |
| `minDate` | `CalendarDate` | - | Minimum selectable date |
| `maxDate` | `CalendarDate` | - | Maximum selectable date |
| `disabledDates` | `CalendarDate[]` | `[]` | Array of dates to disable |
| `locale` | `Partial<LocaleConfig>` | `{ locale: 'en-US' }` | Locale settings |
| `weekStartsOn` | `0-6` | `0` | Week start day (0 = Sunday) |
| `className` | `string` | - | Additional CSS classes |
| `aria-label` | `string` | `'Date picker'` | Accessible label |
| `header` | `ReactNode` | - | Custom header component |
| `footer` | `ReactNode` | - | Custom footer component |

### DateRangePicker Props

Same as DatePicker, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `DateRange` | - | `{ start: CalendarDate \| null, end: CalendarDate \| null }` |
| `numberOfMonths` | `1 \| 2` | `2` | Number of months to display |

## 🎨 Customization

### Using the Context

For advanced customization, you can build your own date picker using the provided context:

```tsx
import { 
  CalendarProvider, 
  useCalendarContext,
  Day,
  MonthGrid,
  CalendarHeader 
} from '@tsatsarisg/react-date-pickers';

function CustomDatePicker() {
  return (
    <CalendarProvider onChange={handleChange}>
      <div className="my-custom-wrapper">
        <CalendarHeader />
        <MonthGrid />
        <button onClick={() => /* custom logic */}>
          Clear Selection
        </button>
      </div>
    </CalendarProvider>
  );
}
```

### Utility Functions

The library exports helpful date utilities:

```tsx
import {
  createDate,      // Create a CalendarDate
  today,           // Get today's date
  isSameDay,       // Compare two dates
  isBefore,        // Check if date is before another
  isAfter,         // Check if date is after another
  addMonths,       // Add months to a date
  addDays,         // Add days to a date
  formatDate,      // Format date to locale string
  toISOString,     // Convert to ISO string (YYYY-MM-DD)
  fromISOString,   // Parse ISO string to CalendarDate
} from '@tsatsarisg/react-date-pickers';
```

## 🌐 Internationalization

Configure locale and week start day:

```tsx
<DatePicker
  locale={{ 
    locale: 'de-DE',
    weekStartsOn: 1, // Monday
  }}
/>
```

## ⌨️ Keyboard Navigation

| Key | Action |
|-----|--------|
| `←` | Previous day |
| `→` | Next day |
| `↑` | Previous week |
| `↓` | Next week |
| `Enter` / `Space` | Select focused date |

## 🧪 Development

```bash
# Install dependencies
pnpm install

# Run development mode
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## 📝 License

MIT © George Tsatsaris
