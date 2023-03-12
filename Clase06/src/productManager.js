import fs from "fs"

function pathValidation(path) {
  const pathExist = fs.existsSync(path);

  if (!pathExist) {
    fs.writeFileSync(path, "[]");
  }
}




class ProductManager {
  constructor(path) {
    this.path = path;

  }

  addProduct(nuevoProducto) {
    
    pathValidation(this.path)

    const producto = {
      ...nuevoProducto,
      id: Math.floor(Math.random() * 100 + 1),
    };

    const contenidoArchivo = fs.readFileSync(this.path, "utf-8");
    const contenidoParseado = JSON.parse(contenidoArchivo);
    const archivoFinal = [...contenidoParseado, producto];

    fs.writeFileSync(this.path, JSON.stringify(archivoFinal, null, 2));
  }

  getProducts() {

    pathValidation(this.path)
    const productosObtenidos = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    return productosObtenidos;
  }

  getProductById(id) {
    const productosObtenidos = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    const productoEncontrado = productosObtenidos.find(p => p.id === id)

      if (productoEncontrado) {
        return productoEncontrado;
      } else {
        return console.log("Error: Producto no Encontrado");
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

export default ProductManager