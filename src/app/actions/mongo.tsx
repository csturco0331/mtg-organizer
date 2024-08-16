'use server'

export async function fetchCardFromDatabase(cardId: string, userId: string) {
    let data = await fetch(`${process.env.URL}/api/cards/${cardId}?userId=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    console.log(JSON.stringify(data))
    return JSON.parse(JSON.stringify(data))
}

export async function fetchUserFromDatabase(email: string) {
    console.log(`Fetching user: ${email}`)
    return await fetch(`${process.env.URL}/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
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