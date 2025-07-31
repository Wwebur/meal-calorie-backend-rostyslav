export class IUserRepository {
  async findByEmail(email) {
    throw new Error("Method must be implemented");
  }

  async create(userData) {
    throw new Error("Method must be implemented");
  }

  async findById(id) {
    throw new Error("Method must be implemented");
  }
}
