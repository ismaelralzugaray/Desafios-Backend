import {fileURLToPath} from "url"
import { dirname } from "path"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import passport from "passport"


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


export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("Unauthorized: User not found in JWT"); 
        if (req.user.role !== role) {
            return res.status(403).send("Forbidden: El usuario no tiene permisos con este rol."); 
        }
        next();
    }
};

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({error: info.messages?info.messages:info.toString()});
            }
            console.log("Usuario obtenido del strategy: ");
            console.log(user);
            req.user = user;
            next();
        })(req, res, next);
    }
};








export default __dirname