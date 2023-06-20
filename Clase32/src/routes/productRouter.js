import express from "express"
import * as productControllers from "../controllers/productController.js"
import { pidValidation, passportCall, checkRol, productDataValidation} from "../../utils.js"
import errorHandler from '../services/errors/middlewares/index.js';

const router = express.Router()

//OBTENEMOS TODOS LOS PRODUCTOS 
router.get("/",  productControllers.getProducts)

//OBTENEMOS UN PRODUCTO SEGUN EL ID
router.get("/:pid",  pidValidation, productControllers.getProductById)

//CREAMOS UN PRODUCTO
router.post("/", passportCall("jwt"), checkRol(["admin"]), productDataValidation, productControllers.createProduct)

//ACTUALIZAMOS UN PRODUCTO
router.put("/:pid", passportCall("jwt"), checkRol(["admin"]), pidValidation, productControllers.updateOne)

//ELIMINAMOS UN PRODUCTO
router.delete("/:pid", passportCall("jwt"), checkRol(["admin"]), pidValidation, productControllers.deleteOne)

router.use(errorHandler)

export default router
