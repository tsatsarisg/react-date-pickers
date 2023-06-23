// import { populateArray } from "./DatePickerLogic";
import styles from '../DatePicker/DatePicker.module.css'
import Day from '../../atomic/atoms/Day'
import { DateTime } from 'luxon'
import { populateArray } from '../../utils/DatePickerLogic'
import { useEffect, useState } from 'react'

export type DatePickerProps = {
    fixedDate?: DateTime
    onChange?: any
}

const DoubleDatePicker = ({ fixedDate, onChange }: DatePickerProps) => {
    const shownDate = fixedDate ? fixedDate : DateTime.now()

    const [currentDate, setCurrentDate] = useState(shownDate)
    const [calendarList, setCalendarList] = useState(populateArray(currentDate))

    const [nextDate, setNextDate] = useState(shownDate.plus({ months: 1 }))
    const [calendarList2, setCalendarList2] = useState(populateArray(nextDate))

    const [clickedDate, setClickedDate] = useState(
        fixedDate ? fixedDate : undefined
    )

    useEffect(() => {
        const nextDate = currentDate.plus({ months: 1 })

        setNextDate(nextDate)
        setCalendarList2(populateArray(nextDate))
    }, [currentDate])

    const handleLeftAngle = () => {
        const previousMonth = currentDate.minus({ months: 1 })

        setCurrentDate(previousMonth)
        setCalendarList(populateArray(previousMonth))
    }

    const handleRightAngle = () => {
        const nextMonth = currentDate.plus({ months: 1 })
        setCurrentDate(nextMonth)
        setCalendarList(populateArray(nextMonth))
    }

    const handleClick = (date: DateTime) => {
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
                <div className={styles.calendarDays}>
                    {calendarList.map((date: DateTime) => (
                        <Day
                            key={date.toISODate()}
                            date={date}
                            onChange={handleClick}
                            clickedDate={clickedDate}
                        />
                    ))}
                </div>
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
                <div className={styles.calendarDays}>
                    {calendarList2.map((date: DateTime) => (
                        <Day
                            key={date.toISODate()}
                            date={date}
                            onChange={handleClick}
                            clickedDate={clickedDate}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DoubleDatePicker
