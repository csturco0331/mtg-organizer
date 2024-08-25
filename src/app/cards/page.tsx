// import Link from "next/link"
import ScrollingCards from "@/app/cards/scrolling-cards"
import SearchHeader from "../components/SearchHeader/SearchHeader"

export default function Cards({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const search = typeof searchParams.search === 'string' ? searchParams.search: 'c:'

    return (
        <>
            <SearchHeader title="Cards"/>
            <ScrollingCards search={search}/>
        </>
    );
}
