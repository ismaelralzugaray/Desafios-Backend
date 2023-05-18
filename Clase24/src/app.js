
import express from "express"
import handlebars from "express-handlebars"
import session from "express-session"
import connectMongoDb from "./db.js"
import MongoStore from "connect-mongo"
import {Server} from "socket.io"
import dotenv from "dotenv"
import __dirname from "../utils.js"
import productRoutes from "./routes/productRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import viewsRoutes from "./routes/viewsRoutes.js"
import usersViewsRoutes from "./routes/usersViewsRoutes.js"
import sessionsRoutes from "./routes/sessionsRoutes.js"
import githubViewsRoutes from "./routes/githubViewsRoutes.js"
import {chatModel} from "./models/chatModel.js"
import { productModel } from "./models/productModels.js";
import passport from "passport"
import initializePassport from "./config/passportConfig.js"
import cookieParser from "cookie-parser"
import jwtRoutes from "../src/routes/jwtRoutes.js"


dotenv.config()


//Express Server
const app = express()
const httpServer = app.listen(process.env.PORT, () =>{
    console.log(`Servidor corriendo en puerto : ${process.env.PORT}`);
})

//Persistimos sessions en MONGODB
// app.use(session({

//     store: MongoStore.create(

//         {   mongoUrl: process.env.DB,
//             mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
//             ttl: 300
//         }
//     ),
//     secret:"kretz",
//     resave: true,
//     saveUninitialized: true
// }))

app.use(cookieParser("eKretzCommerce"))

//Passport Middlewares
initializePassport()
app.use(passport.initialize())
// app.use(passport.session())

//JSON Settings
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//Handlebars Settings
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/src/views")
app.set("view engine", "handlebars")

//Static Files
app.use(express.static(__dirname + "/src/public"))

//Routes
app.use("/api/products", productRoutes)
app.use("/api/carts", cartRoutes)
app.use("/", viewsRoutes)
app.use("/users", usersViewsRoutes)
app.use("/api/sessions", sessionsRoutes)
app.use("/github", githubViewsRoutes)
app.use("/api/jwt", jwtRoutes)





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


