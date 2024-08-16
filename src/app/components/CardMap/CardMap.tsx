import * as Scry from 'scryfall-sdk'
import styles from './CardMap.module.css'
import Link from 'next/link'
import CardImage from '../CardImage/CardImage'

const CardMap = ({cards, urlPath, searchByName = false}: {cards: Scry.Card[], urlPath: string, searchByName?: boolean}) => {

    return (
        <div className={styles.main}>
            {cards.map((card: Scry.Card) => (
                <div className={styles.gridSquare} key={card.id}>
                    {/* Split the name by // for dual faced cards */}
                    <Link className={styles.link} href={`${urlPath}${searchByName ? card.name.split('//')[0] : card.id}`}>{card.name.split('//')[0]}</Link>
                    <CardImage card={card} />
                </div>
            ))}
        </div>
    )

}

export default CardMap