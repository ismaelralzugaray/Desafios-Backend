import * as cartServices from "../services/cartServices.js"
import { cartModel } from "../models/cartModels.js";
import { productModel } from "../models/productModels.js";

export const cidValidation = async (req, res, next) => {
    try {
      let cid = req.params.cid.trim()
      if(await cartModel.findOne({_id: cid})){
        next ()
      }else{
        throw new Error("Carrito no encontrado")
      }
    } catch (error) {
      res.status(500).send({Error: error, msg:"No se pudo encontrar el carrito"})
    }
  }

export const pidValidation = async (req, res, next) => {
    try {
      let pid = req.params.pid.trim()
      if(await productModel.findOne({_id: pid})){
        next ()
      }else{
        throw new Error("Producto no encontrado")
      }
    } catch (error) {
      res.status(500).send({Error: error, msg:"No se pudo encontrar el Producto"})
    }
  }


export async function createCart (req, res){
    try {
        let response = await cartServices.createCart()
        res.status(200).send({status: "Succes", message: "Carrito creado con exito", payload: response})
    } catch (error) {
        res.status(400).json(error.message)
    }
}

export async function getProductsInCart (req, res){
    try {
        let cid = req.params.cid
        let response = await cartServices.getProductsInCart(cid)
        res.status(200).send({status: "Succes", payload: response})
    } catch (error) {
        res.status(200).json(error.message)
    }
}

export async function addProductToCart (req, res){
    try {
        let cid = req.params.cid.trim()
        let pid = req.params.pid.trim()
        let response = await cartServices.addProductToCart(cid, pid)
        res.status(200).send({status: "Succes", payload: response})
    } catch (error) {
        res.status(200).json(error.message)
    }
}

export async function updateProductQuantity (req,res){
   try {
     let cid = req.params.cid.trim()
     let pid = req.params.pid.trim()
     let quantity = req.body.quantity
     let response = await cartServices.updateProductQuantity(cid, pid, quantity)
     res.status(200).send({status: "Succes", payload: response})
   } catch (error) {
    res.status(200).json(error.message)
   }
}

export async function deleteProductInCart (req, res){
   try {
     let cid = req.params.cid
     let pid = req.params.pid
 
     let response = await cartServices.deleteProductInCart(pid, cid)
     res.status(200).send({status: "Succes", payload: response})
   } catch (error) {
    res.status(200).json(error.message)
   }
}

export async function deleteAllProducts (req,res){
   try {
     let cid = req.params.cid
     let response = await cartServices.deleteAllProducts(cid)
     res.status(200).send({status: "Succes", payload: response})
   } catch (error) {
    res.status(200).json(error.message)
   }
}

export async function updateProductsInCart (req, res){
    try {
        let cid = req.params.cid
        let productArray = req.body
        let response = await cartServices.updateProductsInCart(cid, productArray)
        res.status(200).send({status: "Succes", payload: response})
    } catch (error) {
        res.status(200).json(error.message)
    }
}