import {Router} from "express";
import userModel from "../models/usersModels.js"

const router = Router()


const adminValidation = (req, res, next) => {
    const {email, password} = req.body
    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){

        req.session.user ={
            name: "admin",
            email: email,
            rol: "admin"
        }
        req.session.admin = true
        res.send({status: "Succes", payload: req.session.user, msg: "Se ha logueado con exito!"})
    }else{
        next()
    }
}

router.post("/register", async (req, res) => {
    const {firstName, lastName, email, age, password} = req.body

    const exist = await userModel.findOne({email})

    if(exist){
        res.status(400).send({status: "Error", msg: "El email ya esta registrado"})
    }


    let user = {
        firstName,
        lastName,
        email,
        age,
        password,
    }
    const response = await userModel.create(user)

    res.status(201).send({status: "Succes", msg: "Usuario registrado con exito!" + response.id})

})


router.post("/login", adminValidation,  async (req, res) => {

    const {email, password} = req.body

    const usuario = await userModel.findOne({email, password})

    if(usuario === null){
        return res.status(401).send({status: "Error", msg: "Usuario o contraseña incorrecta!"})
    }


    req.session.user = {
            name : `${usuario.firstName} ${usuario.lastName}`,
            email: usuario.email,
            age: usuario.age,
            rol: usuario.rol
        }
    res.send({status: "Succes", payload: req.session.user, msg: "Se ha logueado con exito!"})
    
})


export default router


