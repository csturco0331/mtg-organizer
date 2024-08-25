import { Schema, model, models } from "mongoose";

const DeckSchema = new Schema(
    {
        name: {type: 'String', required: true, unique: true},
        color_identity: {type: Array<"W" | "B" | "R" | "U" | "G">, required: true},
        cards: {type: Array<CardLink>, required: true, ref: 'Card'},
        commander: {type: Schema.Types.ObjectId, required: true, ref: 'Card'},
        user: {type: Schema.Types.ObjectId, ref: 'User'}
    },
    {
        timestamps: true
    }
)

export const Deck = models.Deck || model('Deck', DeckSchema)

export type CardLink = {
    cardId: string;
    count: Number;
}