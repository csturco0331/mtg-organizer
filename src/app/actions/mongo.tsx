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
    console.log(JSON.stringify(data))
    return JSON.parse(JSON.stringify(data))
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