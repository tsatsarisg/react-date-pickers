import '../../index.css'

import styles from './DatePicker.module.css'
import { DateTime } from 'luxon'
import { populateArray } from '../../utils/DatePickerLogic'
import { useState } from 'react'
import Month from '../../atomic/molecules/Month/Month'

export type DatePickerProps = {
    fixedDate?: DateTime
    onChange?: any
}

const DatePicker = ({ fixedDate, onChange }: DatePickerProps) => {
    const shownDate = fixedDate ? fixedDate : DateTime.now()

    const [luxonDate, setLuxonDate] = useState(shownDate)
    const [calendarList, setCalendarList] = useState(populateArray(luxonDate))
    const [clickedDate, setClickedDate] = useState(
        fixedDate ? fixedDate : undefined
    )

    const handleLeftAngle = () => {
        const previousMonth = luxonDate.minus({ months: 1 })

        setLuxonDate(previousMonth)
        setCalendarList(populateArray(previousMonth))
    }

    const handleRightAngle = () => {
        const nextMonth = luxonDate.plus({ months: 1 })

        setLuxonDate(nextMonth)
        setCalendarList(populateArray(nextMonth))
    }

    const handleClick = (date: DateTime) => {
        if (clickedDate?.hasSame(date, 'day')) {
            setClickedDate(undefined)
            return
        }
        setClickedDate(date)
        onChange(date)
    }

    return (
        <div data-testid="datePicker" className={styles.datePicker}>
            <div className={styles.calendarHeader}>
                <div className={styles.angles} onClick={handleLeftAngle}>
                    Previous
                </div>
                <div className={styles.month}>
                    {luxonDate.toLocaleString({
                        month: 'long',
                        year: 'numeric',
                    })}
                </div>
                <div className={styles.angles} onClick={handleRightAngle}>
                    Next
                </div>
            </div>
            <Month
                days={calendarList}
                handleClick={handleClick}
                clickedDate={clickedDate}
            />
        </div>
    )
}

export default DatePicker
