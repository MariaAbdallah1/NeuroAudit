import DBconn from "./DB/connection.js"
import AuthController from "./modules/Auth/Auth.controller.js"
import BotController from "./modules/Bot/Bot.controller.js"
import SubsController from "./modules/Subscribtion/Subs.controller.js"
import ProfileController from "./modules/Profile/profile.controller.js"

function bootStrab(app,express){
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));
    app.use("/auth", AuthController)
    app.use("/chat", BotController)
    app.use("/plan",SubsController)
    app.use("/",ProfileController)
    DBconn()
}




export default bootStrab