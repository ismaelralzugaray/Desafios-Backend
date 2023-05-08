import {fileURLToPath} from "url"
import { dirname } from "path"
import bcrypt from "bcrypt"


//STATIC FILES
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//BCRYPT

//Generamos el hash

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//Validamos la contraseña con el hash en la DB

export const passValidation = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}





export default __dirname