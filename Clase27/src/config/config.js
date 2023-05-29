import dotenv from "dotenv"

dotenv.config()

export default {
    port: process.env.PORT,
    mongoUrl: process.env.DB,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    productCollection: process.env.PRODUCTCOLLNAME,
    cartCollection: process.env.CARTCOLLNAME,
    userCollection: process.env.USERCOLLNAME,
    chatCollection: process.env.CHATCOLLNAME,
    privateKey: process.env.PRIVATE_KEY
}