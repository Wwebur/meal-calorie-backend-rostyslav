export class AppConfig {
  #config = {};

  constructor() {
    this.#loadConfig();
    this.#validateConfig();
  }

  #loadConfig() {
    this.#config = {
      server: {
        port: process.env.PORT || 5000,
        nodeEnv: process.env.NODE_ENV || "development",
      },
      database: {
        mongoUri: process.env.MONGO_URI,
      },
      jwt: {
        secret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || "15m",
        refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d",
        issuer: process.env.JWT_ISSUER || "MealCalorieApp",
        audience: process.env.JWT_AUDIENCE || "users",
      },
      cors: {
        origins: [
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          process.env.CLIENT_URL,
        ].filter(Boolean),
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        maxAge: 86400,
      },
      rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 15,
        message:
          process.env.RATE_LIMIT_MESSAGE ||
          "Too many requests, please try again later.",
      },
      usda: {
        apiKey: process.env.USDA_API_KEY,
        baseUrl: process.env.USDA_BASE_URL || "https://api.nal.usda.gov/fdc/v1",
        pageSize: parseInt(process.env.USDA_PAGE_SIZE) || 10,
        timeout: parseInt(process.env.USDA_TIMEOUT) || 10000,
      },
      cookie: {
        maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
        httpOnly: process.env.COOKIE_HTTP_ONLY !== "false",
        sameSite: process.env.COOKIE_SAME_SITE || "strict",
        secure: process.env.NODE_ENV === "production",
      },
      logging: {
        level: process.env.LOG_LEVEL || "info",
        format: process.env.LOG_FORMAT || "combined",
      },
    };
  }

  #validateConfig() {
    const required = [
      "MONGO_URI",
      "JWT_SECRET",
      "JWT_REFRESH_SECRET",
      "USDA_API_KEY",
    ];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }

    // Validate MongoDB URI format
    if (!this.#config.database.mongoUri.startsWith("mongodb")) {
      throw new Error("Invalid MongoDB URI format");
    }
  }

  getServerConfig() {
    return { ...this.#config.server };
  }

  getDatabaseConfig() {
    return { ...this.#config.database };
  }

  getJwtConfig() {
    return { ...this.#config.jwt };
  }

  getCorsConfig() {
    return { ...this.#config.cors };
  }

  getRateLimitConfig() {
    return { ...this.#config.rateLimit };
  }

  getUsdaConfig() {
    return { ...this.#config.usda };
  }

  getCookieConfig() {
    return { ...this.#config.cookie };
  }

  getLoggingConfig() {
    return { ...this.#config.logging };
  }
}
