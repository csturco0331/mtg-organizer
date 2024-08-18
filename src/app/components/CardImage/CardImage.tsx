'use client'
import { useState } from 'react'
import styles from './CardImage.module.css'
import * as Scry from 'scryfall-sdk'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const CardImage = ({card, href}: {card: Scry.Card, href?: string}) => {

    const [flip, setFlip] = useState(false)
    const router = useRouter()

    function onClick () {
        if (!href) return
        router.push(href)
    }

    function flipCard (event: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        event.stopPropagation()
        setFlip(!flip)
    }

    return (
        <div key={card.id} onClick={onClick}>
            {
                (card.image_uris)
                    ? <img className={styles.img} src={card.image_uris.normal}></img>
                    : (card.card_faces)
                        ?
                        <div className={styles.imgContainer}>
                            <Image src="/flip.png" alt="Flip Icon" width="50" height="50" className={styles.flipButton} onClick={event => flipCard(event)}/>
                            <div className={`${styles.innerContainer} ${flip ? styles.flip : ''}`}>
                                <img className={`${styles.img} ${styles.front}`} 
                                    src={card.card_faces[0].image_uris?.normal}/>
                                <img className={`${styles.img} ${styles.back}`} 
                                    src={card.card_faces[1].image_uris?.normal}/>
                            </div>
                        </div>
                        : JSON.stringify(card)
            }
        </div>
    )
}

export default CardImage