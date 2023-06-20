export  const generateProductErrorInfo = (product) => {
    return `Los datos enviados estan incompletos o no son validos.
    Los datos requeridos son los siguientes:
    Title: type String, recibido: ${product.title}
    Category: type String, recibido: ${product.category}
    Stock: type Number, recibido: ${product.stock}
    Price: type Number, recibido: ${product.price}
    Description type String, recibido: ${product.description}
    Code: type String, recibido: ${product.code}
    Status: type Boolean, recibido: ${product.status}`
}