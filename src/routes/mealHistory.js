import express from "express";

export default function createMealHistoryRoutes(container) {
  const router = express.Router();
  const mealHistoryController = container.resolve("mealHistoryController");
  const authMiddleware = container.resolve("authMiddleware");

  router.get(
    "/meal-history",
    authMiddleware.authenticate,
    mealHistoryController.getMealHistory
  );

  return router;
}
