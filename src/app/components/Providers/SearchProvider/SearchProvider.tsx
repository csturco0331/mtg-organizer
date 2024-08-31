'use client'
import { createContext, Dispatch, SetStateAction, useState } from "react";

type SearchType = { search: string; setSearch: Dispatch<SetStateAction<string>>; }

export const SearchContext = createContext<SearchType>({search: 'c:', setSearch: () => {}})

export default function SearchProvider({children}: Readonly<{
    children: React.ReactNode;
  }>) {

    const [search, setSearch] = useState('c:')

    return (
        <SearchContext.Provider value={{search, setSearch}}>
            {children}
        </SearchContext.Provider>
    )
}