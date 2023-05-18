import passport from "passport"
import passportLocal from "passport-local"
import userModel from "../models/usersModels.js"
import { createHash, passValidation } from "../../utils.js"
import githubStrategy from "passport-github2"
import jwtStrategy from "passport-jwt"


//Declaramos la estrategia
const localStrategy = passportLocal.Strategy
const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;


const initializePassport = () => {

//JWT Strategy

passport.use('jwt', new JwtStrategy(
    // extraer la  cookie
    {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.PRIVATE_KEY
    },
    // Ambiente Async
    async(jwt_payload, done)=>{
        console.log("Entrando a passport Strategy con JWT.");
        try {
            console.log("JWT obtenido del payload");
            console.log(jwt_payload);
            return done(null, jwt_payload.user)
        } catch (error) {
            console.error(error);
            return done(error);
        }
    }
));




// //GitHub Strategy
// passport.use('github', new githubStrategy(
//     {
//         clientID: 'Iv1.f2dc1da032dd0ce9', 
//         clientSecret: 'cd14407aa6cd711ca0a83bd0afa0f9f6f0879d68',
//         callbackUrl: 'http://localhost:9090/api/sessions/githubcallback'
//     }, 
//     async (accessToken, refreshToken, profile, done) => {
//         console.log("Profile obtenido del usuario: ");
//         console.log(profile);
//         try {
//             const user = await userModel.findOne({email: profile._json.email});
//             console.log("Usuario encontrado para login:");
//             console.log(user);
//             if (!user) {
//                 console.warn("User doesn't exists with username: " + profile._json.email);
//                 let newUser = {
//                     firstName: profile._json.name,
//                     lastName: '',
//                     age: 18,
//                     email: profile._json.email,
//                     password: '',
//                     loggedBy: "GitHub"
//                 };
//                 const result = await userModel.create(newUser);
//                 return done(null, result);
//             } else {
//                 //Si entramos por acá significa que el usuario ya existía.
//                 return done(null, user);
//             }
//         } catch (error) {
//             return done(error);
//         }
//     })
// );
    

// //Register Strategy
// passport.use("register", new localStrategy({passReqToCallback: true, usernameField: "email"}, 

//     async(req, userName, password, done) => {

//     const {firstName, lastName, email, age} = req.body
//     try {
//         const exist = await userModel.findOne({email})

//         if(exist){
//             return done(null ,false)
//         }
    
    
//         let user = {
//             firstName,
//             lastName,
//             email,
//             age,
//             password: createHash(password)
//         }

//         const response = await userModel.create(user)
//         return done (null, response)

//     } catch (error) {
//         return done ("Error al registrar el usuario" + error)
//     }
    
//     }
// ))

// //Login Strategy

// passport.use("login", new localStrategy({passReqToCallback: true, usernameField:"email"},
//     async(req, userName, password, done) => {
//         try {

//             const usuario = await userModel.findOne({email: userName})


//             if(usuario === null){
//                 return done(null, false)
//             }

//             if(!passValidation(usuario, password)){
//                 return done(null, false)
//             }

//             return done(null, usuario)

//         } catch (error) {
//             console.log(error);
//             return done(error)
//                 }
//     }))

//Serializacion y Deserealizacion
passport.serializeUser((user, done) => {
    done(null, user._id)
})
    
passport.deserializeUser(async (id, done) =>{
        try {
            let user = await userModel.findById(id)
            done(null, user)
        } catch (error) {
            console.log("Error deserializando el usuario" + error);
        }
})
}



//Extraemos el token de la cookie
const cookieExtractor = req => {
    let token = null
    if (req && req.cookies){
        token = req.cookies["jwtToken"]
    }
    console.log(token);
    return token
}
export default initializePassport