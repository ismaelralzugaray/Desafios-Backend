import fs from "fs"


class Cart {
    constructor(){
        this.id = Date.now()
        this.products = []
    }
}


class CartManager{
    constructor(path){
        this.path = path
        this.cartsArray = JSON.parse(fs.readFileSync(this.path, "utf-8"))
    }

addCart(){
    this.cartsArray.push(new Cart())
    fs.writeFileSync(this.path, JSON.stringify(this.cartsArray, null, 2))
}

addProductToCart(cartId, prId){
    let id = prId
    let carrito = this.cartsArray.find((c) => c.id === cartId)
    if(!carrito){
        return console.log("Error: Cart no encontrado")
    }

    const prodIndex = carrito.products.findIndex((p) => p.id === prId )
    if (prodIndex < 0){
        let producto = {"id": id, "quantity":1}
        carrito.products.push(producto)
    }else{
        carrito.products[prodIndex].quantity++
    }
    this.cartsArray.push[carrito]
    fs.writeFileSync(this.path, JSON.stringify(this.cartsArray, null, 2))
    
}


getCartProducts(id){
   let carrito = this.cartsArray.find((c) => c.id === id)
   console.log(carrito)
   if(!carrito){
    return console.log("Carrito no encontrado")
   }
   let productos = carrito.products
   return productos
}


}

export default CartManager