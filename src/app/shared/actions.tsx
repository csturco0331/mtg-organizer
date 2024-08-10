'use server'
import * as Scry from 'scryfall-sdk'

export async function fetchCards({page = 1, search = 'c:'}: {page?: number, search?: string}) {
    return JSON.parse(JSON.stringify(await Scry.Cards.search(search, page).cancelAfterPage().waitForAll()))
}

export async function fetchTypes() {
    return await Scry.Catalog.spellTypes()
}