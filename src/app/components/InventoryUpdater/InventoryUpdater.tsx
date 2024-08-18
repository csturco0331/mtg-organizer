'use client'
import * as dbManager from '@/app/actions/mongo'
import AppButton from '../AppButton/AppButton'
import styles from './InventoryUpdater.module.css'
import { useEffect, useState } from 'react'
import {Card as UserCard} from '@/app/lib/definitions'

export default function InventoryUpdater({scryfallId}: {scryfallId: string}) {

    const [quantity, setQuantity] = useState(0)
    const [userCard, setUserCard] = useState<UserCard>()

    useEffect(() => {
        const fetchData = async () => {
            let dbCard = await dbManager.fetchCardFromDatabase(scryfallId)
            if (dbCard.card) {
                setUserCard(dbCard.card)
                setQuantity(dbCard.card.quantity)
            }
        }

        fetchData()
            .catch(console.error)
    }, [])

    async function updateCollection() {
        const dataBaseCall = userCard && userCard._id
            ? quantity
                ? dbManager.updateCardInDatabase  //card exists, update quantity
                : dbManager.deleteCardFromDatabase  //if quantity is 0 remove from collection
            : dbManager.createCardInDatabase  //default - no card yet need to create
        //const colors = card?.colors?.map(c => `${c}`).reduce((acc, c) => `${acc}${c}`)

        let data = await dataBaseCall({
            cardId: userCard?._id,
            scryfallId: scryfallId,
            quantity: quantity,
            decks: userCard?.decks
        })
        if (data.card) {
            setUserCard(quantity ? data.card : undefined)
        }
    }

    function checkIfClean() {
        if (!userCard?.quantity && quantity === 0) return true
        if (userCard?.quantity === quantity) return true
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