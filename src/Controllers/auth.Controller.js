import userModel from '../dao/models/user.Model.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import UserRepository from '../repositories/user.Repository.js';
import UserDao from '../dao/UserDao.js';
import jwt from 'jsonwebtoken';

// Clave secreta para firmar los tokens. Si no está en las variables de entorno, usamos una por defecto.
const JWT_SECRET = process.env.JWT_SECRET || 'claveSecretaTP';

const userDao = new UserDao();

class AuthController {
  // Esta función se encarga de registrar un nuevo usuario.
  static async registerUser(req, res) {
    try {
      const { first_name, last_name, email, password, age,  role } = req.body;

      // Primero revisamos si ya existe alguien con ese email.
      const exist = await userModel.findOne({ email });
      if (exist) {
        return res.status(400).json({ status: 'error', message: 'Usuario ya existe' });
      }

      // Si no existe, encriptamos la contraseña para guardarla segura.
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creamos el usuario en la base con sus datos y rol (por defecto "user").
      const user = await userModel.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        age,
        role: role || 'user'
      });

      // Respondemos con éxito y devolvemos el usuario creado.
      res.json({ status: 'success', payload: user });
    } catch (error) {
      // Si algo falla, devolvemos un error 
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // Esta función maneja el login de un usuario.
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      // Buscamos al usuario por su email.
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      }

      // Comparamos la contraseña ingresada con la guardada en la base.
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ status: 'error', message: 'Contraseña incorrecta' });
      }

      // Si todo está bien, generamos un token con el id y el rol del usuario.
      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' } // El token dura una hora.
      );

      // Respondemos con éxito y mandamos el token para que lo use en futuras peticiones.
      res.json({
        status: 'success',
        message: 'Login exitoso',
        token
      });
    } catch (error) {
      // Si algo falla, devolvemos un error
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
  static async forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await userRepository.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const token = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora

    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const resetLink = `http://localhost:8080/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'Recuperación de contraseña',
      html: `
        <h2>Recuperación de contraseña</h2>
        <a href="${resetLink}">
          <button>Restablecer contraseña</button>
        </a>
      `
    });

    res.json({ message: 'Correo enviado' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
static async resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await userRepository.dao.getByResetToken(token);

    if (!user)
      return res.status(400).json({ message: 'Token inválido' });

    if (user.resetPasswordExpires < Date.now())
      return res.status(400).json({ message: 'Token expirado' });

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword)
      return res.status(400).json({ message: 'No podés usar la misma contraseña' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Contraseña actualizada' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
}

export default AuthController;