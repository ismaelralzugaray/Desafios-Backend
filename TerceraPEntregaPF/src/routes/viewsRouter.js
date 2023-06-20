import express from "express"
import {passportCall, checkRol} from "../../utils.js"
import * as productServices from "../services/mongoDB/productsServices.js"
import * as cartServices from "../services/mongoDB/cartServices.js"
import productModel from "../services/mongoDB/models/productsModel.js"
import userDTO from "../services/dto/userDTO.js"


const router = express.Router()


//RENDERIZA LOS PRODUCTOS SEGUN QUERY
router.get("/products", passportCall("jwt"), async (req,res) => {

    try {
        let {limit, page, sort, query} = req.query
        const products = await productServices.getAll(limit, page, sort, query)
        products.prevLink = products.hasPrevPage?`http://localhost:9090/api/views/products?page=${products.prevPage}`:""
        products.nextLink = products.hasNextPage?`http://localhost:9090/api/views/products?page=${products.nextPage}`:""
        products.isValid= !(page <= 0 || page > products.totalPages)
        const {docs, ...props} = products
        
    
        res.render("productList", {docs, ...props})
    } catch (error) {
        res.status(400).json(error.message)
    }
})


//RENDERIZA UN CARRITO SEGUN EL ID
router.get("/carts/:cid", passportCall("jwt"), async (req,res) => {
    try {
        
            let cid = req.params.cid
            let cart = await cartServices.getProductsInCart(cid)
            let productsInCart = cart.products
            console.log(cart);
        
            res.render("cartList", {productsInCart} )
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//RENDERIZA TODOS LOS PRODUCTOS (AGREGA Y ELIMINA PRODUCTOS EN TIEMPO REAL)
router.get("/realtimeproducts", passportCall("jwt"),checkRol(["admin"]), async (req, res) =>{
    try {
        let products = []
        products = await productModel.find().lean()
        res.render("realTimeProducts", {products} )
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//RENDERIZA EL CHAT
router.get("/chat", passportCall("jwt"), checkRol(["user"]), (req, res) => {
    try {
        res.render("chat")
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//RENDERIZA LA VISTA PARA EL LOGIN
router.get("/login", (req, res) => {
    try {
        res.render("login")
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//RENDERIZA LA VISTA PARA EL REGISTRO
router.get("/register",(req, res) => {
    try {
        res.render("register")
    } catch (error) {
        res.status(400).json(error.message)
    }
})

//RENDERIZA LOS DATOS DEL USUARIO AL INGRESAR
router.get("/current", passportCall("jwt"), (req, res) => {
    try {
        let user = new userDTO(req.user)
        res.render("current",{user: user})
    } catch (error) {
        res.status(400).json(error.message)
    }
})

export default router



    
