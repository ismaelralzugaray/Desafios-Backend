import mongoose from "mongoose"

const collectionName = "users"

const usersSchema = new mongoose.Schema({

    firstName: {type: String,
               require: true},
    
    lastName: {type: String,
              require: true},
     
     fullName: {type: String,
               require: true},
    
    email: {type: String,
           require: true,
           unique: true},
    
    age: {type: Number,
         require: true},
    
    password: {type: String,
              require: true},
    
    cart: {type: mongoose.Schema.Types.ObjectId,
          ref: "carts",},
    
    rol: {type: String,
         default: "user"},
    
    loggedBy: {type: String,
              default: "app"}

})

usersSchema.pre("findOne", function (){
    this.populate("cart")
})

const userModel = new mongoose.model(collectionName, usersSchema)

export default userModel