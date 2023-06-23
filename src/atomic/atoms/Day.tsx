import styles from './Day.module.css'
import { DateTime } from 'luxon'

type dayProps = {
    date: DateTime
    clickedDate?: DateTime
    nextClickedDate?: DateTime
    onChange?: any
}

const Day = ({ date, onChange, clickedDate, nextClickedDate }: dayProps) => {
    const handleClick = (date: DateTime) => () => {
        onChange(date)
    }

    const firstClickedDateStyles =
        clickedDate && clickedDate.hasSame(date, 'day') ? styles.clicked : ''

    const secondClickedDateStyles =
        nextClickedDate && nextClickedDate.hasSame(date, 'day')
            ? styles.clicked
            : ''

    const betweenDatesStyle =
        !!clickedDate &&
        !!nextClickedDate &&
        date > clickedDate &&
        date < nextClickedDate
            ? styles.betweenClicked
            : ''

    const classes = `${styles.day} ${firstClickedDateStyles} ${secondClickedDateStyles} ${betweenDatesStyle}`

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
