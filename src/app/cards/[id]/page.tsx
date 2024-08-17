'use client'
import { fetchScryfallCardById } from "@/app/actions/scryfall"
import { fetchCardFromDatabase } from "@/app/actions/mongo"
import styles from '@/app/cards/[id]/card.module.css'
import CardImage from "@/app/components/CardImage/CardImage"
import AppButton from "@/app/components/AppButton/AppButton"
import { useEffect, useState } from "react"
import * as Scry from 'scryfall-sdk'

export default function Card({params}: {params: {id: string}}) {

    const [card, setCard] = useState<Scry.Card>()
    const [userCard, setUserCard] = useState()
    const [priceHTML, setPriceHTML] = useState<React.JSX.Element[] | undefined>()

    useEffect(() => {
        const fetchData = async () => {
            setCard(await fetchScryfallCardById(params.id))
            setUserCard(await fetchScryfallCardById(params.id))
            console.log(JSON.stringify(userCard))
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

    function doThis() {
        console.log('Add to collection clicked')
    }

    return (
        <>
            {(card) 
                ?
            <div className={styles.main}>
                <CardImage card={card} />
                <div className={styles.details}>
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
                    <AppButton text="Add To Collection" buttonAction={doThis}/>
                </div>
            </div>
                :
            <div>
                Loading...
            </div>
            }
        </>
    )
}