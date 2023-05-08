import express from "express"
import * as productControllers from "../controllers/productsControllers.js"

const router = express.Router()

router.get("/", productControllers.getProducts)

router.get("/:pid", productControllers.getProductById)

router.post("/", productControllers.createProduct)

router.put("/:pid", productControllers.updateProduct)

router.delete("/:pid", productControllers.deleteProduct)

export default router
