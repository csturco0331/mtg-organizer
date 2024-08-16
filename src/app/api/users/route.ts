import { NextResponse } from "next/server"
import connect from '@/app/lib/db'
import User from '@/app/lib/modals/user'
import { Types } from "mongoose"

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
        const {email} = body
        if (!email) {
            return new NextResponse(JSON.stringify({error: 'Missing email'}), {status: 400})
        }
        await connect()
        const users = await User.findOne({email})
        return new NextResponse(JSON.stringify(users), {status: 200})
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
        const body = await req.json()
        await connect()
        const newUser = new User(body)
        await newUser.save()
        return new NextResponse(JSON.stringify({message: 'User is created', user: newUser}), {status: 201})
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
        return new NextResponse(JSON.stringify({message: 'User is updated', user: updatedUser}), {status: 200})
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