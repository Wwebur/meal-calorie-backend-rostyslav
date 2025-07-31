import rateLimit from 'express-rate-limit';

export class RateLimitMiddleware {
  #rateLimitConfig;
  
  constructor(rateLimitConfig) {
    this.#rateLimitConfig = rateLimitConfig;
  }
  
  createLimiter() {
    return rateLimit({
      windowMs: this.#rateLimitConfig.windowMs,
      max: this.#rateLimitConfig.maxRequests,
      message: this.#rateLimitConfig.message
    });
  }
}