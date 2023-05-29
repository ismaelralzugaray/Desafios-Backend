import mongoose from "mongoose"
import config from "../config/config.js"


const cartSchema = new mongoose.Schema(
    {
        products: {
            type: [
                    {
                        product: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "products"
                                },
                        quantity:{
                                type: Number,
                                require: true
                        }
                    }
                  ],
            default: [],
        }
    },
)

cartSchema.pre("findOne", function (){
    this.populate("products.product")
})

export const cartModel = mongoose.model(config.cartCollection, cartSchema)