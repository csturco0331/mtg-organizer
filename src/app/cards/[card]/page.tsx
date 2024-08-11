import { fetchCardById } from "@/app/shared/actions"
import styles from '@/app/cards/[card]/card.module.css'
import CardImage from "@/app/components/CardImage/CardImage"

export default function Card({params}: {params: {card: string}}) {

    async function getCard() {
        try {
            let card = await fetchCardById(params.card)
            let keys = Object.keys(card)
            return (
                <div className={styles.main}>
                    <CardImage card={card} />
                    <div className={styles.details}>
                        {keys.map(key => (
                            <div key={key} className={styles.key}>
                                <b>{key}</b>: {JSON.stringify(card[key])}
                            </div>
                        ))}
                    </div>
                </div>
            )
        } catch (err) {
            return (
                <>Error fetching card data</>
            )
        }
    }

    return (
        <>
            {getCard()}
        </>
    )
}