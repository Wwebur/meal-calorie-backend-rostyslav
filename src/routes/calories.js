import express from "express";

export default function createCalorieRoutes(container) {
  const router = express.Router();
  const calorieController = container.resolve("calorieController");
  const authMiddleware = container.resolve("authMiddleware");

  router.post(
    "/get-calories",
    authMiddleware.authenticate,
    calorieController.getCalories
  );

  return router;
}
