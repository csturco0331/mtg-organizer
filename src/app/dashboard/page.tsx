'use client'
import { useContext, useEffect } from "react"
import { UserContext } from "../components/Providers/UserProvider/UserProvider"

export default function Dashboard () {
    
    const {user} = useContext(UserContext)

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your MTG Dashboard {user?.username}!</p>
        </div>
    )
}