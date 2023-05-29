import {Router} from "express";
import userModel from "../models/usersModels.js";
import { passValidation } from "../../utils.js";
import { generateJwt } from "../../utils.js";


const router = Router()

router.post("/login", async (req, res) => {
    const {email, password} = req.body

    try {
        const usuario = await userModel.findOne({email: email})
        if(!usuario){
            return res.status(204).send({status: "Error", msg:"Usuario no encontrado en la base de datos"})
        }

        if(!passValidation(usuario, password)){
            res.status(401).send({status:"Error", msg:"El usuario y la contraseña no coinciden"})
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

export default router