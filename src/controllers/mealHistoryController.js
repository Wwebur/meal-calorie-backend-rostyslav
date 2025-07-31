export class MealHistoryController {
  #mealHistoryService;

  constructor(mealHistoryService) {
    this.#mealHistoryService = mealHistoryService;
  }

  getMealHistory = async (req, res) => {
    try {
      const userId = req.user.sub;
      const history = await this.#mealHistoryService.getUserMealHistory(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
}
