import { NextResponse } from "next/server"
import connect from '@/app/lib/db'
import { Types } from "mongoose"
import User from "@/app/lib/modals/user"
import Deck from "@/app/lib/modals/deck"

export const GET = async (request: Request, context: {params: any}) => {
    const deckId = context.params.deck
    if (!deckId || !Types.ObjectId.isValid(deckId)) {
        return new NextResponse(JSON.stringify({error: 'Invalid deck'}), {status: 400})
    }
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")

        if (!userId ||!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({error: 'Invalid user'}), {status: 400})
        }

        await connect()

        const deck = await Deck.findOne({
            _id: deckId,
            user: userId
        })

        if (!deck) {
            return new NextResponse(JSON.stringify({error: 'Deck not found'}), {status: 404})
        }

        return new NextResponse(JSON.stringify({card: deck}), {status: 200})
    } catch (error) {
        console.error(error)
        return new NextResponse("Failed to connect to the database.", {
            status: 500,
        })
    }
}

export const PATCH = async (request: Request, context: {params: any}) => {
    const deckId = context.params.deck
    if (!deckId || !Types.ObjectId.isValid(deckId)) {
        return new NextResponse(JSON.stringify({error: 'Invalid card'}), {status: 400})
    }
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")
        const {name, colors, cards, commander} = await request.json()

        if (!userId ||!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({error: 'Invalid user'}), {status: 400})
        }

        if (!name) {
            return new NextResponse(JSON.stringify({error: 'Missing name'}), {status: 400})
        }

        if (!colors) {
            return new NextResponse(JSON.stringify({error: 'Missing colors'}), {status: 400})
        }

        if (!cards) {
            return new NextResponse(JSON.stringify({error: 'Missing cards'}), {status: 400})
        }

        if (!commander) {
            return new NextResponse(JSON.stringify({error: 'Missing commander'}), {status: 400})
        }

        await connect()

        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({error: 'User not found'}), {status: 404})
        }

        const deck = await Deck.findByIdAndUpdate(
            deckId,
            {
                name,
                colors,
                user: new Types.ObjectId(userId),
                cards: cards.map((card : 'string') => new Types.ObjectId(card)),
                commander: new Types.ObjectId(commander)
            },
            {new: true}
        )
        return new NextResponse(JSON.stringify({deck: deck}), {status: 200})
    } catch (error) {
        console.error(error)
        return new NextResponse("Failed to connect to the database.", {
            status: 500,
        })
    }
}

export const DELETE = async (request: Request, context: {params: any}) => {
    const deckId = context.params.deck
    if (!deckId || !Types.ObjectId.isValid(deckId)) {
        return new NextResponse(JSON.stringify({error: 'Invalid deck'}), {status: 400})
    }
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")

        if (!userId ||!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({error: 'Invalid user'}), {status: 400})
        }

        await connect()

        const deck = await Deck.findOneAndDelete({
            _id: deckId,
            user: userId
        })

        if (!deck) {
            return new NextResponse(JSON.stringify({error: 'Deck not found'}), {status: 404})
        }

        return new NextResponse(JSON.stringify({deck: deck}), {status: 200})
    } catch (error) {
        console.error(error)
        return new NextResponse("Failed to connect to the database.", {
            status: 500,
        })
    }
}