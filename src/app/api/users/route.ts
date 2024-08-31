import { NextResponse } from "next/server"
import connect from '@/app/lib/dbConnection'
import { CardLink, User } from '@/app/lib/modals/user'
import { Types } from "mongoose"
import bcrypt from "bcrypt"
import { getSessionUser } from "@/app/lib/session"
//todo: remove
export const GET = async () => {
    try {
        let user = await getSessionUser()
        if (!user) return new NextResponse(JSON.stringify({error: 'Not Signed In'}), {status: 401})
        await connect()
        const users = await User.findOne({_id: user._id})
        const returnObj = {
            '_id': users._id,
            'username': users.username,
            'cards': users.cards
        }
        return new NextResponse(JSON.stringify(returnObj), {status: 200})
    } catch (error) {
        console.error(error)
        return new NextResponse("Failed to connect to the database.", {
            status: 500,
        })
    }
}

//Get user based on credentials
export const POST = async (req: Request) => {
    try {
        const body = await req.json()
        const {email, password} = body
        if (!email || !password) {
            return new NextResponse(JSON.stringify({error: 'Missing parameter'}), {status: 400})
        }
        await connect()
        const user = await User.findOne({email})
        if (!user) {
            return new NextResponse(JSON.stringify({error: "Failed to get user"}), {status: 400})
        }
        
        let correctAuth = await bcrypt.compare(password, user.password)
        if (!correctAuth) {
            console.log('Invalid password')
            return new NextResponse(JSON.stringify({error: 'Invalid password'}), {status: 400})
        }

        const {username, _id, cards} = user
        return new NextResponse(JSON.stringify({message: 'Logged In', user: {username, _id, cards}}), {status: 200})
    } catch (error) {
        console.error(error)
        return new NextResponse("Failed to connect to the database.", {
            status: 500,
        })
    }
}

//Create new user
export const PUT = async (req: Request) => {
    try {
        const {username, email, password} = await req.json()  
        //hash password
        const pwHash = await bcrypt.hash(password, 10)
        await connect()
        const newUser = new User({username, email, password: pwHash})
        await newUser.save()
        const {_id} = newUser
        return new NextResponse(JSON.stringify({message: 'User is created', user: {_id, username}}), {status: 201})
    } catch (error: any) {
        return new NextResponse(JSON.stringify({error: error.message}), {status: 500})
    }
}

export const PATCH = async (req: Request) => {
    try {
        let user = await getSessionUser()
        if (!user) return new NextResponse(JSON.stringify({error: 'Not Signed In'}), {status: 401})
        let _id = user._id
        if (!_id || !Types.ObjectId.isValid(_id)) {
            return new NextResponse(JSON.stringify({error: 'Not Signed In'}), {status: 401})
        }
        const card = await req.json()
        await connect()
        let updatedUser
        if (card)
            updatedUser = await User.findById(_id)
        if (!updatedUser) {
            return new NextResponse(JSON.stringify({message: 'User not found'}), {status: 400})
        }
        let index = updatedUser.cards.findIndex((c: CardLink) => c.cardId === card.cardId)
        if (index !== -1 && card.quantity > 0) { //card found on user already and we have a positive quantity
            updatedUser.cards[index] = card
        } else if (index !== -1) { //card found but quantity is zero so need to delete
            updatedUser.cards.splice(index, 1)
        } else if (card.quantity) { //add new cardLink
            updatedUser.cards.push(card)
        } //card not found and quantity is zero so do nothing
        await updatedUser.save()
        const returnObj = {
            '_id': updatedUser._id,
            'username': updatedUser.username,
            'cards': updatedUser.cards
        }

        return new NextResponse(JSON.stringify({message: 'User is updated', user: returnObj}), {status: 200})
    } catch (error: any) {
        return new NextResponse(JSON.stringify({error: error.message}), {status: 500})
    }
}

export const DELETE = async (req: Request) => {
    try {
        const {_id} = await req.json()
        await connect()
        if (!_id) {
            return new NextResponse(JSON.stringify({error: 'Missing _id'}), {status: 400})
        }
        if (!Types.ObjectId.isValid(_id)) {
            return new NextResponse(JSON.stringify({error: 'Invalid _id'}), {status: 400})
        }
        await User.findByIdAndDelete(_id)
        return new NextResponse(JSON.stringify({message: 'User is deleted'}), {status: 200})
    } catch (error: any) {
        return new NextResponse(JSON.stringify({error: error.message}), {status: 500})
    }
}