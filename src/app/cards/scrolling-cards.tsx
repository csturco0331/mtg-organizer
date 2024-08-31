'use client'
import { SearchContext } from '../components/Providers/SearchProvider/SearchProvider'
import { fetchScryfallCards } from '@/app/actions/scryfall'
import { useEffect, useState, useContext } from 'react'
import { useInView } from 'react-intersection-observer'
import CardMap from '../components/CardMap/CardMap'
import * as Scry from 'scryfall-sdk'

export default function ScrollingCards() {

    const {search} = useContext(SearchContext)
    const [cards, setCards] = useState([] as Scry.Card[])
    const [ref, inView] = useInView()
    let page = 1
    console.log(`Search: ${search}`)
    async function loadMoreCards() {
        page += 1
        console.log(`Load: ${search}`)
        const cards = await fetchScryfallCards({search, page: page})
        if (cards?.length) {
            setCards((prev) => prev ? prev.concat(cards) : cards)
        }
    }

    async function loadNewCards() {
        const cards = await fetchScryfallCards({search})
        page = 1
        if (cards?.length) {
            setCards(cards)
        } else {
            setCards([])
        }
    }

    useEffect(() => {
        if (!cards.length) return
        if (inView) loadMoreCards()
        
    }, [inView])

    useEffect(() => {
        console.log(`New Search: ${search}`)
        loadNewCards()
    }, [search])

    return (
        <>
            <CardMap cards={cards} urlPath="/cards/variants/" getUserInventory={true}/>
            {/* loading spinner */}
            {(cards.length)
                ?
                <div ref={ref} />
                : <p>Bad Search Query</p>
            }
            
        </>
    )
}