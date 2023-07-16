import express from "express";
import userModel from "../services/mongoDB/models/usersModel.js";
import {
  generateJwt,
  passValidation,
  userDataValidation,
  adminValidation,
} from "../../utils.js";
import passport from "passport";
import { sendMail } from "../controllers/emailController.js";
import { restorePassword } from "../controllers/passwordController.js";

const router = express.Router();

router.post("/login", adminValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res
        .status(204)
        .send({ status: "Error", message: "Usuario no encontrado" });
    }

    if (!passValidation(user, password)) {
      return res.status(401).send({
        error: "Error",
        message: "El usuario y contraseña no coinciden",
      });
    }

    const userToken = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      rol: user.rol,
    };

    const accessToken = generateJwt(userToken);

    res.cookie("jwtToken", accessToken, { maxAge: 60000, httpOnly: true });

    res.send({ message: "Login completado con exito" });
  } catch (error) {
    req.logger.error(error);
    return res
      .status(500)
      .send({ status: "error", error: "Error interno de la applicacion." });
  }
});

router.post(
  "/register",
  userDataValidation,
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    try {
      res
        .status(201)
        .send({ status: "Succes", msg: "Usuario creado con exito" });
    } catch (error) {
      req.logger.error(error);
      return res
        .status(500)
        .send({ status: "error", error: "Error interno de la applicacion." });
    }
  }
);

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("jwtToken").redirect("/api/views/login");
  } catch (error) {
    req.logger.error(error);
  }
});

router.post("/sendrestoremail", sendMail)

router.post("/restorepassword", restorePassword)

router.get("/premium/:uid", async (req, res) => {


  let user = await  userModel.findOne({_id: req.params.uid})

  if(user.rol == "user"){
    user.rol = "premium"
  }else{
    user.rol = "user"
  }

  let response = await userModel.findOneAndUpdate({_id: req.params.uid}, user)
  res.status(200).send({Status: "Success", message: "Rol modificado con exito"})
})

export default router;
