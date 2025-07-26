import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import calorieRoutes from "./routes/calories.js";
import mealHistoryRoutes from "./routes/mealHistory.js";
import rateLimiter from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.CLIENT_URL,
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.set("trust proxy", 1);
app.use(rateLimiter);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/", calorieRoutes);
app.use("/", mealHistoryRoutes);
app.use(errorHandler);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;
