import { Schema, model, models } from "mongoose";

const DeckSchema = new Schema(
    {
        name: {type: 'String', required: true, unique: true},
        colors: {type: 'String', required: true},
        cards: {type: [Schema.Types.ObjectId], required: true, ref: 'Card'},
        commander: {type: Schema.Types.ObjectId, required: true, ref: 'Card'},
        user: {type: Schema.Types.ObjectId, ref: 'User'}
    },
    {
        timestamps: true
    }
)

const Deck = models.Deck || model('Deck', DeckSchema)

export default Deck