'use client'
import { useState } from 'react'
import styles from './CardImage.module.css'
import * as Scry from 'scryfall-sdk'

interface CardImageProps {
    card: Scry.Card
}

const CardImage = ({card}: CardImageProps) => {

    const [firstSelected, setFirstSelected] = useState(true)

    return (
        <div key={card.id}>
            {
                (card.image_uris)
                    ? <img className={styles.img} src={card.image_uris.normal}></img>
                    : (card.card_faces)
                        ?
                        <div className={styles.imgContainer} onClick={() => setFirstSelected(!firstSelected)}>
                            <img className={`${styles.img} ${firstSelected ? styles.top : ''}`} 
                                src={card.card_faces[0].image_uris?.normal}/>
                            <img className={`${styles.img} ${styles.second} ${firstSelected ? '' : styles.top}`} 
                                src={card.card_faces[1].image_uris?.normal}/>
                        </div>
                        : JSON.stringify(card)
            }
        </div>
    )
}

export default CardImage