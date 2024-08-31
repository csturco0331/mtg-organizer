'use server'
import { translateFromDBCard, translateFromScryCard, UserCard } from "../lib/modals/card"
import {Card as ScryCard} from 'scryfall-sdk'
import { getSession, getSessionUser } from "../lib/session"
import { CardLink } from "../lib/modals/user"

export async function fetchCardFromDatabase(cardId: string) {
    const user = await getSessionUser()
    if (!user) return
    let data = await fetch(`${process.env.URL}/api/cards/${cardId}?userId=${user._id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    console.log('Card Fetched')
    return await data.json()
}

export async function createCardInDatabase(scryCard: ScryCard, quantity: number) {
    const user = await getSessionUser()
    if (!user) return
    let card = translateFromScryCard(scryCard)
    console.log('Card Translated')
    let data = await fetch(`${process.env.URL}/api/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({card, userId: user._id, quantity}),
    })
    let dbcard = await translateFromDBCard({data, userId: user._id, quantity})
    return dbcard
}

export async function updateCardInDatabase(card: UserCard) {
    const user = await getSessionUser()
    if (!user) return
    let data = await fetch(`${process.env.URL}/api/cards/${card._id}?userId=${user._id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(card),
    })
    let content = await data.json()
    console.log(content.error || 'Card Updated')
    return content
}

export async function deleteCardFromDatabase(_id: string) {
    const user = await getSessionUser()
    if (!user) return
    let data = await fetch(`${process.env.URL}/api/cards/${_id}?userId=${user._id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    let content = await data.json()
    console.log(content.error || 'Card Deleted')
    return content
}

export async function fetchUserFromDatabase(email: string, password: string) {
    console.log(`Fetching user: ${email}`)
    let data = await fetch(`${process.env.URL}/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `session=${getSession()}`
        },
        body: JSON.stringify({email, password}),
    })
    let body = await data.json()
    return JSON.parse(JSON.stringify(body))
}

export async function createUserInDatabase({email, username, password}: {email: string, username: string, password: string}) {
    return await fetch(`${process.env.URL}/api/users`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, username, password}),
    })
}

export async function fetchUserContextFromDatabase() {
    let data = await fetch(`${process.env.URL}/api/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `session=${getSession()}`
        }
    })
    let body = await data.json()
    return JSON.parse(JSON.stringify(body))
}

export async function updateCollection(card: CardLink) {
    let data = await fetch(`${process.env.URL}/api/users`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `session=${getSession()}`
        },
        body: JSON.stringify(card)
    })
    let body = await data.json()
    return JSON.parse(JSON.stringify(body))
}