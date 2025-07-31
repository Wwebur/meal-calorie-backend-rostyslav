import { IMealLogRepository } from "../interfaces/IMealLogRepository.js";
import MealLog from "../models/mealLogModel.js";

export class MealLogRepository extends IMealLogRepository {
  async create(mealData) {
    return await MealLog.create(mealData);
  }

  async findByUserId(userId, limit = 50) {
    return await MealLog.find({ user: userId }).sort({ date: -1 }).limit(limit);
  }
}
