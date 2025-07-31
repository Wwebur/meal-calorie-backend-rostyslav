import { IAuthService } from "../interfaces/IAuthService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService extends IAuthService {
  #userRepository;
  #jwtConfig;

  constructor(userRepository, jwtConfig) {
    super();
    this.#userRepository = userRepository;
    this.#jwtConfig = jwtConfig;
  }

  async register(userData) {
    const { first_name, last_name, email, password } = userData;

    if (!first_name || !last_name || !email || !password) {
      throw new Error("All fields are required");
    }

    const existingUser = await this.#userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await this.#userRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    return { message: "User registered successfully" };
  }

  async login(credentials) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await this.#userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    };
  }

  generateAccessToken(user) {
    return jwt.sign(
      { sub: user._id, email: user.email },
      this.#jwtConfig.secret,
      {
        expiresIn: this.#jwtConfig.accessTokenExpiry,
        issuer: this.#jwtConfig.issuer,
        audience: this.#jwtConfig.audience,
      }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign({ sub: user._id }, this.#jwtConfig.refreshSecret, {
      expiresIn: this.#jwtConfig.refreshTokenExpiry,
      issuer: this.#jwtConfig.issuer,
    });
  }

  verifyToken(token, secret) {
    return jwt.verify(token, secret);
  }

  async refreshAccessToken(refreshToken) {
    const decoded = this.verifyToken(
      refreshToken,
      this.#jwtConfig.refreshSecret
    );
    const user = await this.#userRepository.findById(decoded.sub);

    if (!user) {
      throw new Error("User not found");
    }

    return this.generateAccessToken(user);
  }
}
