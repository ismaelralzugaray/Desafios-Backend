import express from "express";
import * as cartController from "../controllers/cartController.js"



const router = express.Router()


router.post("/", cartController.createCart)

router.get("/:cid", cartController.cidValidation, cartController.getProductsInCart)

router.post("/:cid/products/:pid",  cartController.cidValidation, cartController.pidValidation, cartController.addProductToCart)

router.put("/:cid", cartController.updateProductsInCart)

router.put("/:cid/products/:pid", cartController.updateProductQuantity)

router.delete("/:cid/products/:pid", cartController.deleteProductInCart)

router.delete("/:cid", cartController.deleteAllProducts)

export default router