import { Router } from "express";
import fs from "fs"
// import ProductManager from "../services/productManager.js"; 

import { productModel } from "../../dao/models/product.Model.js";


const router = Router()

const PRODUCTPATH = "./Files/Productos.json"

function pathValidation(path) {
    const pathExist = fs.existsSync(path);
  
    if (!pathExist) {
      fs.writeFileSync(path, "[]");
    }
  }

pathValidation(PRODUCTPATH)

// const productManager = new ProductManager(PRODUCTPATH)


//Middleware producto
const productValidaton = (req, res, next) =>{

    const product = req.body
    if  (product.title &&
        product.description &&
        product.code &&
        product.price &&
        product.status &&
        product.stock &&
        product.category){

           if (typeof product.title === "string" &&
               typeof product.description === "string" &&
               typeof product.code === "string" &&
               typeof product.price === "number" &&
               typeof product.status === "boolean" &&
               typeof product.stock === "number" &&
               typeof product.category === "string"){

                next()
              }
              else{
               res.status(400).send({status:"Error", message:"Los datos ingresados no son correctos"})
              }}
              else{res.status(400).send({status: "Error", message:"Debe completar todos los campos"})}
       }





//Product GET
router.get(`/`, async (req, res) => {

    // FILESYSTEM
    // try {
    //     const {limite} = req.query
    //     let productos = await productManager.getProducts()
    //     if(limite){
    //         const products = productos.splice(0, limite)
    //         res.send(products)
    //     }
    //     res.send(productos)
    // } catch (error) {
    //    console.log(error)
    //     res.status(500).send({Error: error, msg: "No se pudieron obtener los productos"})
    // }


    //MONGODB
    try {
        const {limite} = req.query
        let products = await productModel.find()
        if(limite){
            let limitedProducts = products.splice(0, limite)
            res.send(limitedProducts)
        }else{
            res.send(products)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({Error: error, msg: "No se pudieron obtener los productos"})
    }
   
})


//Product GET PID
router.get(`/:pid`, async (req, res) => {

    //FILESYSTEM
    // try {
    //     const productId = parseInt(req.params.pid)
    //     let productoEncontrado = await productManager.getProductById(productId)
    //     if(productoEncontrado){
    //     res.send(productoEncontrado)
    // }
    // } catch (error) {
    //     console.log(error)
    //     res.status(500).send({Error: error, msg:"No se pudo obtener el producto"})
    // }

    //MONGODB
    try {
        let product = await productModel.find({_id: req.params.pid})
        res.send(product)
    } catch (error) {
        console.log(error)
        res.status(500).send({Error: error, msg:"No se pudo obtener el producto"})
    }
    
})


//Product POST
router.post(`/`, productValidaton , async (req, res) =>{
    //FILESYSTEM
//     try {
//         const product = req.body
//         product.id = productos.length + 1
//         productManager.addProduct(product)
        //  res.send({status: succes, msg: `Se ha añadido con exito el producto: ${product.title}`})
        
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({Error: error, msg:"No se pudo añadir el producto"})
//     }
// }

    //MONGODB
    try {
        const product = req.body
        let result = await productModel.create(product)
        res.send({status: "Succes", msg:`Se ha añadido con exito el producto: ${product.title}`, payload: result})
    } catch (error) {
        console.log(error)
        res.status(500).send({Error: error, msg:"No se pudo añadir el producto"})
    }
})

    


//Product PUT

router.put(`/:pid`, productValidaton , async (req, res) => {
    //FILESYSTEM
    // try {
    //     let products = await productManager.getProducts()
    //     const productoActualizado = req.body
    //     const productId = parseInt(req.params.pid)
    //     const productPosition = productos.findIndex( (p) => p.id === productId)
    //     if(productPosition < 0){
    //         res.status(400).send({Error:"Error", msg: "Producto no encontrado"})
    //     }
    //     productoActualizado.id = products[productPosition].id
    //     productManager.updateProduct(productId, productoActualizado)
    //     res.send({status: "Succes", msg:"¡Producto actualizado con exito!"})
    // } catch (error) {
    //     console.log(error)
    //     res.status(500).send({Error: error, msg:"El producto no pudo ser actualizado"})
    // }


    //MONGODB
    try {
        let productToReplace = req.body
        let result = await productModel.updateOne({_id: req.params.pid}, productToReplace)
        res.send({Status: "Succes", msg:`Se ha actualizado con exito el producto: ${productToReplace.title}` , payload: result})
    } catch (error) {
        console.log(error)
        res.status(500).send({Error: error, msg: "No se ha podido actualizar el producto"})
    }

})


//Product DELETE

router.delete(`/:pid`, async (req, res) => {

    //FILESYSTEM
    // try {
    //     let productos = await productManager.getProducts()
    //     const productId = parseInt(req.params.pid)
    //     if(productos.includes((p) => p.id === productId)){
    //         res.status(400).send({status:"Error", message:"Producto no encontrado"})
    //     }else{
    //         productManager.deleteProduct(productId)
    //         res.send({status: "Succes", message:"¡Producto elminado con exito!"})}

    // } catch (error) {
    //     console.log(error)
    //     res.status(500).send({Error: error, msg:"El producto no pudo ser eliminado"})
    // }


    //MONGODB
    try {
        let result = await productModel.deleteOne({_id: req.params.pid})
        res.send({Status: "Succes", msg:"Se ha eliminado el producto con exito", payload:result})
    } catch (error) {
        console.log(error)
        res.status(500).send({Error: error, msg: "No se ha podido eliminar el producto"})
    }
})

export default router

