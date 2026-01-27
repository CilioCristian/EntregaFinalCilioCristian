import UserModel from '../dao/models/user.Model.js';
import bcrypt from 'bcrypt';

class UserController {
  // Esta función trae todos los usuarios guardados en la base.
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.find();
      res.json({ status: 'success', payload: users });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // Esta busca un usuario puntual usando su ID.
  static async getUserById(req, res) {
    try {
      const user = await UserModel.findById(req.params.uid);
      if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      res.json({ status: 'success', payload: user });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // Esta crea un usuario nuevo directo en la base (sin pasar por login/registro con JWT).
  static async createUser(req, res) {
    try {
      const { first_name, last_name, email, password, age, role, } = req.body;

      // Revisamos si ya existe alguien con ese email.
      const exist = await UserModel.findOne({ email });
      if (exist) return res.status(400).json({ status: 'error', message: 'Usuario ya existe' });

      // Encriptamos la contraseña para guardarla segura.
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creamos el usuario con sus datos y rol (por defecto "user").
      const user = await UserModel.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        age,
        role: role || 'user'
      });

      res.json({ status: 'success', payload: user });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // Esta actualiza los datos de un usuario ya existente.
  static async updateUser(req, res) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(req.params.uid, req.body, { new: true });
      if (!updatedUser) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      res.json({ status: 'success', payload: updatedUser });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // Esta elimina un usuario de la base usando su ID.
  static async deleteUser(req, res) {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(req.params.uid);
      if (!deletedUser) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      res.json({ status: 'success', payload: deletedUser });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default UserController;