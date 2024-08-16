'use server'
import * as Scry from 'scryfall-sdk'

//https://scryfall.com/docs/api/cards/search
//https://scryfall.com/docs/syntax
//https://github.com/ChiriVulpes/scryfall-sdk/blob/main/DOCUMENTATION.md#cardssearch-query-string-options-searchoptions--number-magicemittercard-

export async function fetchScryfallCards({page = 1, search = 'c:'}) {
    return JSON.parse(JSON.stringify(await Scry.Cards.search(search, page).cancelAfterPage().waitForAll()))
}

export async function fetchScryfallCardVariants(name: string) {
    return JSON.parse(JSON.stringify(await Scry.Cards.search(`!"${name}"`, {unique: 'prints'}).cancelAfterPage().waitForAll()))
}

export async function fetchScryfallCardById(id: string) {
    console.log(`Fetching card: ${id}`)
    return JSON.parse(JSON.stringify(await Scry.Cards.byId(id)))
}

export async function fetchScryfallTypes() {
    return await Scry.Catalog.spellTypes()
}