import mongoose from "mongoose";


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

const usersSchema = mongoose.Schema({

    firstName: stringTypeSchemaNoUniqueRequire,
    lastName: stringTypeSchemaNoUniqueRequire,
    email: stringTypeSchemaUniqueRequire,
    age: numberTypeSchemaNoUniqueRequire,
    password: stringTypeSchemaNoUniqueRequire,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
        },
    rol: {
        type: String,
        default: "user"
        },
    loggedBy: {
        type: String,
        default: "App"
    }
})

usersSchema.pre("findOne", function (){
    this.populate("cart")
})

const userModel = new mongoose.model(process.env.USERCOLLNAME, usersSchema)

export default userModel