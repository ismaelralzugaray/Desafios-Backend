import mongoose from "mongoose";
import config from "../../../config/config.js"



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

export const chatModel = new mongoose.model(config.chatCollection, messageSchema)