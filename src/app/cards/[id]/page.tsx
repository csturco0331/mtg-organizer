'use client'
import { fetchScryfallCardById } from "@/app/actions/scryfall"
import styles from '@/app/cards/[id]/card.module.css'
import CardImage from "@/app/components/CardImage/CardImage"
import { useEffect, useState } from "react"
import * as Scry from 'scryfall-sdk'
import InventoryUpdater from "@/app/components/InventoryUpdater/InventoryUpdater"

export default function Card({params}: {params: {id: string}}) {

    const [card, setCard] = useState<Scry.Card>()
    const [priceHTML, setPriceHTML] = useState<React.JSX.Element[] | undefined>()

    useEffect(() => {
        const fetchData = async () => {
            let scryCard = fetchScryfallCardById(params.id)
            setCard(await scryCard)
        }

        fetchData()
            .catch(console.error)
    }, [])

    useEffect(() => {
        if (!card) return
        let htmlArray = Object.keys(card.prices).map(key => {
            let price = card.prices[key as keyof Scry.Prices]
            if (!price) return null
            return (<li key={key}>{key}: {price}</li>)
        }).filter(html => html != null)
        if (htmlArray.length)
            setPriceHTML(htmlArray)
    }, [card])

    return (
        <>
            {(card) 
                ?
            <div className={styles.main}>
                <CardImage card={card} />
                <div className={styles.details}>
                    {/* <div>
                        {(userCard?.decks?.length) 
                            ?
                        <>
                            <p><b>Decks:</b></p>
                            <ul>
                                {userCard?.decks.map(deck => {
                                    return <li key={deck}>{deck}</li>
                                })}
                            </ul>
                        </>
                            : <></>
                        }
                    </div> */}
                    {(priceHTML) 
                        ?
                    <div className={styles.prices}>
                        <b>Prices:</b>
                        <ul>
                            {priceHTML.map(html => html)}
                        </ul>
                    </div>
                        : <></>
                    }
                    { (card.purchase_uris) 
                        ? <a className={styles.anchor} href={card.purchase_uris.tcgplayer || ''}>TCGPlayer</a>
                        : null
                    }
                    <InventoryUpdater scryfallId={params.id}></InventoryUpdater>
                </div>
            </div>
                :
            <div className={styles.main}>
                Loading...
            </div>
            }
        </>
    )
}