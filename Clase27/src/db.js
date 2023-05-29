import mongoose from "mongoose";
import config from "./config/config.js";


const connectMongoDb =  () => {
    try {
         mongoose.connect(config.mongoUrl)
        console.log("Exito al conectar con MONGODB");
    } catch (error) {
        console.log("No se pudo conectar a MONGODB" + error);
        process.exit()
    }
}

export default connectMongoDb 