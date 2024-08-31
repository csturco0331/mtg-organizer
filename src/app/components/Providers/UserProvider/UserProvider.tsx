'use client'
import { fetchUserContextFromDatabase } from "@/app/actions/mongo";
import { User } from "@/app/lib/modals/user";
import { createContext, useEffect, useState } from "react";


type T = {
    user: User | null,
    setUser: (user: User | null) => void
}

export const UserContext = createContext<T>({user: null, setUser: () => {}})

export default function UserProvider({children}: Readonly<{
    children: React.ReactNode;
  }>) {

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        setLoading(true)
        fetchUserContextFromDatabase()
        .then(user => {
            if (!user || !user._id) setUser(null)
            else setUser(user)
            setLoading(false)
        })
    }, [])

    return (
        loading
            ? <></>
            :
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}