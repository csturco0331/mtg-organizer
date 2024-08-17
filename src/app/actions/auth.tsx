'use server'

import { redirect } from "next/navigation"
import { FormState, signInSchema, SignupFormSchema } from "../lib/definitions"
import { fetchUserFromDatabase, createUserInDatabase } from "./mongo"
import { User } from "next-auth"
import bcrypt from 'bcrypt'

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
        let res = await fetchUserFromDatabase(email, password)
        let user = await res.json()
        if (user.error !== "Failed to get user") {
            console.log('User already exists')
            return {
                errors: {
                    email: ['Email already exists'],
                },
            }
        }
        //create user in database
        res = await createUserInDatabase({ email, password: password, username })
        user = await res.json()
        console.log('testing')
    } catch (err) {
        return {
            errors: {
                email: ['An error occurred']
            }
        }
    }
    redirect('/signIn')
}

export const authorize = async (credentials: Partial<Record<"email" | "password", unknown>>) => {
    console.log('at least authorize is being called right?')
    let user = null
    //verify input parameters
    const validatedFields = signInSchema.safeParse({
        email: credentials.email,
        password: credentials.password,
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        console.log('Invalid data')
        throw new Error('Invalid data')
    }

    const { email, password } = validatedFields.data

    // logic to verify if the user exists
    let res = await fetchUserFromDatabase(email, password)
    user = await res.json()
    if (!user || !user._id) {
        console.log('User not found')
        // No user found, so this is their first attempt to login
        // meaning this is also the place you could do registration
        throw new Error('Bad Credentials')
    }
    // return user object with their profile data
    console.log('User was fucking authenticated')
    return {
        _id: user._id as string,
        email: user.email as string,
        username: user.username as string,
    } as User
}