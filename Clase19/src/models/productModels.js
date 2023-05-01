import mongoose, { Schema } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import dotenv from "dotenv"

dotenv.config()

const stringTypeSchemaNoUniqueRequire = {
    type: String,
    require: true,

}


const numberTypeSchemaNoUniqueRequire = {
    type: Number,
    require: true
}


const stringTypeSchemaUniqueRequire = {
    type: String,
    require: true,
    unique: true
}

const booleanTypeSchemaNoUniqueRequire= {
    type: Boolean,
    require: true
}

const productSchema = new mongoose.Schema(
    {
        title: stringTypeSchemaNoUniqueRequire,

        description: stringTypeSchemaNoUniqueRequire,

        price: numberTypeSchemaNoUniqueRequire,

        code: stringTypeSchemaUniqueRequire,

        stock: numberTypeSchemaNoUniqueRequire,

        category: stringTypeSchemaNoUniqueRequire,

        status: booleanTypeSchemaNoUniqueRequire
    },
 
)

productSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(process.env.productCollName, productSchema)