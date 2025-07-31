import { IUserRepository } from "../interfaces/IUserRepository.js";
import User from "../models/userModel.js";

export class UserRepository extends IUserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findById(id);
  }
}
