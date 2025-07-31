import { App } from "./app.js";

const app = new App();
const container = app.getContainer();
const config = container.resolve("config");
const databaseConnection = container.resolve("databaseConnection");
const serverConfig = config.getServerConfig();

// Connect to database and start server
databaseConnection
  .connect()
  .then(() => {
    app.getExpressApp().listen(serverConfig.port, () => {
      console.log(`Server running on port ${serverConfig.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start application:", error);
    process.exit(1);
  });
