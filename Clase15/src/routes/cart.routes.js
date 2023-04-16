import { Router } from "express";
import fs from "fs"
// import CartManager from "../services/cartManager.js";
// import ProductManager from "../services/productManager.js";
import {cartModel} from "../../dao/models/cart.model.js"
import { productModel } from "../../dao/models/product.Model.js";


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

// const productManager = new ProductManager(PRODUCTPATH)
// const cartManager = new CartManager(CARTPATH)

//VALIDACION DEL CARRITO
const cidValidation = async (req, res, next) => {
  try {
    let cid = req.params.cid.trim()
    if(await cartModel.findOne({_id: cid})){
      next ()
    }else{
      throw new Error("Carrito no encontrado")
    }
  } catch (error) {
    res.status(500).send({Error: error, msg:"No se pudo encontrar el carrito"})
  }
}
//VALIDACION DEL PRODUCTO
const pidValidation = async (req, res, next) => {
  try {
    let pid = req.params.pid.trim()
    if(await productModel.findOne({_id: pid})){
      next ()
    }else{
      throw new Error("Producto no encontrado")
    }
  } catch (error) {
    res.status(500).send({Error: error, msg:"No se pudo encontrar el Producto"})
  }
}

//Creamos el carrito

router.post(`/`, async (req, res) =>{

    //FILESYSTEM
    // try {
    //   let result = await cartManager.addCart()
    //   res.send({status:"Success", message:"¡Carrito creado con exito!", payload: result})
    // } catch (error) {
    //   console.log(error)
    //   res.status(500).send({Error: error, msg:"No se pudo crear el carrito"})
    // }


    //MONGODB

    try {
      let result = await cartModel.create({products: []})
      res.send({Status: "Succes", msg: "Carrito creado con exito", payload: result})
    } catch (error) {
      console.log(error)
      res.status(500).send({Error: error, msg: "No se pudo crear el carrito"})
    }
    
})


//Obtenemos productos del carrito segun el CID

router.get(`/:cid`, async (req, res) =>{

  //FILESYSTEM
    // try {
    //   const cartId = parseInt(req.params.cid)
    //   let productos = await cartManager.getCartProducts(cartId)
    //   res.send(productos)
    // } catch (error) {
    //   console.log(error)
    //   res.status(500).send({Error: error, msg:"No se pudo encontrar el carrito"})
    // }
  

    //MONGODB
    try {
      let cart = await cartModel.find({_id: req.params.cid})
      res.send(cart)
    } catch (error) {
      console.log(error)
      res.status(500).send({Error: error, msg: "No se pudo encontrar el carrito"})
    }
})

//Agregamos un producto a un carrito

router.post(`/:cid/products/:pid`, cidValidation, pidValidation, async (req, res) =>{

    //FILESYSTEM
    // try {
    //   const cartId = parseInt(req.params.cid)
    //   const productId = parseInt(req.params.pid)
    //   let producto = await productManager.getProductById(productId)
    //   cartManager.addProductToCart(cartId, producto.id)
    //   res.send({status:"Success", message:"¡Producto añadido con exito!"})
    // } catch (error) {
    //   console.log(error)
    //   res.status(500).send({Error: error, msg: "No se pudo agregar el producto al carrito"})
    // }


    //MONGODB
    try {
      //OBTENEMOS LOS ID DEL CARRITO Y EL PRODUCTO
      let pid = req.params.pid.trim()
      let cid = req.params.cid.trim()
      //OBTENEMOS EL CARRITO Y EL PRODUCTO
      let cart = await cartModel.findOne({_id: cid})
      let product = await productModel.findOne({_id: pid})

      let productsInCart = cart.products
      let exist = productsInCart.findIndex((p) => p.product === pid)
      let obj = productsInCart[exist]

      if(exist >= 0){
        obj.quantity++
        productsInCart[exist] = obj
        let result = await cartModel.findByIdAndUpdate({_id: cid}, {products: productsInCart})
        res.status(201).send({Status: "Succes", msg: `Se ha agregado con exito el producto: ${product.title}`,})
      }
      else{
        let newObj = {
          product: pid,
          quantity: 1
        }
          let result = await cartModel.findByIdAndUpdate({_id: cid}, {$push:{"products":newObj}})
          res.status(201).send({Status: "Succes", msg: `Se ha agregado con exito el producto: ${product.title}`})
      }
      }
     catch (error) {
      console.log(error)
      res.status(500).send({Error: error, msg:"No se pudo añadir el producto al carrito"})
    }
})

export default router