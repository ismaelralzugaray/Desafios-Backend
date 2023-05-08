import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const connectMongoDb =  () => {
    try {
         mongoose.connect(process.env.DB)
        console.log("Exito al conectar con MONGODB");
    } catch (error) {
        console.log("No se pudo conectar a MONGODB" + error);
        process.exit()
    }
}

export default connectMongoDb 