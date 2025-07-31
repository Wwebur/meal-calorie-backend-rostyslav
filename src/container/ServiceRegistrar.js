import { AppConfig } from "../config/AppConfig.js";
import { DatabaseConnection } from "../config/db.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { MealLogRepository } from "../repositories/MealLogRepository.js";
import { AuthService } from "../services/AuthService.js";
import { FoodService } from "../services/FoodService.js";
import { CalorieService } from "../services/CalorieService.js";
import { MealHistoryService } from "../services/MealHistoryService.js";
import { AuthController } from "../controllers/AuthController.js";
import { CalorieController } from "../controllers/CalorieController.js";
import { MealHistoryController } from "../controllers/MealHistoryController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { RateLimitMiddleware } from "../middleware/RateLimitMiddleware.js";

export class ServiceRegistrar {
  static registerServices(container) {
    // Configuration
    container.register("config", () => new AppConfig(), { singleton: true });

    // Database
    container.register(
      "databaseConnection",
      (container) => {
        const config = container.resolve("config");
        return new DatabaseConnection(config);
      },
      { singleton: true }
    );

    // Repositories
    container.register("userRepository", () => new UserRepository(), {
      singleton: true,
    });
    container.register("mealLogRepository", () => new MealLogRepository(), {
      singleton: true,
    });

    // Services
    container.register(
      "authService",
      (container) => {
        const userRepo = container.resolve("userRepository");
        const config = container.resolve("config");
        return new AuthService(userRepo, config.getJwtConfig());
      },
      { singleton: true }
    );

    container.register(
      "foodService",
      (container) => {
        const config = container.resolve("config");
        return new FoodService(config.getUsdaConfig());
      },
      { singleton: true }
    );

    container.register(
      "calorieService",
      (container) => {
        const foodService = container.resolve("foodService");
        const mealLogRepo = container.resolve("mealLogRepository");
        return new CalorieService(foodService, mealLogRepo);
      },
      { singleton: true }
    );

    container.register(
      "mealHistoryService",
      (container) => {
        const mealLogRepo = container.resolve("mealLogRepository");
        return new MealHistoryService(mealLogRepo);
      },
      { singleton: true }
    );

    // Controllers
    container.register("authController", (container) => {
      const authService = container.resolve("authService");
      const config = container.resolve("config");
      return new AuthController(authService, config.getCookieConfig());
    });

    container.register("calorieController", (container) => {
      const calorieService = container.resolve("calorieService");
      return new CalorieController(calorieService);
    });

    container.register("mealHistoryController", (container) => {
      const mealHistoryService = container.resolve("mealHistoryService");
      return new MealHistoryController(mealHistoryService);
    });

    // Middleware
    container.register("authMiddleware", (container) => {
      const authService = container.resolve("authService");
      const config = container.resolve("config");
      return new AuthMiddleware(authService, config.getJwtConfig());
    });

    container.register("rateLimitMiddleware", (container) => {
      const config = container.resolve("config");
      return new RateLimitMiddleware(config.getRateLimitConfig());
    });
  }
}
