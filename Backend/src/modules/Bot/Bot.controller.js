import { Bot } from "./services/Bot.services.js";
import { Router } from "express";


const router = Router()

router.get("/bot",Bot)

export default router


