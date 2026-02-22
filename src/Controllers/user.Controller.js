import bcrypt from 'bcrypt'; // librería para encriptar contraseñas
import UserDao from '../dao/UserDao.js'; // acceso directo a la base de datos
import UserRepository from '../repositories/user.Repository.js'; // capa intermedia para manejar lógica
import UserDTO from '../dto/UserCurrentDTO.js'; // DTO para devolver datos seguros en /current

const userDao = new UserDao();
const userRepository = new UserRepository(userDao);

// Controlador de usuarios: define las rutas y qué hacen
class UserController {

  // Trae todos los usuarios
  static async getAllUsers(req, res) {
    try {
      const users = await userDao.getAll(); // usa el dao para traerlos
      res.json({ status: 'success', payload: users });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // Busca un usuario por su ID
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

  // Crea un usuario nuevo
  static async createUser(req, res) {
    try {
      const { first_name, last_name, email, password, age, role } = req.body;

      // Chequea si ya existe el mail
      const exist = await userRepository.getByEmail(email);
      if (exist)
        return res.status(400).json({ status: 'error', message: 'Usuario ya existe' });

      // Encripta la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crea el usuario con rol por defecto "user"
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

  // Actualiza datos de un usuario
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

  // Borra un usuario
  static async deleteUser(req, res) {
    try {
      const deletedUser = await userDao.delete(req.params.uid);
      if (!deletedUser)
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

      res.json({ status: 'success', payload: deletedUser });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // Devuelve el usuario actual logueado, pero filtrado con DTO
  static async current(req, res) {
    try {
      const user = req.user; // viene del middleware de auth
      const safeUser = new UserDTO(user); // limpia datos sensibles
      res.json({ status: 'success', payload: safeUser });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default UserController;