import { productModel } from "./models/productModels.js";

//GET PRODUCTS (CON LIMITE, PAGE, SORT Y QUERY)
export async function getProducts(limit, page, sort, query) {
  try {

    let queryObj = query ? JSON.parse(query) : {};  
    let limite = limit ? limit : 10
    let pagina = page? page : 1
    let orden = sort ? { price: sort } : {};

    let products = await productModel.paginate(queryObj, {limit: limite, page: pagina, sort: orden, lean: true})

    return products;

  } catch (error) {
    throw new Error(error);
  }
}

//GET PRODUCT CON ID
export async function getProductById(id) {
  try {
    let product = await productModel.find({ _id: id }).lean();
    return product;
  } catch (error) {
    throw new Error(error);
  }
}

//CREAR PRODUCT NUEVO
export async function createProduct(data) {
  try {
    const product = await productModel.create(data);
    return product;
  } catch (error) {
    throw new Error(error);
  }
}

//ACTUALIZAR PRODUCT
export async function updateProduct(id, body) {
  try {
    let product = await productModel.updateOne({ _id: id }, body);
    return product;
  } catch (error) {
    throw new Error(error);
  }
}

//ELIMINAR PRODUCT

export async function deleteProduct(id) {
  try {
    let result = await productModel.deleteOne({ _id: id });
    return result;
  } catch (error) {
    throw new Error(error);
  }
}
