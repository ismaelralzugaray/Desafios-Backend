import {Router} from "express";
import userModel from "../services/MongoDB/models/usersModels.js";
import { passValidation, generateJwt, createHash } from "../../utils.js";



const router = Router()

const adminValidation = (req, res, next) => {
    const {email, password} = req.body
    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){

        const usuario = req.user

        const accesToken = generateJwt(usuario)

        res.cookie("jwtToken", accesToken, {maxAge:60000, httpOnly: true, })

        res.send({status: "Succes", msg: "Se ha logueado con exito!"})
    }else{
        next()
    }
} 


const userDataValidation = (req, res, next) =>{

    const {firstName, lastName, email, age, password} = req.body

    if  (firstName !== "" &&
        lastName !== "" &&
        email !== "" &&
        age !== "" &&
        password !== ""
        ){
            next()
          }
              else{res.status(400).send({status: "Error", message:"Debe completar todos los campos"})}
       }

router.post("/login", adminValidation,   async (req, res) => {
    const {email, password} = req.body

    try {
        const usuario = await userModel.findOne({email: email})

        if(!usuario){
            return res.status(204).send({status: "Error", msg:"Usuario no encontrado en la base de datos"})
        }

        if(!passValidation(usuario, password)){
            return res.status(401).send({status:"Error", msg:"El usuario y la contraseña no coinciden"})
        }

        const userToken = {
            name: `${usuario.firstName} ${usuario.lastName}`,
            email: usuario.email,
            age: usuario.age,
            role: usuario.rol
        }


        const accesToken = generateJwt(userToken)

        res.cookie("jwtToken", accesToken, {maxAge:60000, httpOnly: true, })

        res.send({message: "Login realizado con exito"})

    } catch (error) {
        console.error(error)
        return res.status(500).send({status: "Error", error: "Error interno"})
    }
})

router.post("/register", userDataValidation, async (req, res) => {
    try {
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
        password: createHash(password),
    }
    const response = await userModel.create(user)

    res.status(201).send({status: "Succes", msg: "Usuario registrado con exito!" + response.id})
    } catch (error) {
        res.status(500).send({status: "Error", msg:"No se pudo crear el usuario"})
    }
    

})

    

   

export default router