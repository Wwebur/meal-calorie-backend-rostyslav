export class AuthMiddleware {
  #authService;
  #jwtConfig;

  constructor(authService, jwtConfig) {
    this.#authService = authService;
    this.#jwtConfig = jwtConfig;
  }

  authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = this.#authService.verifyToken(
        token,
        this.#jwtConfig.secret
      );
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      res.status(401).json({ message: "Invalid token" });
    }
  };
}
