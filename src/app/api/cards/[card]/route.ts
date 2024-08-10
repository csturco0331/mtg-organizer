import { NextResponse } from "next/server"
import connect from '@/app/lib/db'
import Card from '@/app/lib/modals/card'
import { Types } from "mongoose"
import User from "@/app/lib/modals/user"

export const GET = async (request: Request, context: {params: any}) => {
    const cardId = context.params.card
    if (!cardId || !Types.ObjectId.isValid(cardId)) {
        return new NextResponse(JSON.stringify({error: 'Invalid card'}), {status: 400})
    }
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")

        if (!userId ||!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({error: 'Invalid user'}), {status: 400})
        }

        await connect()


        const card = await Card.findOne({
            _id: cardId,
            user: userId
        })

        if (!card) {
            return new NextResponse(JSON.stringify({error: 'Card not found'}), {status: 404})
        }

        return new NextResponse(JSON.stringify({card}), {status: 200})
    } catch (error) {
        console.error(error)
        return new NextResponse("Failed to connect to the database.", {
            status: 500,
        })
    }
}

export const PATCH = async (request: Request, context: {params: any}) => {
    const cardId = context.params.card
    if (!cardId || !Types.ObjectId.isValid(cardId)) {
        return new NextResponse(JSON.stringify({error: 'Invalid card'}), {status: 400})
    }
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")
        const {scryfallId, colors, quantity, decks} = await request.json()

        if (!userId ||!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({error: 'Invalid user'}), {status: 400})
        }

        if (!scryfallId) {
            return new NextResponse(JSON.stringify({error: 'Missing scryfall Id'}), {status: 400})
        }

        if (!quantity) {
            return new NextResponse(JSON.stringify({error: 'Missing quantity'}), {status: 400})
        }

        await connect()

        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({error: 'User not found'}), {status: 404})
        }

        const card = await Card.findByIdAndUpdate(
            cardId,
            {user: userId, scryfallId, colors, quantity, decks: decks.map((deck: 'string') => new Types.ObjectId(deck))},
            {new: true}
        )
        return new NextResponse(JSON.stringify({card}), {status: 200})
    } catch (error) {
        console.error(error)
        return new NextResponse("Failed to connect to the database.", {
            status: 500,
        })
    }
}

export const DELETE = async (request: Request, context: {params: any}) => {
    const cardId = context.params.card
    if (!cardId || !Types.ObjectId.isValid(cardId)) {
        return new NextResponse(JSON.stringify({error: 'Invalid card'}), {status: 400})
    }
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")

        if (!userId ||!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({error: 'Invalid user'}), {status: 400})
        }

        await connect()

        const card = await Card.findOneAndDelete({
            _id: cardId,
            user: userId
        })

        if (!card) {
            return new NextResponse(JSON.stringify({error: 'Card not found'}), {status: 404})
        }

        return new NextResponse(JSON.stringify({card}), {status: 200})
    } catch (error) {
        console.error(error)
        return new NextResponse("Failed to connect to the database.", {
            status: 500,
        })
    }
}