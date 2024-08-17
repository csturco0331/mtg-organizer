'use server'

import { signIn } from "@/app/auth"
import { FormState } from "@/app/lib/definitions"
import { useSession } from "next-auth/react"
import { isRedirectError } from "next/dist/client/components/redirect"
import { redirect } from "next/navigation"

export const login = async (state: FormState, formData: FormData) => {
    try {
        await signIn('credentials', {email: formData.get('email'), password: formData.get('password'), redirect: false})
    } catch (err) {
        console.log('some unknown fucking error', JSON.stringify(err))
        return {message: 'Failed to Login'}
    }
    redirect('/dashboard')
}