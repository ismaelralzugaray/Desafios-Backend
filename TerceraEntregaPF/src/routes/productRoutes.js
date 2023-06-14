import express from "express"
import * as productControllers from "../controllers/productsControllers.js"
import passport from "passport"

const router = express.Router()

router.get("/", productControllers.getProducts)

router.get("/:pid", productControllers.getProductById)

router.post("/",   productControllers.createProduct)

router.put("/:pid", productControllers.updateProduct)

router.delete("/:pid", productControllers.deleteProduct)

export default router
