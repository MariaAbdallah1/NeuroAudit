import { Router } from "express";
import * as regServ from "./services/Regestiration.services.js"

const router = Router()

router.post("/signup", regServ.signUp)
router.post("/signin", regServ.signIn)
router.patch("/confirmemail", regServ.confirmEmail)

export default router