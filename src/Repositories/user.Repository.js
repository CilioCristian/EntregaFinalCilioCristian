import UserModel from "../dao/models/user.Model.js";

export default class UserRepository {
  
  // Buscar usuario por ID
  async getById(id) {
    return await UserModel.findById(id);
  }

  // Buscar usuario por email (usado en login y recuperación)
  async getByEmail(email) {
    return await UserModel.findOne({ email });
  }

  // Crear nuevo usuario
  async create(userData) {
    return await UserModel.create(userData);
  }

  // Actualizar por ID
  async update(id, data) {
    return await UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  // Actualizar por email
  async updateByEmail(email, data) {
    return await UserModel.findOneAndUpdate({ email }, data, { new: true });
  }
}