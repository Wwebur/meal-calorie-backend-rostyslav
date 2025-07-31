export class IMealLogRepository {
  async create(mealData) {
    throw new Error("Method must be implemented");
  }

  async findByUserId(userId, limit = 50) {
    throw new Error("Method must be implemented");
  }
}
