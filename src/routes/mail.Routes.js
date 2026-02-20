import {Router} from "express";
import {sendMail} from "../Controllers/mail.Controller.js";

const router = Router();

router.post("/send",sendMail);

export default router;