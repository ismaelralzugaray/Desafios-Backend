import { Router } from "express";
import fs from "fs"
// import ProductManager from "../services/productManager.js";
import { productModel } from "../../dao/models/product.Model.js";




const router = Router()
const PRODUCTPATH = "./Files/Productos.json"

// const productManager = new ProductManager(PRODUCTPATH)





router.get("/", async (req, res) =>{

    //FILESYSTEM
    // try {
    //   const productsArray = productManager.getProducts()
    //   res.render("home", {productsArray})
    // } catch (error) {
    //   console.log(error)
    //   res.render("home", <h1>NO SE PUDIERON OBTENER LOS PRODUCTOS</h1>)
    // }

    //MONGODB
    try {
      let products = []
      products = await productModel.find().lean()
      res.render("home", {products})
    } catch (error) {
      console.log(error)
      res.render("home", "NO SE PUDIERON OBTENER LOS PRODUCTOS")
    }

})

router.get("/realtimeproducts", async (req, res) =>{

    //FILESYSTEM
  // try {
  //   const productsArray = productManager.getProducts()
  //   res.render("realTimeProducts", {productsArray})
  // } catch (error) {
  //   console.log(error)
  //   res.render("home", <h1>NO SE PUDIERON OBTENER LOS PRODUCTOS</h1>)
  // }


  //MONGODB
  try {
    let products = []
    products = await productModel.find().lean()
    res.render("realTimeProducts", {products} )
  } catch (error) {
    console.log(error)
    res.render("realTimeProducts", "NO SE PUDIERON OBTENER LOS PRODUCTOS")
  }

})

router.get("/chat", (req, res) => {
  res.render("chat")
})



export default router