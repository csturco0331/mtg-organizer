import React from 'react'
import styles from './AppHeader.module.css'

const AppHeader = () => {

    return (
        <div className={styles.header}>
            <h1 className={styles.h1}>Turco's MTG Organizer</h1>
            <p className={styles.p}>Allow myself to properly organize the cards I have and use</p>
        </div>
    )
}

export default AppHeader