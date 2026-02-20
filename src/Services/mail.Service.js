import nodemailer from "nodemailer";
import config from "../Config/config.js";
import mailDAO from "../dao/mail.Dao.js";

class MailService {
    async sendEmail(to, subject, text){
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASS
            }
        });
        await transporter.sendMail({
            from: config.EMAIL_USER,
             to,
              subject,
               text
        });
        await mailDAO.saveMail({to, subject, text, date: new Date()});
    }
}
export default new MailService();