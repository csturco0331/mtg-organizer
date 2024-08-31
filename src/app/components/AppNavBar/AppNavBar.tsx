'use client'
import { logout } from "@/app/actions/auth"
import AppButton from "@/app/components/AppButton/AppButton"
import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider/UserProvider"
import styles from './AppNavBar.module.css'
import SearchBar from "../SearchBar/SearchBar"

const AppNavBar = () => {

    const {user, setUser} = useContext(UserContext)

    function userLogout() {
        console.log('Setting user to null: ', setUser(null))
        logout()
    }
    
    return user ? (
        <div className={styles.main}>
            <SearchBar></SearchBar>
            <h2>{user.username}</h2>
            <AppButton text="Logout" onClick={() => userLogout()}/>
        </div>
    ) : (<></>)
}

export default AppNavBar