import { Schema, model, models } from "mongoose";

const CardSchema = new Schema(
    {
        scryfallId: {type: 'string', required: true},
        // colors: {type: 'string'},
        quantity: {type: Number, required: true},
        decks: {type: ['string']},
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
    },
    {
        timestamps: true
    }
)

const Card = models.Card || model('Card', CardSchema)

export default Card