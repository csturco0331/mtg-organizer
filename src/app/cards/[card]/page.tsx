'use client'
import { fetchCardFromDatabase, fetchScryfallCardById } from "@/app/actions/scryfall"
import styles from '@/app/cards/[card]/card.module.css'
import CardImage from "@/app/components/CardImage/CardImage"
import AppButton from "@/app/components/AppButton/AppButton"

export default function Card({params}: {params: {card: string}}) {

    async function getCard() {
        try {
            let card = await fetchScryfallCardById(params.card)
            let userCard = await fetchCardFromDatabase(params.card, '66ad1502d214010ead41086d')
            console.log(JSON.stringify(userCard))
            let priceKeys = Object.keys(card.prices)
            let priceFlag = false
            return (
                <div className={styles.main}>
                    <CardImage card={card} />
                    <div className={styles.details}>
                        <div className={styles.prices}>
                            {(priceFlag) ? <b>Prices:</b> : ''}
                            <ul>
                                {priceKeys.map(key => {
                                    if (card.prices[key]) {
                                        priceFlag = true
                                        return (<li key={key}>{key}: {card.prices[key]}</li>)
                                    }
                                })}
                            </ul>
                        </div>
                        { (card.purchase_uris) 
                            ? <a className={styles.anchor} href={card.purchase_uris.tcgplayer}>TCGPlayer</a>
                            : null
                        }
                        <AppButton text="Add To Collection" buttonAction={doThis}/>
                    </div>
                </div>
            )
        } catch (err) {
            return (
                <>Error fetching card data</>
            )
        }
    }

    function doThis() {
        console.log('Add to collection clicked')
    }

    return (
        <>
            {getCard()}
        </>
    )
}