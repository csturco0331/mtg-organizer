import { NextResponse } from "next/server"
import connect from '@/app/lib/db'
import { Types } from "mongoose"
import User from "@/app/lib/modals/user"
import Deck from "@/app/lib/modals/deck"
import Card from "@/app/lib/modals/card"

export const GET = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId")
        const name = searchParams.get("name")
        const colors = searchParams.get("colors")
        const commander = searchParams.get("commander")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "75")

        if (!userId ||!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({error: 'Invalid user'}), {status: 400})
        }

        await connect()

        const filter: any = {
            user: new Types.ObjectId(userId),
        }
        // if (colors) {
            filter.$or = [{colors: {$regex: colors, $options: 'i'}}, {name: {$regex: name, $options: 'i'}}, {commander: {$regex: commander, $options: 'i'}}]
        // }

        const skip = (page - 1) *  limit

        const decks = await Deck.find(filter)
            .skip(skip)
            .limit(limit)
        return new NextResponse(JSON.stringify(decks), {status: 200})
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
        const {name, colors, cards, user: userId, commander} = body
        if (!name ||!colors ||!userId ||!commander ||!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({error: 'Missing required fields'}), {status: 400})
        }
        await connect()
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({error: 'User not found'}), {status: 404})
        }

        for (const cardId of cards) {
            if (!Types.ObjectId.isValid(cardId)) {
                return new NextResponse(JSON.stringify({error: 'Invalid deck id'}), {status: 400})
            }
            const card = await Card.findById(cardId)
            if (!card) {
                return new NextResponse(JSON.stringify({error: 'Card not found'}), {status: 404})
            }
        }
        const newDeck = new Deck({
            name,
            colors,
            user: new Types.ObjectId(userId),
            cards: cards.map((card : 'string') => new Types.ObjectId(card)),
            commander: new Types.ObjectId(commander)
        })
        await newDeck.save()
        return new NextResponse(JSON.stringify({message: 'Deck is created', user: newDeck}), {status: 201})
    } catch (error: any) {
        return new NextResponse(JSON.stringify({error: error.message}), {status: 500})
    }
}