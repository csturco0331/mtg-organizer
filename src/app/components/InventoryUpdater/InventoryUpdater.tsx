'use client'
import * as dbManager from '@/app/actions/mongo'
import styles from './InventoryUpdater.module.css'
import { useEffect, useState } from 'react'
import * as Scry from 'scryfall-sdk'

type UserCard = {
    _id: string,
    name: string,
    image: (string | undefined)[],
    type_line: string[],
    oracle_text: string[],
    color_identity: Array<'W' | 'B' | 'R' | 'U' | 'G'>,
    keywords: string[],
    tcgplayer?: string | undefined | null
    userCounts: {
        userId: string;
        quantity: Number;
        used: Number;
    }
}

export default function InventoryUpdater({card}: {card: Scry.Card}) {

    const [quantity, setQuantity] = useState(0)
    const [userCard, setUserCard] = useState<UserCard>()

    // useEffect(() => {
    //     const fetchData = async () => {
    //         let dbCard = await dbManager.fetchCardFromDatabase(card.id)
    //         if (dbCard.card) {
    //             setUserCard(dbCard.card)
    //             setQuantity(dbCard.card.quantity)
    //         }
    //     }

    //     fetchData()
    //         .catch(console.error)
    // }, [])

    async function updateCollection() {
        let data
        // if (userCard?._id && quantity)
        //     data = await dbManager.updateCardInDatabase({...userCard, userCounts: {...userCard.userCounts, quantity: quantity}})
        // else if (userCard?._id)
        //     data = await dbManager.deleteCardFromDatabase(userCard._id)
        // else
            data = await dbManager.createCardInDatabase(card, quantity)

        if (data?.card) {
            setUserCard(quantity ? data.card : undefined)
        }
    }

    function checkIfClean() {
        if (!userCard?.userCounts.quantity && quantity === 0) return true
        if (userCard?.userCounts.quantity === quantity) return true
        return false
    }

    return (
        <div className={styles.buttonCluster}>
            <div className={styles.label}>Owned:</div>
            <button className={styles.quantityButton} onClick={() => setQuantity(quantity ? quantity - 1 : 0)}>-</button>
            <div className={`${styles.quantityChange} ${checkIfClean() ? styles.clean : styles.dirty}`}>{quantity}</div>
            <button className={`${styles.quantityButton} ${styles.gap}`} onClick={() => setQuantity(quantity + 1)}>+</button>
            <button onClick={updateCollection} disabled={checkIfClean()}>Save</button>
        </div>
    )
}