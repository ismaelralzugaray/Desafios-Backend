class ProductManager {
  constructor() {
    this.productos = [];
  }

  getProducts() {
    return console.log(this.productos);
  }

  getProductsById(id) {
    for (const element of this.productos) {
      if (element.id == id) {
        return console.log(element);
      } else {
        return console.log("Error: Producto no encontrado");
      }
    }
  }

  addProducts(title, description, price, thumbnail, code, stock) {
    if (
      stock !== "" &&
      price !== "" &&
      title !== "" &&
      code !== "" &&
      description !== "" &&
      thumbnail !== ""
    ) {
      if (
        typeof title === "string" &&
        typeof description === "string" &&
        typeof price === "number" &&
        typeof thumbnail === "string" &&
        typeof code === "string" &&
        typeof stock === "number"
      ) {
        const producto = {
          title: title,
          description: description,
          price: price,
          thumbnail: thumbnail,
          code: code,
          stock: stock,
          id: this.productos.length + 1,
        };

        if (this.productos.filter((e) => e.code == producto.code) == 0) {
          this.productos.push(producto);
        } else {
          console.log("Error: El producto ya existe");
        }
      } else {
        console.log("Error: Datos mal ingresados");
      }
    } else {
      console.log("Error: Debe completar todos los campos");
    }
    return this.productos;
  }
}



//Testing

const productManager = new ProductManager()

// 1 - Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []:
// productManager.getProducts()


// 2 - Se llamará al método “addProduct” con los campos: title: “producto prueba” description:”Este es un producto prueba” price:200, thumbnail:”Sin imagen” code:”abc123”, stock:25:
// productManager.addProducts("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)


// 3 - Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado:
// productManager.getProducts();


// 4 - Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido:
// productManager.addProducts("Producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)

      //Todos los campos deben estar completos:
      // productManager.addProducts("", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)


// 5 - Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo:
// productManager.getProductsById(1)





