import { translateCard, UserCard } from "../lib/modals/card"
import {Card as ScryCard} from 'scryfall-sdk'

export async function fetchCardFromDatabase(cardId: string) {
    let session = {user: {_id: ''}} //TODO: Update with proper session id
    if (!session || !session.user) return
    let data = await fetch(`${process.env.URL}/api/cards/${cardId}?userId=${session.user._id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    console.log('Card Fetched')
    return await data.json()
}

export async function createCardInDatabase(scryCard: ScryCard, quantity: number) {
    let session = {user: {_id: ''}} //TODO: Update with proper session id
    if (!session || !session.user) return
    let card = translateCard(scryCard, quantity, session.user._id)
    console.log('Card Translated')
    let data = await fetch(`${process.env.URL}/api/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...card, user: session.user._id}),
    })
    let content = await data.json()
    console.log(content.error || 'Card Created')
    return content
}

export async function updateCardInDatabase(card: UserCard) {
    let session = {user: {_id: ''}} //TODO: Update with proper session id
    if (!session || !session.user) return
    let data = await fetch(`${process.env.URL}/api/cards/${card._id}?userId=${session.user._id}`, {
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
    let session = {user: {_id: ''}} //TODO: Update with proper session id
    if (!session || !session.user) return
    let data = await fetch(`${process.env.URL}/api/cards/${_id}?userId=${session.user._id}`, {
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
    return await fetch(`${process.env.URL}/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
    })
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