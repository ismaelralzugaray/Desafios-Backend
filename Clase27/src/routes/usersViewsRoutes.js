import express from "express"
import {passportCall, authorization } from "../../utils.js"



const router = express.Router()


router.get("/login",  (req, res) =>{
    res.render("login")

})


router.get("/register", (req, res) =>{
    res.render("register")
})


router.get("/", passportCall("jwt"), authorization("user"), (req, res) => {
    console.log(req.user);
    res.render("profile", {user: req.user})

})





export default router