'use client'
import { useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import styles from '@/app/cards/cards.module.css'

export default function CardSearch({pathname = '/cards'}: {pathname?: string}) {
    const searchParams = useSearchParams()
    const router = useRouter()

    const handleSearch = useDebouncedCallback((search: string) => {
        console.log('Calling handleSearch')
        const params = new URLSearchParams(searchParams)
        if (search) {
            params.set('search', search)
        } else {
            params.delete('search')
        }
        router.push(`${pathname}?${params.toString()}`)
    }, 800)

    return (
        <div>
            <label htmlFor="search">Search</label>
            <input className={styles.search} onChange={e => handleSearch(e.target.value)} />
        </div>
    )
}