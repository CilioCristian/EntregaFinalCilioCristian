import nodemailer from "nodemailer"; // librería para mandar mails
import config from "../config/config.js"; // acá tenés las credenciales (usuario y pass del mail)
import mailDAO from "../dao/mail.Dao.js"; // DAO para guardar registro del mail enviado

class MailService {
    async sendEmail(to, subject, text){
        // Configurás el transporte con Gmail y tus credenciales
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASS
            }
        });

        // Mandás el mail con los datos que te pasan
        await transporter.sendMail({
            from: config.EMAIL_USER,
            to,
            subject,
            text
        });

        // Guardás en la base un registro del mail enviado
        await mailDAO.saveMail({to, subject, text, date: new Date()});
    }
}

// Exportás una instancia lista para usar
export default new MailService();