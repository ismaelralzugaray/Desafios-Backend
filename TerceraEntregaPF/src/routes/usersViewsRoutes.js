import express from "express"
import { isAdmin } from "../../utils.js"




const router = express.Router()


router.get("/login",  (req, res) =>{
    res.render("login")

})


router.get("/register", (req, res) =>{
    res.render("register")
})


router.get("/current", isAdmin, (req, res) => {
    
    res.render("profile", {user: req.user})

})





export default router