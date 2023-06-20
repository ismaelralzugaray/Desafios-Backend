import mongoose from "mongoose"

const collectionName =  "messages"

const messagesSchema = new mongoose.Schema({

    user: {type: String,
          require: true},
    
    message: {type: String,
             require: true}
})

const messageModel = new mongoose.model(collectionName, messagesSchema)

export default messageModel