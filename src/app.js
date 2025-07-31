import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { Container } from "./container/Container.js";
import { ServiceRegistrar } from "./container/ServiceRegistrar.js";
import authRoutes from "./routes/auth.js";
import calorieRoutes from "./routes/calories.js";
import mealHistoryRoutes from "./routes/mealHistory.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

export class App {
  #app;
  #container;
  #config;

  constructor() {
    this.#app = express();
    this.#container = new Container();
    this.#setupContainer();
    this.#config = this.#container.resolve("config");
    this.#setupMiddleware();
    this.#setupRoutes();
    this.#setupErrorHandling();
  }

  #setupContainer() {
    ServiceRegistrar.registerServices(this.#container);
  }

  #setupMiddleware() {
    this.#app.use(cors(this.#config.getCorsConfig()));
    this.#app.set("trust proxy", 1);

    const rateLimitMiddleware = this.#container.resolve("rateLimitMiddleware");
    this.#app.use(rateLimitMiddleware.createLimiter());

    this.#app.use(express.json());
    this.#app.use(cookieParser());
  }

  #setupRoutes() {
    this.#app.use("/auth", authRoutes(this.#container));
    this.#app.use("/", calorieRoutes(this.#container));
    this.#app.use("/", mealHistoryRoutes(this.#container));

    // Health check endpoints
    this.#app.get("/health", (req, res) => {
      res.json({ status: "OK", timestamp: new Date().toISOString() });
    });

    this.#app.get("/health/db", async (req, res) => {
      const databaseConnection = this.#container.resolve("databaseConnection");
      const healthStatus = await databaseConnection.healthCheck();

      const statusCode = healthStatus.status === "healthy" ? 200 : 503;
      res.status(statusCode).json(healthStatus);
    });
  }

  #setupErrorHandling() {
    this.#app.use(errorHandler);
  }

  getExpressApp() {
    return this.#app;
  }

  getContainer() {
    return this.#container;
  }
}
