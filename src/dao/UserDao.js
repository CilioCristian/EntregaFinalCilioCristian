import UserModel from './models/user.Model.js';

export default class UserDao {

  async getAll() {
    return await UserModel.find();
  }

  async getById(id) {
    return await UserModel.findById(id);
  }

  async getByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async create(userData) {
    return await UserModel.create(userData);
  }

  async update(id, updateData) {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }
  async getByResetToken(token) {
  return await UserModel.findOne({ resetPasswordToken: token });
}
}