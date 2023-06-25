import * as cartServices from "../services/mongoDB/cartServices.js";
import * as productServices from "../services/mongoDB/productsServices.js";
import * as ticketServices from "../services/mongoDB/ticketServices.js";

//CREAMOS EL CARRITO
export async function createCart(req, res) {
  try {
    let response = await cartServices.createCart();
    res
      .status(200)
      .send({
        status: "Succes",
        message: "Carrito creado con exito",
        payload: response,
      });
  } catch (error) {
    req.logger.error(error);
    res.status(400).json(error.message);
  }
}

//OBTENEMOS PRODUCTOS DEL CARRITO
export async function getCart(req, res) {
  try {
    let cid = req.params.cid;
    let response = await cartServices.getProductsInCart(cid);
    res.status(200).send({ status: "Succes", payload: response });
  } catch (error) {
    req.logger.error(error);
    res.status(200).json(error.message);
  }
}

//AGREGAMOS PRODUCTO AL CARRITO
export async function addProductToCart(req, res) {
  try {
    let cid = req.params.cid.trim();
    let pid = req.params.pid.trim();
    let response = await cartServices.addProductToCart(cid, pid);
    res.status(200).send({ status: "Succes", payload: response });
  } catch (error) {
    req.logger.error(error);
    res.status(200).json(error.message);
  }
}

//ACTUALIZAMOS CANTIDAD DE UN PRODUCTO EN EL CARRITO
export async function updateProductQuantity(req, res) {
  try {
    let cid = req.params.cid.trim();
    let pid = req.params.pid.trim();
    let quantity = req.body.quantity;
    let response = await cartServices.updateProductQuantity(cid, pid, quantity);
    res.status(200).send({ status: "Succes", payload: response });
  } catch (error) {
    req.logger.error(error);
    res.status(200).json(error.message);
  }
}

//ELIMINAMOS PRODUCTOS DEL CARRITO
export async function deleteProductInCart(req, res) {
  try {
    let cid = req.params.cid;
    let pid = req.params.pid;

    let response = await cartServices.deleteProductInCart(pid, cid);
    res.status(200).send({ status: "Succes", payload: response });
  } catch (error) {
    req.logger.error(error);
    res.status(200).json(error.message);
  }
}

//ELIMINAMOS TODOS LOS PRODUCTOS DEL CARRITO
export async function deleteAllProducts(req, res) {
  try {
    let cid = req.params.cid;
    let response = await cartServices.deleteAllProducts(cid);
    res.status(200).send({ status: "Succes", payload: response });
  } catch (error) {
    req.logger.error(error);
    res.status(200).json(error.message);
  }
}

//ACTUALIZAMOS MAS DE UN PRODUCTO EN EL CARRITO
export async function updateProductsInCart(req, res) {
  try {
    let cid = req.params.cid;
    let productArray = req.body;
    let response = await cartServices.updateProductsInCart(cid, productArray);
    res.status(200).send({ status: "Succes", payload: response });
  } catch (error) {
    req.logger.error(error);
    res.status(200).json(error.message);
  }
}

export async function finishPurchase(req, res) {
  try {
    let cid = req.params.cid;
    //OBTENEMOS LOS PRODUCTOS DEL CARRITO

    let cart = await cartServices.getProductsInCart(cid);
    let productsInCart = cart.products;

    //CREAMOS ARRAY PARA DIVIDIR LOS PRODUCTOS QUE SE PUEDEN COMPRAR Y LOS QUE NO
    let purchableProducts = [];
    let noPurchableProducts = [];

    //INICIALIZAMOS EL AMOUNT
    let total = 0;

    //DIVIDIMOS LOS PRODUCTOS EN LOS QUE SE PUEDEN COMPRAR Y LOS QUE NO Y LOS PUSHEAMOS EN LOS RESPECTIVOS ARRAYS
    for (let i of productsInCart) {
      //Si quantity es mayor a el stock, pusheamos el id del producto que no se puede comprar
      if (i.quantity >= i.product.stock) {
        noPurchableProducts.push(i.product._id.valueOf());
      } else {
        //si el quantity es menor al stock sumamos los precios, restamos la cantidad a comprar del stock y pusheamos el producto al array
        let price = i.product.price * i.quantity;
        total += price;
        i.product.stock -= i.quantity;
        purchableProducts.push(i);
      }
    }
    //MODIFICAMOS LOS STOCKS EN LA BASE DE DATOS
    for (let i of purchableProducts) {
      let updateStock = await productServices.updateProduct(
        i.product._id,
        i.product
      );
    }

    //ELIMINAMOS LOS PRODUCTOS DEL CARRITO
    for (let i of purchableProducts) {
      let cartAfterPurchase = await cartServices.deleteProductInCart(
        i.product._id.valueOf(),
        cid
      );
    }

    //CREAMOS EL TICKET
    let response = await ticketServices.createTicket(total, req.user.email);

    res
      .status(200)
      .send({
        status: "Succes",
        message: `Compra realizada con exito, los siguientes productos no pudieron ser comprados por falta de stock: ${noPurchableProducts}`,
      });
  } catch (error) {
    req.logger.error(error);
    res.status(200).json(error.message);
  }
}
