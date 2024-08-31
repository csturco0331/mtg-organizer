'use client'
import styles from './InventoryUpdater.module.css'
import * as dbManager from '@/app/actions/mongo'
import { useContext, useEffect, useState } from 'react'
import * as Scry from 'scryfall-sdk'
import { UserContext } from '../Providers/UserProvider/UserProvider'
import { CardLink } from '@/app/lib/modals/user'

export default function InventoryUpdater({card}: {card: Scry.Card}) {

    const [index, setIndex] = useState(-1)
    const [quantity, setQuantity] = useState(0)
    const {user, setUser} = useContext(UserContext)

    useEffect(initQuantity, [])

    function initQuantity() {
        let x = user?.cards?.findIndex(c => c.cardId === card.id) ?? -1
        if (x !== -1) {
            setQuantity(user?.cards?.at(x)?.quantity ?? 0)
        }
        setIndex(x)
    }

    async function updateCollection() {
        let result = await dbManager.updateCollection({cardId: card.id, quantity})
        if (result.user) {
            setUser(result.user)
            if (index == -1) setIndex(result.user.cards?.findIndex((c: CardLink) => c.cardId === card.id) ?? -1) //update index if needed
        }
    }

    function checkIfClean() {
        if (index == -1) return !quantity //index -1 means no card so use quantity to determine if clean
        let userCount = user?.cards?.at(index)?.quantity
        return (userCount === quantity)
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