import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

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

export const cartModel = mongoose.model(process.env.CARTCOLLNAME, cartSchema)