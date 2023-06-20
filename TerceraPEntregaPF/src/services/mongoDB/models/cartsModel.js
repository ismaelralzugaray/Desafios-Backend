import mongoose from "mongoose"

const collectionName = "carts"

const cartSchema = new mongoose.Schema({

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
            default: []
         }
})

cartSchema.pre("findOne", function (){
    this.populate("products.product")
})

const cartModel = mongoose.model(collectionName, cartSchema)

export default cartModel