'use client'
import AppButton from "@/app/components/AppButton/AppButton"

const AppNavBar = ({name}: {name?: string}) => {

    return (
        <>
            {(name) ? <AppButton text="Logout"/> : <></>}
        </>
    )
}

export default AppNavBar