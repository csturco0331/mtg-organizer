'use client'
import { SearchContext } from "../Providers/SearchProvider/SearchProvider"
import { useDebouncedCallback } from "use-debounce"
import styles from './SearchBar.module.css'
import { useContext } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function CardSearch() {

    const router = useRouter()
    const {search, setSearch} = useContext(SearchContext)
    let path = usePathname()

    const handleSearch = useDebouncedCallback((newSearch: string) => {
        console.log('Calling handleSearch')
        if (search === newSearch) return
        setSearch(newSearch)
        if (path !== '/cards')
            router.push('/cards')
    }, 800)

    return (
        <input className={styles.search} onChange={e => handleSearch(e.target.value)} />
    )
}