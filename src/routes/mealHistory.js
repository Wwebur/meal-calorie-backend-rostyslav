import express from "express";
import { getMealHistory } from "../controllers/mealHistoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/meal-history", authMiddleware, getMealHistory);

export default router;
