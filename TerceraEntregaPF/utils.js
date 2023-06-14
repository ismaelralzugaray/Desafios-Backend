import {fileURLToPath} from "url"
import { dirname } from "path"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "./src/services/MongoDB/models/usersModels.js"



//STATIC FILES
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//BCRYPT

//Generamos el hash

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//Validamos la contraseña con el hash en la DB

export const passValidation = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

//JWT



export const generateJwt = (user) => {
    return jwt.sign({user}, process.env.PRIVATE_KEY, {expiresIn: "24h"})
}

export const authToken = (req, res, next) => {
    
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).send({error: "Usuario no autenticado"})
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error){
            return res.status(403).send({error: "Token invalido"})
        }
        req.user(credentials.user)
        next()
    })
}

export  const isAdmin = async (req, res, next) => {
    const user = await userModel.find(req.email)
    console.log(user.rol);
}

export default __dirname