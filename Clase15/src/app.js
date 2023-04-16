import express from "express"
import __dirname from "../utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import mongoose from "mongoose"
import viewRouter from "./routes/views.routes.js"
import productsRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"
// import ProductManager from "../dao/fs/productManager.js"
import { productModel } from "../dao/models/product.Model.js"
import { chatModel } from "../dao/models/chat.model.js"


const PRODUCTPATH = "./Files/Productos.json"
// const productManager = new ProductManager(PRODUCTPATH)


//Iniciamos Express Server
const app = express()
const PORT = 9090
const httpServer = app.listen(PORT, () =>{
    console.log(`Servidor levantado en puerto: ${PORT}`);
})

//Middlewears Express
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Setteamos HandleBars
app.engine(`handlebars`, handlebars.engine())
app.set(`views`, __dirname + "/src/views")
app.set(`view engine`, `handlebars`)

//Archivos Estaticos
app.use(express.static(__dirname + "/src/public"))

//Routes
app.use(`/api/products`, productsRoutes)
app.use(`/api/carts`, cartRoutes)
app.use("/", viewRouter)



//Iniciamos Socket Server
const socketServer = new Server(httpServer)

socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado");


    socket.on("producto", async data =>{
        //FILESYSTEM
        // console.log(data)
        // let productsArray = productManager.getProducts()
        // let product = data
        // product.id = productsArray.length +1
        // pManager.addProduct(product)

        //MONGODB
        
        let result = await productModel.create(data)
        
    })

    socket.on("id", async data => {
        //FILESYSTEM
        // console.log(data)
        // productManager.deleteProduct(data)

        //MONGODB
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

//Coneccion a la DB
const DB = "mongodb+srv://admin:admin@cluster0.ukkx3x4.mongodb.net/E-Commerce?retryWrites=true&w=majority"

const connectMongoDb = async () => {
    try {
        await mongoose.connect(DB)
        console.log("Coneccion a MongoDB realizada con exito")
    } catch (error) {
        console.log("No se pudo conectar a la base de datos" + error)
        process.exit()
    }
}

connectMongoDb()