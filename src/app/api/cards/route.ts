import { NextResponse } from "next/server"
import connect from '@/app/lib/db'
import Card from '@/app/lib/modals/card'
import { Types } from "mongoose"
import User from "@/app/lib/modals/user"
import Deck from "@/app/lib/modals/deck"

export const GET = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")
        const colors = searchParams.get("colors")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "75")

        if (!userId ||!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({error: 'Invalid user'}), {status: 400})
        }

        await connect()

        const filter: any = {
            user: new Types.ObjectId(userId),
        }
        if (colors) {
            filter.$or = [{colors: {$regex: colors, $options: 'i'}}]
        }

        const skip = (page - 1) *  limit

        const cards = await Card.find(filter)
            .skip(skip)
            .limit(limit)
        return new NextResponse(JSON.stringify(cards), {status: 200})
    } catch (error) {
        console.error(error)
        return new NextResponse("Failed to connect to the database.", {
            status: 500,
        })
    }
}

export const POST = async (req: Request) => {
    try {
        const body = await req.json()
        const {scryfallId, quantity, user: userId, colors, decks = []} = body
        if (!scryfallId ||!quantity ||!userId ||!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({error: 'Missing required fields'}), {status: 400})
        }
        await connect()
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({error: 'User not found'}), {status: 404})
        }
        for (const deckId of decks) {
            if (!Types.ObjectId.isValid(deckId)) {
                return new NextResponse(JSON.stringify({error: 'Invalid deck id'}), {status: 400})
            }
            const deck = await Deck.findById(deckId)
            if (!deck) {
                return new NextResponse(JSON.stringify({error: 'Deck not found'}), {status: 404})
            }
        }
        const newCard = new Card({
            scryfallId,
            quantity,
            user: new Types.ObjectId(userId),
            colors: colors,
            decks: decks.map((deck : 'string') => new Types.ObjectId(deck))
        })
        await newCard.save()
        return new NextResponse(JSON.stringify({message: 'Card is created', user: newCard}), {status: 201})
    } catch (error: any) {
        return new NextResponse(JSON.stringify({error: error.message}), {status: 500})
    }
}