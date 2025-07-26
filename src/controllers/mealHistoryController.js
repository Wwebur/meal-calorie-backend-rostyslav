import MealLog from "../models/mealLogModel.js";

export const getMealHistory = async (req, res) => {
  try {
    const userId = req.user.sub;
    const history = await MealLog.find({ user: userId })
      .sort({ date: -1 })
      .limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
