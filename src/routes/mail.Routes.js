import {Router} from "express"; // traés el Router de Express
import {sendMail} from "../Controllers/mail.Controller.js"; // importás la función que manda mails

const router = Router();

// Definís la ruta POST "/send" que llama al controlador sendMail
router.post("/send", sendMail);

export default router; // exportás el router para usarlo en la app principal