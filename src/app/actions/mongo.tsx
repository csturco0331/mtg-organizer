'use server'

import { auth } from "@/app/auth"

export async function fetchCardFromDatabase(cardId: string) {
    let session = await auth()
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

export async function createCardInDatabase({scryfallId, quantity, decks, cardId}: {scryfallId: string | undefined, quantity: number, decks: string[] | undefined, cardId: string | undefined}) {
    let session = await auth()
    if (!session || !session.user) return
    let data = await fetch(`${process.env.URL}/api/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({scryfallId, quantity, decks, user: session.user._id}),
    })
    let content = await data.json()
    console.log(content.error || 'Card Created')
    return content
}

export async function updateCardInDatabase({scryfallId, quantity, decks, cardId}: {scryfallId: string | undefined, quantity: number, decks: string[] | undefined, cardId: string | undefined}) {
    let session = await auth()
    if (!session || !session.user) return
    let data = await fetch(`${process.env.URL}/api/cards/${cardId}?userId=${session.user._id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({scryfallId, quantity, decks}),
    })
    let content = await data.json()
    console.log(content.error || 'Card Updated')
    return content
}

//setting the param object the exact same for all the card methods so that they can be interchanged in use
export async function deleteCardFromDatabase({scryfallId, quantity, decks, cardId}: {scryfallId: string | undefined, quantity: number, decks: string[] | undefined, cardId: string | undefined}) {
    let session = await auth()
    if (!session || !session.user) return
    let data = await fetch(`${process.env.URL}/api/cards/${cardId}?userId=${session.user._id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    let content = await data.json()
    console.log(content.error || 'Card Deleted')
    console.log(content)
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