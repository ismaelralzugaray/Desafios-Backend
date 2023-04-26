import express from "express"
import * as productServices from "../services/productServices.js"
import * as cartServices from "../services/cartServices.js"
import { productModel } from "../models/productModels.js"


const router = express.Router()


router.get("/products", async (req,res) => {

    try {
        let {limit, page, sort, query} = req.query
        const products = await productServices.getProducts(limit, page, sort, query)
        products.prevLink = products.hasPrevPage?`http://localhost:9090/products?page=${products.prevPage}`:""
        products.nextLink = products.hasNextPage?`http://localhost:9090/products?page=${products.nextPage}`:""
        products.isValid= !(page <= 0 || page > products.totalPages)
        const {docs, ...props} = products
        
    
        res.render("products", {docs, ...props})
    } catch (error) {
        res.status(400).json(error.message)
    }

})




router.get("/carts/:cid", async (req,res) => {
try {
    
        let cid = req.params.cid
        let cart = await cartServices.getProductsInCart(cid)
        let productsInCart = cart.products
        console.log(cart);
    
        res.render("carts", {productsInCart} )
} catch (error) {
    res.status(400).json(error.message)
}
})




router.get("/realtimeproducts", async (req, res) =>{
    try {
        let products = []
        products = await productModel.find().lean()
        res.render("realTimeProducts", {products} )
    } catch (error) {
        res.status(400).json(error.message)
    }
    
})




router.get("/chat", (req, res) => {
    try {
        res.render("chat")
    } catch (error) {
        res.status(400).json(error.message)
    }
})

export default router