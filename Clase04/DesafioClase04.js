 import fs from "fs"

const path = "./Productos.json";

function pathValidation(path) {
  const pathExist = fs.existsSync(path);

  if (!pathExist) {
    fs.writeFileSync(path, "[]");
  }
}

pathValidation(path)



class ProductManager {
  constructor(path) {
    this.path = path;

  }

  addProduct(nuevoProducto) {
    

    const producto = {
      ...nuevoProducto,
      id: Math.floor(Math.random() * 20 + 1),
    };

    const contenidoArchivo = fs.readFileSync(this.path, "utf-8");
    const contenidoParseado = JSON.parse(contenidoArchivo);
    const archivoFinal = [...contenidoParseado, producto];

    fs.writeFileSync(this.path, JSON.stringify(archivoFinal, null, 2));
  }

  getProducts() {

    const productosObtenidos = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    console.log(productosObtenidos);
  }

  getProductById(id) {
    const productosObtenidos = JSON.parse(fs.readFileSync(this.path, "utf-8"));

    for (const elemento of productosObtenidos) {
      if (elemento.id === id) {
        console.log(elemento);
      } else {
        console.log("Error: Producto no Encontrado");
      }
    }
  }

  updateProduct(id, productoActualizado) {
    const productosObtenidos = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    const nuevoArray = productosObtenidos.filter((e) => e.id !== id);
    const productoModificado = { ...productoActualizado, id: id };
    const arrayFinal = [...nuevoArray, productoModificado] 
    fs.writeFileSync(this.path, JSON.stringify(arrayFinal, null, 2));
  }

  deleteProduct(id) {
    const productosObtenidos = JSON.parse(fs.readFileSync(this.path, "utf-8"));

    let nuevoArray = [];
    if (productosObtenidos.find((e) => e.id == id)) {
      nuevoArray = productosObtenidos.filter((e) => e.id !== id);
      fs.writeFileSync(this.path, JSON.stringify(nuevoArray, null, 2));
    } else {
      console.log("Error: Id no encontrado");
    }
  }
}



//Testing

const productManager = new ProductManager(path);


// 1 - Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []:
// productManager.getProducts()


// 2 - Se llamará al método “addProduct” con los campos: title: “producto prueba”, description: ”Este es un producto prueba”, price:200, thumbnail: ”Sin imagen”, code:”abc123”, stock:25:
// productManager.addProduct({
//     title: "Producto prueba",
//     description: "Este es un producto prueba", 
//     price: 200,
//     thumbnail: "Sin imagen",
//     code: "abc123",
//     stock: 25
// })


// 3 - Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado:
// productManager.getProducts()


// 4 - Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error:

        //El ID existe:
        // productManager.getProductById()

        //El ID no existe:
        // productManager.getProductById(21)


// 5 - Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
// productManager.updateProduct(5, {
//     title: "Producto prueba actualizado",
//      description: "Este es un producto prueba actualizado", 
//      price: 300,
//      thumbnail: "Con imagen",
//      code: "abc123",
//      stock: 1
// })


// 6 - Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.

        //El ID no existe:
        // productManager.deleteProduct(21)

        //El ID existe:
        // productManager.deleteProduct()



