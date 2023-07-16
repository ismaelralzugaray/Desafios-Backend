import nodemailer from "nodemailer"
import config from "../config/config.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailPassword
    }
})

transporter.verify(function (error, success){
    if (error) {
        console.log(error);
    }else{
        console.log("Server is ready to take our message");
    }
})


export const sendMail = (req,res) => {
    try {
        console.log(req.body);
        let result = transporter.sendMail({
            from: "",
            to: "ismaelroalzugaray@gmail.com",
            subject: "Restablecer contraseña KretzCommerce",
            html: `<div><h1>Haga click <a href="http://localhost:9090/api/views/passwordchange">AQUI</a> para restablecer su contraseña</h1></div>`
        }, (error, info) => {
            if (error){
                console.log(error);
                res.status(400).send({message: "Se produjo un error", payload: error})
            }else{
                res.send({message: "Succes", payload: info})
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({message: "No se pudo enviar el email", error: error })
    }
}