export class MealHistoryService {
  #mealLogRepository;

  constructor(mealLogRepository) {
    this.#mealLogRepository = mealLogRepository;
  }

  async getUserMealHistory(userId, limit = 50) {
    return await this.#mealLogRepository.findByUserId(userId, limit);
  }
}
