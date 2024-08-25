import CardSearch from "@/app/cards/card-search";
import styles from "./SearchHeader.module.css"

export default function SearchHeader({title}: {title: string}) {

    return (
        <div className={styles.main}>
                <h1>{title}</h1>
                <CardSearch/>
            </div>
    )
}