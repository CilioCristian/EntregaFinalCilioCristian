import mailService from "../Services/mail.Service.js";

export const sendMail = async (req, res) => {
    try{
        const {to, subject, text} = req.body;
        await mailService.sendEmail(to, subject, text);

        res.status(200).json({message:"Se envio el correo correctamente"});
    } catch (error){
        res.status(500).json({error: error.message});
    }
};
    