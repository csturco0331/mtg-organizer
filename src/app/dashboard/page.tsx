import { redirect } from 'next/navigation'
import { auth } from '../auth'

interface Session {
    user: {
        email: string,
        username: string,
        _id: string
    },
    expires: string
}

export default async function Dashboard () {
    const session = await auth() as Session
    if (!session || !session.user) {
        redirect('/signIn')
    }
    const {user, expires} = session
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your MTG Dashboard {user.username}!</p>
        </div>
    )
}