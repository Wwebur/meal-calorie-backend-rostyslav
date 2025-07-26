import fetch from "node-fetch";

export const searchFood = async (query) => {
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&api_key=${process.env.USDA_API_KEY}&pageSize=10`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const data = await response.json();
  return data.foods || [];
};

// Extract calories per serving or per 100g
export const getCaloriesFromFood = (food) => {
  if (!food.foodNutrients) return null;
  // Try to find calories per 100g or per serving
  const cal = food.foodNutrients.find(
    (n) => n.nutrientName.toLowerCase().includes("energy") && n.unitName === "KCAL"
  );
  if (cal) return cal.value;
  return null;
};
