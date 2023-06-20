import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"


const collectionName = "products"


const productSchema = new mongoose.Schema({

    title: {type: String,
           require: true},

    description: {type: String,
                 require: true},

    price:  {type: Number,
            require: true},

    code:  {type: String,
           require: true,
           unique: true},
    
    stock: {type: Number,
           require: true},

    category: {type: String,
              require: true},
    
    status: {type: Boolean,
            require: true} 
})

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(collectionName, productSchema)

export default productModel