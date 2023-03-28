import express from "express"
import __dirname from "../utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import viewRouter from "./routes/views.routes.js"
import ProductManager from "./services/productManager.js"
import productsRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"


const PRODUCTPATH = "./Files/Productos.json"
const pManager = new ProductManager(PRODUCTPATH)


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


    socket.on("producto", data =>{
        console.log(data)
        let productsArray = pManager.getProducts()
        let product = data
        product.id = productsArray.length +1
        pManager.addProduct(product)
        
    })

    socket.on("id", data => {
        console.log(data)
        pManager.deleteProduct(data)
    })

} )

