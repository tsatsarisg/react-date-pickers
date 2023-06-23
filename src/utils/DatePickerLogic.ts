import { DateTime } from 'luxon'

const DAYS_PER_CALENDAR_PAGE = 35

export const calculatePreviousMonthsFreeSpace = (days: number) => {
    const availableDates = DAYS_PER_CALENDAR_PAGE - days
    const remainder = availableDates % 2
    const quotient = Math.floor(availableDates / 2)

    return quotient + remainder
}

const getDaysInPreviousMonth = (dateGMT: DateTime) => {
    const previousMonth = dateGMT.minus({
        months: 1,
    })
    const daysInPreviousMonth = previousMonth.daysInMonth

    return daysInPreviousMonth
}

const getDaysInCurrentMonth = (dateGMT: DateTime) => dateGMT.daysInMonth

function generatePreviousMonthDates(
    date: DateTime,
    availableSpaceOfPreviousMonth: number
) {
    const momentArray = []
    const daysOfPreviousMonth = getDaysInPreviousMonth(date)
    if (!daysOfPreviousMonth) return

    for (let i = availableSpaceOfPreviousMonth; i > 0; i--) {
        const previousDate = date
            .minus({ months: 1 })
            .endOf('month')
            .minus({ days: i })

        momentArray.push(previousDate)
    }

    return momentArray
}

export function generateCurrentMonthDates(date: DateTime) {
    const momentArray = []
    const daysOfCurrentMonth = getDaysInCurrentMonth(date)
    if (!daysOfCurrentMonth) throw Error()

    for (let i = 0; i < daysOfCurrentMonth; i++) {
        const currentDate = date.startOf('month').plus({
            days: i,
        })

        momentArray.push(currentDate)
    }

    return momentArray
}

function generateNextMonthDates(
    date: DateTime,
    availableSpaceOfNextMonth: number
) {
    const momentArray = []

    for (let i = 0; i < availableSpaceOfNextMonth; i++) {
        const nextDate = date.plus({ months: 1 }).startOf('month').plus({
            days: i,
        })

        momentArray.push(nextDate)
    }

    return momentArray
}

export const populateArray = (currentDate: DateTime) => {
    const daysOfCurrentMonth = getDaysInCurrentMonth(currentDate)
    if (!daysOfCurrentMonth) throw new Error()

    const availableSpaceOfPreviousMonth =
        calculatePreviousMonthsFreeSpace(daysOfCurrentMonth)

    const availableSpaceOfNextMonth =
        DAYS_PER_CALENDAR_PAGE -
        availableSpaceOfPreviousMonth -
        daysOfCurrentMonth

    const datesOfPreviousMonth = generatePreviousMonthDates(
        currentDate.startOf('month'),
        availableSpaceOfPreviousMonth
    )
    const datesOfCurrentMonth = generateCurrentMonthDates(currentDate)
    const datesOfNextMonth = generateNextMonthDates(
        currentDate,
        availableSpaceOfNextMonth
    )

    if (!datesOfPreviousMonth || !datesOfCurrentMonth) throw new Error()

    return datesOfPreviousMonth.concat(datesOfCurrentMonth, datesOfNextMonth)
}
