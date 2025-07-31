import mongoose from "mongoose";

export class IDatabaseConnection {
  async connect() {
    throw new Error("Method must be implemented");
  }

  async disconnect() {
    throw new Error("Method must be implemented");
  }

  getConnectionInfo() {
    throw new Error("Method must be implemented");
  }

  get isConnected() {
    throw new Error("Property must be implemented");
  }
}

export class DatabaseConnection extends IDatabaseConnection {
  #config;
  #isConnected = false;
  #connectionListenersSetup = false;

  constructor(configService) {
    super();
    this.#config = configService;
  }

  get isConnected() {
    return this.#isConnected;
  }

  async connect() {
    try {
      if (this.#isConnected) {
        console.log("Database already connected");
        return;
      }

      const databaseConfig = this.#config.getDatabaseConfig();

      await mongoose.connect(
        databaseConfig.mongoUri,
      );

      this.#isConnected = true;
      console.log("✅ MongoDB connected successfully");

      // Set up connection event listeners only once
      if (!this.#connectionListenersSetup) {
        this.#setupConnectionListeners();
        this.#connectionListenersSetup = true;
      }
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
      this.#isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    try {
      if (!this.#isConnected) {
        console.log("Database not connected");
        return;
      }

      await mongoose.disconnect();
      this.#isConnected = false;
      console.log("✅ MongoDB disconnected successfully");
    } catch (error) {
      console.error("❌ MongoDB disconnection failed:", error.message);
      throw error;
    }
  }

  getConnectionInfo() {
    return {
      isConnected: this.#isConnected,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState,
      readyStateText: this.#getReadyStateText(mongoose.connection.readyState),
    };
  }

  async healthCheck() {
    try {
      if (!this.#isConnected) {
        return {
          status: "disconnected",
          message: "Database is not connected",
        };
      }

      // Ping the database
      await mongoose.connection.db.admin().ping();

      return {
        status: "healthy",
        message: "Database connection is healthy",
        info: this.getConnectionInfo(),
      };
    } catch (error) {
      return {
        status: "unhealthy",
        message: "Database health check failed",
        error: error.message,
      };
    }
  }

  #getReadyStateText(state) {
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    return states[state] || "unknown";
  }

  #setupConnectionListeners() {
    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
      this.#isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
      this.#isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected");
      this.#isConnected = true;
    });

    mongoose.connection.on("connected", () => {
      console.log("🔗 MongoDB connected");
      this.#isConnected = true;
    });

    // Graceful shutdown handlers
    this.#setupGracefulShutdown();
  }

  #setupGracefulShutdown() {
    const gracefulShutdown = async (signal) => {
      console.log(`🛑 Received ${signal}, shutting down gracefully...`);
      try {
        await this.disconnect();
        console.log("✅ Database disconnected successfully during shutdown");
        process.exit(0);
      } catch (error) {
        console.error("❌ Error during graceful shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

    // Handle uncaught exceptions
    process.on("uncaughtException", async (error) => {
      console.error("❌ Uncaught Exception:", error);
      await this.disconnect();
      process.exit(1);
    });

    process.on("unhandledRejection", async (reason, promise) => {
      console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
      await this.disconnect();
      process.exit(1);
    });
  }
}

// Legacy export function for backward compatibility
export const connectDB = async (config) => {
  if (!config) {
    throw new Error(
      "Configuration service is required for database connection"
    );
  }

  const dbConnection = new DatabaseConnection(config);
  await dbConnection.connect();
  return dbConnection;
};
