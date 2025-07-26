import express from "express";
import { getCalories } from "../controllers/calorieController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/get-calories", authMiddleware, getCalories);

export default router;
