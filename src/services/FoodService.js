import { IFoodService } from "../interfaces/IFoodService.js";
import fetch from "node-fetch";

export class FoodService extends IFoodService {
  #usdaConfig;

  constructor(usdaConfig) {
    super();
    this.#usdaConfig = usdaConfig;
  }

  async searchFood(query) {
    const url = `${
      this.#usdaConfig.baseUrl
    }/foods/search?query=${encodeURIComponent(query)}&api_key=${
      this.#usdaConfig.apiKey
    }&pageSize=${this.#usdaConfig.pageSize}`;
    const response = await fetch(url);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.foods || [];
  }

  getCaloriesFromFood(food) {
    if (!food.foodNutrients) return null;

    const calorie = food.foodNutrients.find(
      (nutrient) =>
        nutrient.nutrientName.toLowerCase().includes("energy") &&
        nutrient.unitName === "KCAL"
    );

    return calorie ? calorie.value : null;
  }
}
