import { Schema, model, models } from "mongoose";
import * as Scry from 'scryfall-sdk'

const CardSchema = new Schema(
    {
        _id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        image: { type: ['string'], required: true },
        type_line: { type: ['string'], required: true },
        oracle_text: { type: ['string'], required: true },
        color_identity: { type: Array<"W" | "B" | "R" | "U" | "G">, required: true },
        keywords: { type: ['string'], required: true },
        tcgplayer: { type: 'string' },
    },
    {
        timestamps: true
    }
)

export const Card = models.Card || model('Card', CardSchema)

export type UserCard = {
    _id: string,
    name: string,
    image: (string | undefined)[],
    type_line: string[],
    oracle_text: string[],
    color_identity: Array<'W' | 'B' | 'R' | 'U' | 'G'>,
    keywords: string[],
    tcgplayer?: string | undefined | null,
    userId?: string,
    quantity?: Number
}

// Function to translate a Scryfall card into a UserCard object
export function translateFromScryCard(card: Scry.Card): UserCard {
    let image, type_line, oracle_text
    if (card.card_faces[0]?.name) { //dual faced card
        let front = card.card_faces[0], back = card.card_faces[1]
        image = [front?.image_uris?.normal || '', back?.image_uris?.normal || '']
        type_line = [front?.type_line || '', back?.type_line || '']
        oracle_text = [front?.oracle_text || '', back?.oracle_text || '']
    } else {
        image = [card.image_uris?.normal]
        type_line = [card.type_line || '']
        oracle_text = [card.oracle_text || '']
    }
    return {
        _id: card.id,
        name: card.name,
        image: image,
        type_line: type_line,
        oracle_text: oracle_text,
        color_identity: card.color_identity,
        keywords: card.keywords,
        tcgplayer: card.purchase_uris?.tcgplayer,
    }
}

export async function translateFromDBCard({data, userId, quantity}: {data: Response, userId: string, quantity: Number}): Promise<UserCard | null> {
    try {
        let content = (await data.json()).card
        return {
            _id: content._id,
            name: content.name,
            image: content.image,
            type_line: content.type_line,
            oracle_text: content.oracle_text,
            color_identity: content.color_identity,
            keywords: content.keywords,
            tcgplayer: content.tcgplayer,
            userId,
            quantity
        }
    } catch (err) {
        return null
    }
}