import express from "express"
import connectMongoDb from "./db.js"
import dotenv from "dotenv"
import __dirname from "../utils.js"
import handlebars from "express-handlebars"
import {Server} from "socket.io"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import viewsRoutes from "./routes/viewsRoutes.js"
import {chatModel} from "./models/chatModel.js"
import { productModel } from "./models/productModels.js";


dotenv.config()


//Express Server
const app = express()
const httpServer = app.listen(process.env.PORT, () =>{
    console.log(`Servidor corriendo en puerto : ${process.env.PORT}`);
})

//Middlewears
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//Handlebars Setting
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/src/views")
app.set("view engine", "handlebars")

//Static Files
app.use(express.static(__dirname + "/src/public"))

//Routes
app.use("/api/products", productRoutes)
app.use("/api/carts", cartRoutes)
app.use("/", viewsRoutes)

//Socket Server

//Iniciamos Socket Server
const socketServer = new Server(httpServer)

socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado");


    socket.on("producto", async data =>{
        let result = await productModel.create(data)
    })

    socket.on("id", async data => {
        let result = await productModel.deleteOne({_id: data})
    })



    socket.on("mensaje", async data => {
        let result = await chatModel.create(data)
        let mensajes = await chatModel.find()

        socketServer.emit("historialDeMensajes", mensajes )
    })

    socket.on("usuarioConectado", data => {
        socket.broadcast.emit("usuarioConectado", data.user)
    })

} )



connectMongoDb()


