import {Command} from "commander"

const program = new Command()

program
    .option("-d", "Variable para debug" ,false)
    .option("-p <port>", "puerto del server", 9090)
    .option("-mode <mode>", "modo de trabajo", "development")
    .requiredOption("-u <user>", "User que usara la app", "user")

    program.parse()

    export default program