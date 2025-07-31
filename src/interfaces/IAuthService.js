export class IAuthService {
  async register(userData) {
    throw new Error("Method must be implemented");
  }

  async login(credentials) {
    throw new Error("Method must be implemented");
  }

  generateAccessToken(user) {
    throw new Error("Method must be implemented");
  }

  generateRefreshToken(user) {
    throw new Error("Method must be implemented");
  }

  verifyToken(token, secret) {
    throw new Error("Method must be implemented");
  }
}
