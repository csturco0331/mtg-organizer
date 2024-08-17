import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI environment variable')
}

const MONGODB_URI = process.env.MONGODB_URI

const connect = async () => {
    const connectionState = mongoose.connection.readyState

    if (connectionState === 1) {
        console.log('Already connected')
        return
    }

    if (connectionState === 2) {
        console.log('Connecting')
        return
    }

    try {
        mongoose.connect(MONGODB_URI!, {
            dbName: 'mtg_organizer',
            bufferCommands: true
        })
        console.log('Connected')
    } catch (err: any) {
        console.log(`Error: ${err}`)
        throw new Error(`Error: `, err)
    }
}

export default connect