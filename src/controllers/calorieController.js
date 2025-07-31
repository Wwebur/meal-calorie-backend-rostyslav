export class CalorieController {
  #calorieService;
  
  constructor(calorieService) {
    this.#calorieService = calorieService;
  }
  
  getCalories = async (req, res) => {
    try {
      const { dish_name, servings } = req.body;
      const userId = req.user?.sub;
      
      const result = await this.#calorieService.calculateCalories(
        dish_name,
        servings,
        userId
      );
      
      res.json(result);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({ message: error.message });
    }
  };
}