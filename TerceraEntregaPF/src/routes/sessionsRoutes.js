import {Router} from "express";
import { generateJwt } from "../../utils.js";
import passport from "passport";


const router = Router()


const adminValidation = (req, res, next) => {
    const {email, password} = req.body
    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){

        const usuario = req.user

        const accesToken = generateJwt(usuario)

        res.send({status: "Succes", accesToken: accesToken, msg: "Se ha logueado con exito!"})
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


router.post("/register",userDataValidation,  passport.authenticate("register", {failureRedirect:"/api/sessions/fail-register"}), 
    async (req, res) => {

        res.status(201).send({status: "Succes", msg: "Usuario creado con exito"})

})


// router.post("/login", adminValidation, passport.authenticate("login", {failureRedirect: "api/sessions/fail-login"}), 
//     async (req, res) => {

//         const usuario = req.user
//         if(!usuario) return res.status(401).send({status: "Error", msg:"El usuario y la contraseña no coinciden!"})

//         const accesToken = generateJwt(usuario)

//     res.send({status: "Succes", accesToken: accesToken, msg: "Se ha logueado con exito!"})
    
// })

// router.get("/github", passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {});

// router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/github/error'}), async (req, res) => {

//     res.redirect("/products");
// });

// router.get("/fail-register", (req, res) => {
//     res.status(401).send({error: "Error al procesar el registro"})
// })

// router.get("/fail-login", (req, res) => {
//     res.status(401).send({error: "Error al procesar el login"})
// })


export default router


