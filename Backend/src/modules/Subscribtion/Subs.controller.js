import { Router } from "express";
import authentication from "../../MiddleWare/auth.middle.js";
import * as subs from "./Services/subs.services.js"

const router = Router()


router.get("/subs",authentication,subs.getMySubscriptions)
router.post("/session",authentication,subs.Session)

export default router;