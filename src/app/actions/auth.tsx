'use server' //needed
import { redirect } from "next/navigation"
import { FormState, signInSchema, SignupFormSchema } from "../lib/definitions"
import { fetchUserFromDatabase, createUserInDatabase } from "./mongo"
import { createSession, deleteSession } from "../lib/session"

export const signUp = async (state: FormState, formData: FormData) => {
    try {
        //validate form data
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
        let user = await fetchUserFromDatabase(email, password)
        if (user.error !== "Failed to get user") {
            console.log('User already exists')
            return {
                errors: {
                    email: ['Email already exists'],
                },
            }
        }
        //create user in database
        user = await createUserInDatabase({ email, password: password, username })
        //store session
        createSession({
            _id: user._id,
            email: user.email,
            username: user.username
        })
        return {
            user: user
        }
    } catch (err) {
        return {
            errors: {
                email: ['An error occurred']
            }
        }
    }
}

export const login = async (state: FormState, formData: FormData) => {
    let user = null
    //verify input parameters
    const validatedFields = signInSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })
    
    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        console.log('Invalid data')
        return {
            errors: validatedFields.error.flatten().fieldErrors
        }
    }
    
    const { email, password } = validatedFields.data

    // logic to verify if the user exists
    let result = await fetchUserFromDatabase(email, password)
    user = result.user
    if (!user || !user._id) {
        console.log('User not found')
        // No user found, so this is their first attempt to login
        // meaning this is also the place you could do registration
        return {
            message: 'Bad Credentials'
        }
    }
    //store session
    createSession({
        _id: user._id,
        email: user.email,
        username: user.username
    })
    return {
        user: user
    }
}

export const logout = async () => {
    console.log('Logout')
    deleteSession()
    redirect('/signIn')
}