'use client'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import styles from './cards.module.css'

export default function CardSearch() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const handleSearch = useDebouncedCallback((search: string) => {
        const params = new URLSearchParams(searchParams)
        if (search) {
            params.set('search', search)
        } else {
            params.delete('search')
        }
        router.push(`${pathname}?${params.toString()}`)
        router.refresh()
    }, 800)

    return (
        <div>
            <label htmlFor="search">Search</label>
            <input className={styles.search} onChange={e => handleSearch(e.target.value)} />
        </div>
    )
}