'use server'
import * as Scry from 'scryfall-sdk'

//https://scryfall.com/docs/api/cards/search
//https://scryfall.com/docs/syntax
//https://github.com/ChiriVulpes/scryfall-sdk/blob/main/DOCUMENTATION.md#cardssearch-query-string-options-searchoptions--number-magicemittercard-

export async function fetchCards({page = 1, search = 'c:'}: {page?: number, search?: string}) {
    return JSON.parse(JSON.stringify(await Scry.Cards.search(search, page).cancelAfterPage().waitForAll()))
}

export async function fetchCardById(id: string) {
    console.log(`Fetching card: ${id}`)
    return JSON.parse(JSON.stringify(await Scry.Cards.byId(id)))
}

export async function fetchTypes() {
    return await Scry.Catalog.spellTypes()
}