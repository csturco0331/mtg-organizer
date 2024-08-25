import { fetchScryfallCardVariants } from '@/app/actions/scryfall'
import CardMap from '@/app/components/CardMap/CardMap'
import SearchHeader from '@/app/components/SearchHeader/SearchHeader'

export default function Variants({params}: {params: {name: string}}) {

    console.log('Variants page loading...')
    let search = decodeURI(params.name)
        .replace(/%2C/g, ',')
        .replace(/%2B/g, '+')
    console.log(`Search: ${search}`)
    async function getVariants() {
        try {
            let cards = await fetchScryfallCardVariants(search)
            if (cards.length === 1) {
                
            }
            return (
                <>
                    <SearchHeader title="Variants"/>
                    <CardMap cards={cards} urlPath="/cards/"/>
                </>
            )
        } catch (err) {
            return (
                <div>An error occurred: {JSON.stringify(err)}</div>
            )
        }
    }

    return (
        <>
            {getVariants()}
        </>
    )
}