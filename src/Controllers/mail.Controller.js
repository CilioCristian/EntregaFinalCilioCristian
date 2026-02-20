import mailService from "../Services/mail.Service.js";

// Esta función se encarga de mandar un correo.
// Básicamente recibe los datos del request y usa el servicio de mails para enviarlo.
export const sendMail = async (req, res) => {
    try {
        // Del body sacamos a quién va dirigido, el asunto y el texto del correo.
        const {to, subject, text} = req.body;

        // Con esos datos llamamos al servicio de mails, que hace la magia de enviarlo.
        await mailService.sendEmail(to, subject, text);

        // Si todo salió bien, respondemos con un mensaje de éxito.
        res.status(200).json({message:"Se envió el correo correctamente"});
    } catch (error) {
        // Si algo explota (ej: credenciales mal, servidor de correo caído),
        // devolvemos un error 500 con el detalle.
        res.status(500).json({error: error.message});
    }
};
    