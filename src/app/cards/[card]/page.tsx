import { fetchCardById } from "@/app/shared/actions"
import styles from '@/app/cards/cards.module.css'
import CardImage from "@/app/components/CardImage/CardImage"

export default function Card({params}: {params: {card: string}}) {

    async function getCard() {
        try {
            let card = await fetchCardById(params.card)
            return (
                <>
                    <CardImage card={card} />
                </>
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