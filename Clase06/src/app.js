import express from "express"
import ProductManager from "./productManager.js"



const path = "./Productos.json";
const productManager = new ProductManager(path)

//Creamos los 10 productos
for (let i = 0; i < 10; i++){
    productManager.addProduct({
            title: "productoPrueba",
            description: "Este es un producto Prueba",
            price: 200,
            thumbnail: "Sin imagen",
            code: `${Math.floor(Math.random() * 20 +1)}`,
            stock: 25
    })
}

 




const app = express()
const PORT = 8080
app.use(express.urlencoded({extended: true}))




//Endpoint /products + query
app.get("/products/", (req, res) => {
    const misProductos = productManager.getProducts()
    const {limite} = req.query
    if(limite){
        const nuevoArray = misProductos.splice(0, limite)
        res.send(nuevoArray)
    }else{
        res.send(misProductos)
    }
})


//Endpoint /products/:pid
app.get("/products/:pid", (req, res) => {
    const productId = parseInt(req.params.pid)
    const productoEncontrado = productManager.getProductById(productId)
    if(productoEncontrado){
        res.send(productoEncontrado)
    }else{
        res.send({mensaje: "id no encontrado"})
    }
})


app.listen(PORT, () => console.log(`Servidor levantado en puerto: ${PORT}`))
