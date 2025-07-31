import express from "express";

export default function createAuthRoutes(container) {
  const router = express.Router();
  const authController = container.resolve("authController");

  router.post("/register", authController.register);
  router.post("/login", authController.login);
  router.post("/refresh", authController.refresh);
  router.post("/logout", authController.logout);

  return router;
}
