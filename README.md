# @tsatsarisg/react-date-pickers

A headless, accessible, and extensible React date picker library built with TypeScript. Zero runtime dependencies, fully typed, and designed for maximum flexibility.

## Features

- **Headless** - No built-in styles. Full control over styling via `className`, `classNames`, and data attributes
- **Zero dependencies** - No runtime dependencies beyond React
- **Accessible** - Full keyboard navigation (WAI-ARIA grid pattern) and ARIA support
- **Composable** - Use pre-built components or build your own from building blocks
- **Extensible** - `renderDay` prop for custom day rendering (holidays, prices, availability)
- **TypeScript first** - Fully typed API with exported types
- **Tree-shakeable** - Import only what you need
- **React 18 & 19** - Works with latest React versions
- **i18n ready** - Configurable locale and week start day via `Intl.DateTimeFormat`

## Installation

```bash
npm install @tsatsarisg/react-date-pickers
# or
pnpm add @tsatsarisg/react-date-pickers
# or
yarn add @tsatsarisg/react-date-pickers
```

## Quick Start

### DatePicker

```tsx
import { DatePicker, createDate } from '@tsatsarisg/react-date-pickers'

function App() {
    const [date, setDate] = useState(null)

    return (
        <DatePicker
            value={date}
            onChange={setDate}
            minDate={createDate(2024, 1, 1)}
            maxDate={createDate(2026, 12, 31)}
        />
    )
}
```

### DateRangePicker

```tsx
import { DateRangePicker } from '@tsatsarisg/react-date-pickers'

function App() {
    const [range, setRange] = useState({ start: null, end: null })

    return (
        <DateRangePicker value={range} onChange={setRange} numberOfMonths={2} />
    )
}
```

## Styling

This library is headless -- it ships no CSS. You style it using any approach you prefer: Tailwind, CSS modules, plain CSS, etc.

### Using `classNames`

Pass a `classNames` object to style sub-components:

```tsx
<DatePicker
    classNames={{
        root: 'rounded-xl border border-gray-200 bg-white p-4 shadow-lg',
        header: 'flex items-center justify-between px-2 py-3',
        navButton: 'h-8 w-8 rounded-lg hover:bg-gray-100',
        caption: 'text-sm font-semibold',
        grid: 'w-full',
        weekdays: 'mb-2',
        weekday: 'text-xs font-medium text-gray-500 h-10 w-10',
        day: 'h-10 w-10 rounded-lg text-sm',
        footer: 'pt-2 border-t',
    }}
/>
```

### Using data attributes

Every day button exposes data attributes for state-based styling with CSS:

```css
/* Base day style */
[role='gridcell'] {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
}

/* Today */
[data-today] {
    outline: 1px solid blue;
}

/* Selected */
[data-selected] {
    background: blue;
    color: white;
}

/* Disabled */
[data-disabled] {
    opacity: 0.3;
    cursor: not-allowed;
}

/* Outside current month */
[data-outside] {
    color: #9ca3af;
}

/* Range selection */
[data-range-start] {
    background: blue;
    color: white;
    border-radius: 0.5rem 0 0 0.5rem;
}
[data-range-end] {
    background: blue;
    color: white;
    border-radius: 0 0.5rem 0.5rem 0;
}
[data-in-range] {
    background: #dbeafe;
    border-radius: 0;
}
```

Available data attributes: `data-today`, `data-selected`, `data-disabled`, `data-outside`, `data-focused`, `data-range-start`, `data-range-end`, `data-in-range`, `data-range-mode`, `data-disabled` (on root).

### Using `className` on building blocks

When composing your own layout, pass `className` directly:

```tsx
<CalendarProvider onChange={handleChange}>
    <CalendarHeader className="my-header" />
    <MonthGrid className="my-grid" dayClassName="my-day" />
</CalendarProvider>
```

## Custom Day Rendering

Use `renderDay` to customize what's rendered inside each day cell:

```tsx
const holidays = new Set(['2026-12-25', '2026-01-01'])

;<DatePicker
    renderDay={(date, state) => (
        <div>
            <span>{date.day}</span>
            {holidays.has(toISOString(date)) && <span>*</span>}
            {state.isToday && <span>(today)</span>}
        </div>
    )}
/>
```

The `renderDay` callback receives the `CalendarDate` and a `DayState` object:

```typescript
interface DayState {
    isToday: boolean
    isSelected: boolean
    isDisabled: boolean
    isOutsideMonth: boolean
    isFocused: boolean
    isRangeStart: boolean
    isRangeEnd: boolean
    isInRange: boolean
}
```

## API Reference

### CalendarDate Type

All dates use a simple, timezone-safe object format:

```typescript
interface CalendarDate {
    year: number // e.g., 2026
    month: number // 1-12 (January = 1)
    day: number // 1-31
}
```

### DatePicker Props

| Prop            | Type                                   | Default               | Description                      |
| --------------- | -------------------------------------- | --------------------- | -------------------------------- |
| `value`         | `CalendarDate \| null`                 | -                     | Controlled selected date         |
| `defaultValue`  | `CalendarDate`                         | -                     | Default date (uncontrolled)      |
| `onChange`      | `(date: CalendarDate \| null) => void` | -                     | Called when date changes         |
| `minDate`       | `CalendarDate`                         | -                     | Minimum selectable date          |
| `maxDate`       | `CalendarDate`                         | -                     | Maximum selectable date          |
| `disabledDates` | `CalendarDate[]`                       | `[]`                  | Dates to disable                 |
| `locale`        | `Partial<LocaleConfig>`                | `{ locale: 'en-US' }` | Locale settings                  |
| `weekStartsOn`  | `0-6`                                  | `0`                   | Week start day (0 = Sunday)      |
| `className`     | `string`                               | -                     | Root element class               |
| `classNames`    | `CalendarClassNames`                   | -                     | Class names for sub-components   |
| `renderDay`     | `(date, state) => ReactNode`           | -                     | Custom day rendering             |
| `aria-label`    | `string`                               | `'Date picker'`       | Accessible label                 |
| `header`        | `ReactNode`                            | -                     | Custom header (replaces default) |
| `footer`        | `ReactNode`                            | -                     | Custom footer                    |
| `disabled`      | `boolean`                              | `false`               | Disable the picker               |

### DateRangePicker Props

Same as DatePicker, plus:

| Prop             | Type                         | Default | Description                                                  |
| ---------------- | ---------------------------- | ------- | ------------------------------------------------------------ |
| `value`          | `DateRange`                  | -       | `{ start: CalendarDate \| null, end: CalendarDate \| null }` |
| `onChange`       | `(range: DateRange) => void` | -       | Called when range changes                                    |
| `numberOfMonths` | `1 \| 2`                     | `2`     | Number of months to display                                  |

### Building Blocks

For advanced customization, compose your own layout:

```tsx
import {
    CalendarProvider,
    useCalendarContext,
    CalendarHeader,
    MonthGrid,
    Day,
} from '@tsatsarisg/react-date-pickers'

function CustomDatePicker({ onChange }) {
    return (
        <CalendarProvider onChange={onChange}>
            <div className="my-picker">
                <CalendarHeader />
                <MonthGrid />
                <ResetButton />
            </div>
        </CalendarProvider>
    )
}

function ResetButton() {
    const { selectDate } = useCalendarContext()
    // custom logic using context
}
```

`MonthGrid` and `CalendarHeader` accept override props for use in multi-month layouts:

```tsx
// Display a specific month (bypasses context)
<MonthGrid month={createDate(2026, 3, 1)} />

// Override navigation handlers
<CalendarHeader
  month={leftMonth}
  onPreviousMonth={goToPrev}
  showNextButton={false}
/>
```

### Utility Functions

```tsx
import {
    createDate, // Create a CalendarDate
    today, // Get today's date
    isSameDay, // Compare two dates
    isSameMonth, // Compare months
    isBefore, // Check if date is before another
    isAfter, // Check if date is after another
    isWithinRange, // Check if date is within a range
    addMonths, // Add months to a date
    addDays, // Add days to a date
    getDaysInMonth, // Get days in a month
    formatDate, // Format date to locale string
    formatMonthYear, // Format month/year to locale string
    toISOString, // Convert to "YYYY-MM-DD"
    fromISOString, // Parse "YYYY-MM-DD" (validates month/day)
    toDate, // Convert to native Date
    fromDate, // Convert from native Date
} from '@tsatsarisg/react-date-pickers'
```

## Internationalization

```tsx
<DatePicker
    locale={{
        locale: 'de-DE',
        weekStartsOn: 1, // Monday
    }}
/>
```

Custom day/month names:

```tsx
<DatePicker
    locale={{
        locale: 'custom',
        dayNamesShort: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        weekStartsOn: 1,
    }}
/>
```

## Keyboard Navigation

| Key                 | Action                   |
| ------------------- | ------------------------ |
| `Arrow Left`        | Previous day             |
| `Arrow Right`       | Next day                 |
| `Arrow Up`          | Previous week            |
| `Arrow Down`        | Next week                |
| `Home`              | First day of month       |
| `End`               | Last day of month        |
| `Page Up`           | Same day, previous month |
| `Page Down`         | Same day, next month     |
| `Shift + Page Up`   | Same day, previous year  |
| `Shift + Page Down` | Same day, next year      |
| `Enter` / `Space`   | Select focused date      |

## Development

```bash
pnpm install
pnpm dev          # Watch mode
pnpm build        # Production build
pnpm test         # Run tests
pnpm typecheck    # Type check
pnpm lint         # Lint
pnpm storybook    # Storybook
```

## License

MIT
