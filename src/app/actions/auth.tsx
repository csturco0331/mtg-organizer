'use server'

import { redirect } from "next/navigation"
import { FormState, SignupFormSchema } from "../lib/definitions"
import { createSession } from "../lib/session"
import { fetchUserFromDatabase, createUserInDatabase } from "./mongo"
import bcrypt from "bcrypt"

export const signUp = async (state: FormState, formData: FormData) => {
    try {
        //validate form dat
        const validatedFields = SignupFormSchema.safeParse({
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
        })

        // If any form fields are invalid, return early
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const { username, email, password } = validatedFields.data
        //see if user email already exists
        let res = await fetchUserFromDatabase(email)
        let user = await res.json()
        console.log(JSON.stringify(user))
        if (user && user.id) {
            console.log('User already exists')
            return {
                errors: {
                    email: ['Email already exists'],
                },
            }
        }
        //hash password
        const pwHash = await bcrypt.hash(password, 10)
        //create user in database
        res = await createUserInDatabase({ email, password: pwHash, username })
        user = await res.json()
        //create user session
        await createSession(user.id)

        redirect('/cards')
    } catch (err) {
        return
    }
}

export const authorize = async (credentials: Partial<Record<"email" | "password", unknown>>) => {
    try {
        let user = null
        // logic to verify if the user exists
        let res = await fetchUserFromDatabase(credentials.email as string)
        user = await res.json()

        if (!user || !user.id) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.")
        }

        let correctAuth = await bcrypt.compare(credentials.password as string, user.password)
        if (!correctAuth) {
            throw new Error("Invalid credentials.")
        }

        // return user object with their profile data
        return user
    } catch (err) {
        return null
    }
}