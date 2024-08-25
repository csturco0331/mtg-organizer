interface Session {
    user: {
        email: string,
        username: string,
        _id: string
    },
    expires: string
}

export default async function Dashboard () {
    
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your MTG Dashboard!</p>
        </div>
    )
}