export class CalorieService {
  #foodService;
  #mealLogRepository;
  
  constructor(foodService, mealLogRepository) {
    this.#foodService = foodService;
    this.#mealLogRepository = mealLogRepository;
  }
  
  async calculateCalories(dishName, servings, userId = null) {
    if (!dishName || typeof servings !== 'number' || servings <= 0) {
      throw new Error('Invalid dish name or servings');
    }
    
    const foods = await this.#foodService.searchFood(dishName);
    if (!foods || foods.length === 0) {
      throw new Error('Dish not found');
    }
    
    const bestMatch = this.#findBestMatch(dishName, foods);
    if (!bestMatch) {
      throw new Error('Dish not found');
    }
    
    const caloriesPerServing = this.#foodService.getCaloriesFromFood(bestMatch);
    if (!caloriesPerServing) {
      throw new Error('Calorie info not found');
    }
    
    const totalCalories = caloriesPerServing * servings;
    
    let mealLog = null;
    if (userId) {
      mealLog = await this.#mealLogRepository.create({
        user: userId,
        dish_name: dishName,
        servings,
        calories_per_serving: caloriesPerServing,
        total_calories: totalCalories,
        source: 'USDA FoodData Central'
      });
    }
    
    return {
      dish_name: dishName,
      servings,
      calories_per_serving: caloriesPerServing,
      total_calories: totalCalories,
      source: 'USDA FoodData Central',
      ...(mealLog && { date: mealLog.date })
    };
  }
  
  #findBestMatch(query, foods) {
    const queryWords = query.toLowerCase().split(/\s+/);
    let bestScore = 0;
    let bestFood = null;
    
    for (const food of foods) {
      const foodWords = food.description.toLowerCase().split(/\s+/);
      const score = queryWords.filter((word) => foodWords.includes(word)).length;
      
      if (score > bestScore) {
        bestScore = score;
        bestFood = food;
      }
    }
    
    return bestFood || foods[0];
  }
}