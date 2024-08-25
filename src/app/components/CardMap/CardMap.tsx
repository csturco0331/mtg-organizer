import * as Scry from 'scryfall-sdk'
import styles from './CardMap.module.css'
import CardImage from '../CardImage/CardImage'
import InventoryUpdater from '../InventoryUpdater/InventoryUpdater'

const CardMap = ({cards, urlPath, getUserInventory = false}: {cards: Scry.Card[], urlPath: string, getUserInventory?: boolean}) => {

    return (
        <div className={styles.main}>
            {cards.map((card: Scry.Card) => (
                <div className={styles.gridSquare} key={card.id}>
                    {(getUserInventory) ? <></> : <InventoryUpdater card={card}></InventoryUpdater>}
                    {/* Split the name by // for dual faced cards */}
                    <CardImage card={card} href={`${urlPath}${getUserInventory ? card.name.split('//')[0] : card.id}`}/>
                </div>
            ))}
        </div>
    )

}

export default CardMap