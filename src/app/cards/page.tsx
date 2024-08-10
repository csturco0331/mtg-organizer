'use client'
// import Link from "next/link"
import { useState } from "react"
import styles from "./cards.module.css"
import ScrollingCards from "./scrolling-cards"
import AppFilter from "../components/AppFilter/AppFilter"
import CardSearch from "./card-search"

//https://scryfall.com/docs/api/cards/search
//https://scryfall.com/docs/syntax
//https://github.com/ChiriVulpes/scryfall-sdk/blob/main/DOCUMENTATION.md#cardssearch-query-string-options-searchoptions--number-magicemittercard-

export default function Cards({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    // const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1
    const search = typeof searchParams.search === 'string' ? searchParams.search: 'c:'
    // const [filterFlag, setFilterFlag] = useState(false)

    // const toggleFilter = () => {
    //     setFilterFlag(!filterFlag)
    // }

    return (
        <div className={styles.wrapper}>
            <div className={styles.main}>
                <h1>Cards</h1>
                <CardSearch/>
                {/* <div className={styles.filterButton} onClick={toggleFilter}>Filter</div>
                {(filterFlag)
                    ? <AppFilter></AppFilter>
                    : undefined
                } */}
                {/* <div className={styles.paging}>
                    {(page!==1) ?
                        <Link className={styles.pagingButton} href={{pathname: '/cards', query: {...(search ? {search} : {}), page: page - 1}}}>Previous</Link>
                        : undefined
                    }
                    <Link className={styles.pagingButton} href={{pathname: '/cards', query: {...(search ? {search} : {}), page: page + 1}}}>Next</Link>
                </div> */}
            </div>
            <div className={styles.main}>
                <ScrollingCards search={search}/>
            </div>
        </div>
    );
}
