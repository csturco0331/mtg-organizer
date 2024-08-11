'use client'
// import Link from "next/link"
import { useState } from "react"
import styles from "@/app/cards/cards.module.css"
import ScrollingCards from "@/app/cards/scrolling-cards"
import AppFilter from "@/app/components/AppFilter/AppFilter"
import CardSearch from "@/app/cards/card-search"

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
