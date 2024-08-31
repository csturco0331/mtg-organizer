import {Schema, model, models} from 'mongoose'

const UserSchema = new Schema(
    {
        email: {type: 'string', required: true, unique: true},
        username: {type: 'string', required: true, unique: true},
        password: {type:'string', required: true},
        cards: {type: Array<CardLink> }
    },
    {
        timestamps: true
    }
)

export const User = models.User || model('User', UserSchema)

export type CardLink = {
    cardId: string;
    quantity: number;
    used?: number;
}

export type User = {
    _id: string,
    username: string,
    email: string,
    cards?: Array<CardLink>
} | undefined