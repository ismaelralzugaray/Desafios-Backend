import express from "express"
import productsRoutes from "./src/routes/product.routes.js"
import cartRoutes from "./src/routes/cart.routes.js"

const app = express()
const PORT = 9090


app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use(`/api/products`, productsRoutes)
app.use(`/api/carts`, cartRoutes)


app.listen(PORT,() => {
    console.log(`Servidor levantado en el puerto: ${PORT}`);
})