import mongoose from "mongoose";

const mealLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dish_name: { type: String, required: true },
  servings: { type: Number, required: true },
  calories_per_serving: { type: Number, required: true },
  total_calories: { type: Number, required: true },
  source: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("MealLog", mealLogSchema);