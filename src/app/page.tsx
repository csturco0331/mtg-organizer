import styles from "./page.module.css"
import * as Scry from 'scryfall-sdk'

//https://scryfall.com/docs/api/cards/search
//https://scryfall.com/docs/syntax
//https://github.com/ChiriVulpes/scryfall-sdk/blob/main/DOCUMENTATION.md#cardssearch-query-string-options-searchoptions--number-magicemittercard-

export default async function Home() {

  debugger
  let cards = await Scry.Cards.search("c=r", 1).cancelAfterPage().waitForAll()
  console.log(cards.length)

  return (
    <div className={styles.wrapper}>
      <div>
        <h1>Cards</h1>
        
      </div>
      <div className={styles.main}>
        {cards.map(card => (
          <div key={card.id}>
            <img className={styles.img} src={card.getImageURI('normal')}></img>
          </div>
        ))}
      </div>
    </div>
  );
}
