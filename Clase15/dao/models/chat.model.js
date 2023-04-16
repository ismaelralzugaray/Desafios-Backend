import mongoose, { trusted } from "mongoose";

const collectionName = "message"

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    }
})

export const chatModel = new mongoose.model(collectionName, messageSchema)