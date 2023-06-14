import * as productServices from "../services/MongoDB/productServices.js"



export async function getProducts (req, res){
    try {
        let {limit, page, sort, query} = req.query
        const response = await productServices.getProducts(limit, page, sort, query)
        res.status(200).json(response)

    } catch (error) {
        res.status(400).json(error.message)
    }
}




export async function getProductById (req, res){
    try {
        const id = req.params.pid
        const response = await productServices.getProductById(id)
        console.log(response);
        res.status(200).render("oneProduct", {response})
    } catch (error) {
        res.status(400).json(error.message)
    }
}




export async function createProduct (req, res){
    try {
        const {body} = req
        const response = await productServices.createProduct(body)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json(error.message)
    }

}




export async function updateProduct (req, res){
    try {
        let id = req.params.pid
        let body = req.body
        const response = await productServices.updateProduct(id, body)
        res.status(200).send({status: "Success", message: "Producto actualizado con exito", payload: response})
    } catch (error) {
        res.status(400).json(error.message)
    }
}




export async function deleteProduct (req, res){
   try {
     let id = req.params.pid
     let response = await productServices.deleteProduct(id)
     res.status(200).send({status: "Success", message:"Producto eliminado con exito", payload: response})
   } catch (error) {
    res.status(400).json(error.message)
  }
}