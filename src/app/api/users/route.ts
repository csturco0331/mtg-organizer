import { NextResponse } from "next/server"
import connect from '@/app/lib/dbConnection'
import User from '@/app/lib/modals/user'
import { Types } from "mongoose"
import bcrypt from "bcrypt"
//todo: remove
export const GET = async () => {
    try {
 
        await connect()
        const users = await User.find()
        return new NextResponse(JSON.stringify(users), {status: 200})
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

        const {username, _id} = user
        return new NextResponse(JSON.stringify({username, email, _id}), {status: 200})
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
        return new NextResponse(JSON.stringify({message: 'User is created', user: {_id, username, email}}), {status: 201})
    } catch (error: any) {
        return new NextResponse(JSON.stringify({error: error.message}), {status: 500})
    }
}

export const PATCH = async (req: Request) => {
    try {
        const {_id, username} = await req.json()
        await connect()
        if (!_id || !username) {
            return new NextResponse(JSON.stringify({error: 'Missing _id or username'}), {status: 400})
        }
        if (!Types.ObjectId.isValid(_id)) {
            return new NextResponse(JSON.stringify({error: 'Invalid _id'}), {status: 400})
        }
        const updatedUser = await User.findByIdAndUpdate(_id, {username}, {new: true})
        if (!updatedUser) {
            return new NextResponse(JSON.stringify({message: 'User not found'}), {status: 400})
        }
        const {email} = updatedUser

        return new NextResponse(JSON.stringify({message: 'User is updated', user: {_id, username, email}}), {status: 200})
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