import express, { response } from "express";
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
import { uploader } from "../../utils.js";

const router = express.Router();

router.post("/login", adminValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
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

    const id = user._id;
    res.cookie("id", id, { maxAge: 600000, httpOnly: true });
    const accessToken = generateJwt(userToken);

    res.cookie("jwtToken", accessToken, { maxAge: 600000, httpOnly: true });
    let date = new Date();
    let result = await userModel.findOneAndUpdate(
      { email: email },
      { lastConnection: date }
    );

    res
      .status(201)
      .send({ message: "Login completado con exito", payload: user._id });
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

router.get("/logout", async (req, res) => {
  try {
    let uid = req.cookies["id"];
    let date = new Date();
    let response = await userModel.findOneAndUpdate(
      { _id: uid },
      { lastConnection: date }
    );
    res.clearCookie("jwtToken").redirect("/api/views/login");
  } catch (error) {
    eq.logger.error(error);
  }
});

router.post("/sendrestoremail", sendMail);

router.post("/restorepassword", restorePassword);

router.get("/premium/:uid", async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.uid });

    let documentsArray = user.documents;
    const documentNames = documentsArray.map((doc) => doc.name);

    if (user.rol == "premium") {
      user.rol = "user";

      const userToken = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        rol: user.rol,
      };

      const accessToken = generateJwt(userToken);

      res.cookie("jwtToken", accessToken, { maxAge: 600000, httpOnly: true });

      let response = await userModel.findOneAndUpdate(
        { _id: req.params.uid },
        user
      );
      return res
        .status(200)
        .send({ Status: "Success", message: "Rol modificado con exito" });
    }

    if (user.rol == "user") {
      if (
        documentNames.includes(
          "document-identificacion" &&
            "document-comprobante-de-domicilio" &&
            "document-comprobante-de-estado-de-cuenta"
        )
      ) {
        user.rol = "premium";

        const userToken = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          age: user.age,
          rol: user.rol,
        };

        const accessToken = generateJwt(userToken);

        res.cookie("jwtToken", accessToken, { maxAge: 600000, httpOnly: true });

        let response = await userModel.findOneAndUpdate(
          { _id: req.params.uid },
          user
        );
        return res
          .status(200)
          .send({ Status: "Success", message: "Rol modificado con exito" });
      } else {
        return res.status(400).send({
          Status: "Error",
          msg: "No se ha cargado toda la documentacion requerida",
        });
      }
    }
  } catch (error) {
    console.log(error);
    //req.logger.error(error)
    res
      .status(500)
      .send({ Status: "Error", message: "Error al modificar el rol" });
  }
});

router.post("/:uid/documents", uploader.any(), async (req, res) => {
  try {
    let uid = req.params.uid;
    const user = await userModel.findOne({ _id: uid });

    let filesArray = user.documents;

    req.files.forEach((file) => {
      let obj = {
        name: file.fieldname,
        reference: file.destination,
      };
      filesArray.push(obj);
    });

    let response = await userModel.findOneAndUpdate(
      { _id: uid },
      { documents: filesArray }
    );

    res.send({ payload: response });
  } catch (error) {
    console.log(error);
  }
});

export default router;
