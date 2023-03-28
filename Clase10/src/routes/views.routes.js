import { Router } from "express";
import fs from "fs"
import ProductManager from "../services/productManager.js";




const router = Router()
const PRODUCTPATH = "./Files/Productos.json"
const pManager = new ProductManager(PRODUCTPATH)





router.get("/", (req, res) =>{
    const productsArray = pManager.getProducts()
    res.render("home", {productsArray})
})

router.get("/realtimeproducts", (req, res) =>{
  const productsArray = pManager.getProducts()
    res.render("realTimeProducts", {productsArray})
})


export default router