import mongoose from "mongoose";

const collectionName = "cart"

const cartSchema = new mongoose.Schema({
    products: {
                type: Array,
                require: true}
})

export const cartModel = mongoose.model(collectionName, cartSchema)