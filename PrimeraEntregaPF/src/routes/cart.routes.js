import { Router } from "express";
import CartManager from "../services/cartManager.js";
import ProductManager from "../services/productManager.js";
import fs from "fs"

const CARTPATH = "./Files/Carts.json"
const PRODUCTPATH = "./Files/Productos.json"
const router = Router()

function pathValidation(path) {
    const pathExist = fs.existsSync(path);
  
    if (!pathExist) {
      fs.writeFileSync(path, "[]");
    }
  }
  
  // Validamos que exista el archivo
  
  pathValidation(CARTPATH)


// Instanciamos las clases

const productManager = new ProductManager(PRODUCTPATH)
const cartManager = new CartManager(CARTPATH)



//Creamos el carrito

router.post(`/`, (req, res) =>{
    cartManager.addCart()
    res.send({status:"Success", message:"¡Carrito creado con exito!"})
})


//Obtenemos productos del carrito segun el CID

router.get(`/:cid`, (req, res) =>{
    const cartId = parseInt(req.params.cid)
    let productos = cartManager.getCartProducts(cartId)
    res.send(productos)
})

//Agregamos un producto a un carrito

router.post(`/:cid/products/:pid`, (req, res) =>{
    const cartId = parseInt(req.params.cid)
    console.log(cartId)
    const productId = parseInt(req.params.pid)
    let producto = productManager.getProductById(productId)
    cartManager.addProductToCart(cartId, producto.id)
    res.send({status:"Success", message:"¡Producto añadido con exito!"})
})

export default router