import { Router } from "express";
import fs from "fs"
import ProductManager from "../services/productManager.js";


const router = Router()
const PRODUCTPATH = "./Files/Productos.json"



function pathValidation(path) {
    const pathExist = fs.existsSync(path);
  
    if (!pathExist) {
      fs.writeFileSync(path, "[]");
    }
  }

pathValidation(PRODUCTPATH)

const productManager = new ProductManager(PRODUCTPATH)

function readFile(){
    let productos = JSON.parse(fs.readFileSync(PRODUCTPATH, "utf-8"))
    return productos
}

function writeFile(obj){
    fs.writeFileSync(PRODUCTPATH, JSON.stringify(obj, null, 2))
}





//Product GET
router.get(`/`, (req, res) => {
    const {limite} = req.query
    let productos = productManager.getProducts()
    if(limite){
        const products = productos.splice(0, limite)
        res.send(products)
    }
    res.send(productos)
})


//Product GET PID
router.get(`/:pid`, (req, res) => {
    const productId = parseInt(req.params.pid)
    let productoEncontrado = productManager.getProductById(productId)
    if(productoEncontrado){
        res.send(productoEncontrado)
    }
    res.send({Error: "Producto no encontrado"})
})


//Product POST
router.post(`/`, (req, res) =>{
    let productos = productManager.getProducts()
    const product = req.body
    product.id = productos.length + 1
    


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

                    productManager.addProduct(product)
                res.send({status: "Succes", message:"¡Producto agregado con exito!"})
               }
               else{
                res.status(400).send({status:"Error", message:"Los datos ingresados no son correctos"})
               }}
               else{res.status(400).send({status: "Error", message:"Debe completar todos los campos"})

         }
        })


//Product PUT

router.put(`/:pid`, (req, res) => {
    let productos = readFile()
    const productoActualizado = req.body
    const productId = parseInt(req.params.pid)
    const productPosition = productos.findIndex( (p) => p.id === productId)
    if(productPosition < 0){
        res.status(400).send({status:"Error", message: "Producto no encontrado"})
    }
    productoActualizado.id = productos[productPosition].id
    productos[productPosition] = productoActualizado
    console.log(productos)
    writeFile(productos)
    res.send({status: "Succes", message:"¡Producto actualizado con exito!"})
})


//Product DELETE

router.delete(`/:pid`, (req, res) => {
    let productos = readFile()
    const productId = parseInt(req.params.pid)
    if(productos.includes((p) => p.id === productId)){
        res.status(400).send({status:"Error", message:"Producto no encontrado"})
    }else{
        productos = productos.filter( (p) => p.id !== productId)
        writeFile(productos)
        res.send({status: "Succes", message:"¡Producto elminado con exito!"})
    }
})

export default router

