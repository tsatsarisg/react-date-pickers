import styles from './Day.module.css'
import { DateTime } from 'luxon'

type dayProps = {
    date: DateTime
    clickedDate?: DateTime
    onChange?: any
}

const Day = ({ date, onChange, clickedDate }: dayProps) => {
    const handleClick = (date: DateTime) => () => {
        onChange(date)
    }

    const classes = `${styles.day} ${
        clickedDate && clickedDate.hasSame(date, 'day') ? styles.clicked : ''
    }`

    return (
        <div
            data-testid={`day_${date.toISODate()}`}
            className={classes}
            onClick={handleClick(date)}
        >
            {date.day}
        </div>
    )
}

export default Day
