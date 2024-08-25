import React from 'react'
import styles from './AppHeader.module.css'

const AppHeader = () => {

    return (
        <div className={styles.header}>
            <h1 className={styles.h1}>MTG Organizer</h1>
        </div>
    )
}

export default AppHeader