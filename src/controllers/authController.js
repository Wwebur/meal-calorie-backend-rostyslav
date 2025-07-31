export class AuthController {
  #authService;
  #cookieConfig;

  constructor(authService, cookieConfig) {
    this.#authService = authService;
    this.#cookieConfig = cookieConfig;
  }

  register = async (req, res) => {
    try {
      const result = await this.#authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const result = await this.#authService.login(req.body);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: this.#cookieConfig.httpOnly,
        secure: process.env.NODE_ENV === "production",
        sameSite: this.#cookieConfig.sameSite,
        maxAge: this.#cookieConfig.maxAge,
      });

      res.json({
        token: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  refresh = async (req, res) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token" });
      }

      const newAccessToken = await this.#authService.refreshAccessToken(
        refreshToken
      );
      res.json({ token: newAccessToken });
    } catch (error) {
      res.status(401).json({ message: "Invalid refresh token" });
    }
  };

  logout = (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  };
}
