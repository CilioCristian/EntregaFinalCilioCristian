import bcrypt from 'bcrypt';
import UserDao from '../dao/UserDao.js';
import UserRepository from '../repositories/user.repository.js';
import UserDTO from '../dto/UserCurrentDTO.js'; // DTO para /current

const userDao = new UserDao();
const userRepository = new UserRepository(userDao);

class UserController {

  static async getAllUsers(req, res) {
    try {
      // Si querés todos los usuarios, deberías tener un método en el repo
      const users = await userDao.getAll(); // o implementa getAll en el repo
      res.json({ status: 'success', payload: users });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await userRepository.getById(req.params.uid);
      if (!user)
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

      res.json({ status: 'success', payload: user });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const { first_name, last_name, email, password, age, role } = req.body;

      const exist = await userRepository.getByEmail(email);
      if (exist)
        return res.status(400).json({ status: 'error', message: 'Usuario ya existe' });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userRepository.create({
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

  static async updateUser(req, res) {
    try {
      const updatedUser = await userRepository.update(req.params.uid, req.body);
      if (!updatedUser)
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

      res.json({ status: 'success', payload: updatedUser });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      // Si querés delete, deberías implementarlo en el repo o usar el dao
      const deletedUser = await userDao.delete(req.params.uid);
      if (!deletedUser)
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

      res.json({ status: 'success', payload: deletedUser });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // Ruta /current con DTO
  static async current(req, res) {
    try {
      const user = req.user; // viene del middleware de autenticación
      const safeUser = new UserDTO(user);
      res.json({ status: 'success', payload: safeUser });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default UserController;