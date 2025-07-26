import { searchFood, getCaloriesFromFood } from "../utils/usdaApi.js";
import fuzzyMatch from "../utils/fuzzyMatch.js";
import MealLog from "../models/mealLogModel.js";

export const getCalories = async (req, res) => {
  try {
    const { dish_name, servings } = req.body;
    if (!dish_name || typeof servings !== "number" || servings <= 0)
      return res.status(400).json({ message: "Invalid dish name or servings" });

    const foods = await searchFood(dish_name);
    if (!foods || foods.length === 0)
      return res.status(404).json({ message: "Dish not found" });

    // Fuzzy match to find best food
    const bestMatch = fuzzyMatch(dish_name, foods);
    if (!bestMatch) return res.status(404).json({ message: "Dish not found" });

    const caloriesPerServing = getCaloriesFromFood(bestMatch);
    if (!caloriesPerServing)
      return res.status(404).json({ message: "Calorie info not found" });

    const totalCalories = caloriesPerServing * servings;

    // Save meal log (if user is authenticated)
    let mealLog = null;
    if (req.user && req.user.sub) {
      mealLog = await MealLog.create({
        user: req.user.sub,
        dish_name,
        servings,
        calories_per_serving: caloriesPerServing,
        total_calories: totalCalories,
        source: "USDA FoodData Central",
      });
    }

    res.json({
      dish_name,
      servings,
      calories_per_serving: caloriesPerServing,
      total_calories: totalCalories,
      source: "USDA FoodData Central",
      ...(mealLog && { date: mealLog.date }),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
