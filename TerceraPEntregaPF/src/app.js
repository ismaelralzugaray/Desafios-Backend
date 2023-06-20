//DEPENDENCIES IMPORTS
import cookieParser from "cookie-parser";
import express from "express"
import passport from "passport"
import handlebars from "express-handlebars"
import {Server} from "socket.io"
import initializePassport from "./config/passportConfig.js"

//ROUTES IMPORTS
import productRoutes from "./routes/productRouter.js"
import cartRoutes from "./routes/cartRouter.js"
import userRoutes from "./routes/userRouter.js"
import viewsRoutes from "./routes/viewsRouter.js"

//CONST IMPORTS
import { __dirname } from "../utils.js";
import config from "./config/config.js"

//MODELS
import productModel from "./services/mongoDB/models/productsModel.js"
import messageModel from "./services/mongoDB/models/messagesModel.js"

//MONGO SINGLETON
import MongoSingleton from './config/mongoSingleton.js';



//EXPRESS SERVER INIT
const app = express()
const httpServer = app.listen(config.port, () =>{
    console.log(`Servidor corriendo en puerto: ${config.port} `);
})

//COOKIEPARSER MIDDLEWARES
app.use(cookieParser("eKretzCommerce"))

//PASSPORT MIDDLEWARES
initializePassport()
app.use(passport.initialize())
// app.use(passport.session())

//JSON SETTINGS
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//HANDLEBARS SETTINGS
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/src/views")
app.set("view engine", "handlebars")

//STATIC FILES
app.use(express.static(__dirname + "/src/public"))

//ROUTES
app.use("/api/products", productRoutes)
app.use("/api/carts", cartRoutes)
app.use("/api/users", userRoutes)
app.use("/api/views", viewsRoutes)


//SOCKET SERVER INIT
const socketServer = new Server(httpServer)

socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado");

    //CREA PRODUCTO
    socket.on("product", async data => {
        let result = await productModel.create(data)
    })

    //BORRA PRODUCTO
    socket.on("id", async data => {
        let result = await productModel.deletOne({_id: data})

    })

    //CREA MENSAJE Y ENVIA HISTORIAL DE MENSAJE
    socket.on("message", async data => {
        let result = await messageModel.create(data)
        let messages = await messageModel.find()
        socketServer.emit("messagesRecord", messages)
    })

    //ENVIA USUARIO QUE ENTRO
    socket.on("usersConnected", async data => {
        socket.broadcast.emit("usersConnected", data.user)
    })


})

const mongoInstance = async () => {
    try {
        await MongoSingleton.getInstance();
    } catch (error) {
        console.error(error);
    }
};
mongoInstance();
