import UserModel from './models/user.Model.js'; // importás el modelo de usuario (esquema de MongoDB)

export default class UserDao {

  // Trae todos los usuarios
  async getAll() {
    return await UserModel.find();
  }

  // Busca un usuario por su ID
  async getById(id) {
    return await UserModel.findById(id);
  }

  // Busca un usuario por su email
  async getByEmail(email) {
    return await UserModel.findOne({ email });
  }

  // Crea un usuario nuevo
  async create(userData) {
    return await UserModel.create(userData);
  }

  // Actualiza un usuario por ID y devuelve el actualizado
  async update(id, updateData) {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Borra un usuario por ID
  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }

  // Busca un usuario por su token de reset de contraseña
  async getByResetToken(token) {
    return await UserModel.findOne({ resetPasswordToken: token });
  }
}