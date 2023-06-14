import dotenv from "dotenv"

dotenv.config()


import {Command} from "commander"

const program = new Command()

program
    .option("-d", "Variable para debug" ,false)
    .option("-p <port>", "puerto del server", 9090)
    .option("--persist <mode>", "Modo de persistencia", "mongodb")
    .option("-mode <mode>", "modo de trabajo", "dev")
    .requiredOption("-u <user>", "User que usara la app", "user")

    program.parse()


export default {
    port: process.env.PORT,
    mongoUrl: process.env.DB,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    productCollection: process.env.PRODUCTCOLLNAME,
    cartCollection: process.env.CARTCOLLNAME,
    userCollection: process.env.USERCOLLNAME,
    chatCollection: process.env.CHATCOLLNAME,
    privateKey: process.env.PRIVATE_KEY,
    persistence: program.opts().persist,
    cartPath: process.env.cartPath,
    productPath: process.env.productPath
}