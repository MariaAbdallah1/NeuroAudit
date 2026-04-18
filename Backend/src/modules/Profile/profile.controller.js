import { Router } from "express";
import authentication from "../../MiddleWare/auth.middle.js";
import Profile from "./services/profile.services.js";

const router = Router()

router.get("/profile",authentication,Profile)

export default router


