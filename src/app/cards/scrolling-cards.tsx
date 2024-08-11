'use client'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import * as Scry from 'scryfall-sdk'
import { fetchCards } from '@/app/shared/actions'
import CardMap from '../components/CardMap/CardMap'

export default function ScrollingCards({search = 'c:'}: {search: string}) {

    const [cards, setCards] = useState([] as Scry.Card[])
    const [page, setPage] = useState(1)
    const [ref, inView] = useInView()

    console.log(`Search: ${search}`)
    async function loadMoreCards() {
        const next = page + 1
        console.log(`Load: ${search}`)
        const cards = await fetchCards({search, page: next})
        if (cards?.length) {
            setPage(next)
            setCards((prev) => prev ? prev.concat(cards) : cards)
        }
    }

    async function loadNewCards() {
        console.log(`Loading new search: ${search}`)
        const cards = await fetchCards({search})
        if (cards?.length) {
            setPage(1)
            setCards(cards)
        } else {
            setPage(1)
            setCards([])
        }
    }

    useEffect(() => {
        if (inView) loadMoreCards()
        
    }, [inView])

    useEffect(() => {
        console.log(`New Search: ${search}`)
        loadNewCards()
    }, [search])

    return (
        <>
            <CardMap cards={cards} urlPath="/cards/variants/" searchByName={true}/>
            {/* loading spinner */}
            {(cards.length)
                ?
                <div ref={ref}>
                    Loading
                </div>
                : <p>Bad Search Query</p>
            }
            
        </>
    )
}