// Importamos dotenv, básicamente para poder usar variables de entorno
import dotenv from "dotenv";

// Con esto cargamos las variables que están en el archivo .env
dotenv.config();

// Exportamos un objeto con todas las claves que vamos a necesitar en el proyecto
export default {
  JWT_SECRET: process.env.JWT_SECRET,   // la clave secreta para firmar y validar los tokens JWT
  MONGO_URI: process.env.MONGO_URI,     // la dirección de la base de datos MongoDB
  EMAIL_USER: process.env.EMAIL_USER,   // el usuario de la cuenta de correo que vamos a usar
  EMAIL_PASS: process.env.EMAIL_PASS    // la contraseña de esa cuenta de correo
};
