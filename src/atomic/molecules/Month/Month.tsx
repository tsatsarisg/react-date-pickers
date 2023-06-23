import { DateTime } from 'luxon'
import Day from '../../atoms/Day'
import styles from './Month.module.css'

type monthProps = {
    days: DateTime[]
    handleClick: any
    clickedDate?: DateTime
}

const Month = ({ days, handleClick, clickedDate }: monthProps) => {
    return (
        <div className={styles.calendarDays}>
            {days.map((date: DateTime) => (
                <Day
                    key={date.toISODate()}
                    date={date}
                    onChange={handleClick}
                    clickedDate={clickedDate}
                />
            ))}
        </div>
    )
}

export default Month
