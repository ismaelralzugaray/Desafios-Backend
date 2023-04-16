import mongoose from "mongoose";

const collectionName = "products"


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

const productsSchema = new mongoose.Schema({
    title: stringTypeSchemaNoUniqueRequire,
    description: stringTypeSchemaNoUniqueRequire,
    price: numberTypeSchemaNoUniqueRequire,
    code: stringTypeSchemaUniqueRequire,
    stock: numberTypeSchemaNoUniqueRequire,
    category: stringTypeSchemaNoUniqueRequire,
    status: booleanTypeSchemaNoUniqueRequire
})

export const productModel = mongoose.model(collectionName, productsSchema)