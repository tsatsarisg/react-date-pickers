import styles from '../DatePicker/DatePicker.module.css'
import { DateTime } from 'luxon'
import {
    generateCurrentMonthDates,
    populateArray,
} from '../../utils/DatePickerLogic'
import { useEffect, useState } from 'react'
import Month from '../../atomic/molecules/Month/Month'

export type DatePickerProps = {
    fixedDate?: DateTime
    onChange?: any
}

const DoubleDatePicker = ({ fixedDate, onChange }: DatePickerProps) => {
    const shownDate = fixedDate ? fixedDate : DateTime.now()

    const [currentDate, setCurrentDate] = useState(shownDate)
    const [calendarList, setCalendarList] = useState(
        generateCurrentMonthDates(currentDate)
    )

    const [nextDate, setNextDate] = useState(shownDate.plus({ months: 1 }))
    const [calendarList2, setCalendarList2] = useState(
        generateCurrentMonthDates(nextDate)
    )

    const [clickedDate, setClickedDate] = useState(
        fixedDate ? fixedDate : undefined
    )

    const [secondClickedDate, setSecondClickedDate] = useState<DateTime>(
        undefined as unknown as DateTime
    )

    useEffect(() => {
        const nextDate = currentDate.plus({ months: 1 })

        setNextDate(nextDate)
        setCalendarList2(generateCurrentMonthDates(nextDate))
    }, [currentDate])

    const handleLeftAngle = () => {
        const previousMonth = currentDate.minus({ months: 1 })

        setCurrentDate(previousMonth)
        setCalendarList(generateCurrentMonthDates(previousMonth))
    }

    const handleRightAngle = () => {
        const nextMonth = currentDate.plus({ months: 1 })
        setCurrentDate(nextMonth)
        setCalendarList(generateCurrentMonthDates(nextMonth))
    }

    const handleClick = (date: DateTime) => {
        if (clickedDate && clickedDate < date) {
            setSecondClickedDate(date)
            return
        }

        setSecondClickedDate(undefined as unknown as DateTime)
        setClickedDate(date)
    }

    return (
        <div data-testid="doubleDatePicker" className={styles.doubleDatePicker}>
            <div className={styles.datePicker}>
                <div className={styles.calendarHeader}>
                    <div className={styles.angles} onClick={handleLeftAngle}>
                        Previous
                    </div>
                    <div className={styles.month}>
                        {currentDate.toLocaleString({
                            month: 'long',
                            year: 'numeric',
                        })}
                    </div>
                </div>
                <Month
                    days={calendarList}
                    handleClick={handleClick}
                    clickedDate={clickedDate}
                    nextClickedDate={secondClickedDate}
                />
            </div>

            <div className={styles.datePicker}>
                <div className={styles.calendarHeader}>
                    <div className={styles.month}>
                        {nextDate.toLocaleString({
                            month: 'long',
                            year: 'numeric',
                        })}
                    </div>
                    <div className={styles.angles} onClick={handleRightAngle}>
                        Next
                    </div>
                </div>
                <Month
                    days={calendarList2}
                    handleClick={handleClick}
                    clickedDate={clickedDate}
                    nextClickedDate={secondClickedDate}
                />
            </div>
        </div>
    )
}

export default DoubleDatePicker
