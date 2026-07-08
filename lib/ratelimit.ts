import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Mock para desenvolvimento (quando Upstash não está configurado)
class MockRatelimit {
  async limit(_key: string) {
    return { success: true };
  }
}

let loginLimiterInstance: Ratelimit | MockRatelimit | null = null;
let registerLimiterInstance: Ratelimit | MockRatelimit | null = null;
let passwordResetLimiterInstance: Ratelimit | MockRatelimit | null = null;

function initLoginLimiter() {
  if (loginLimiterInstance) return loginLimiterInstance;

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    loginLimiterInstance = new MockRatelimit();
  } else {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    loginLimiterInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "ratelimit:login",
    });
  }

  return loginLimiterInstance;
}

function initRegisterLimiter() {
  if (registerLimiterInstance) return registerLimiterInstance;

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    registerLimiterInstance = new MockRatelimit();
  } else {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    registerLimiterInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      analytics: true,
      prefix: "ratelimit:register",
    });
  }

  return registerLimiterInstance;
}

function initPasswordResetLimiter() {
  if (passwordResetLimiterInstance) return passwordResetLimiterInstance;

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    passwordResetLimiterInstance = new MockRatelimit();
  } else {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    passwordResetLimiterInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "30 m"),
      analytics: true,
      prefix: "ratelimit:password-reset",
    });
  }

  return passwordResetLimiterInstance;
}

export const loginLimiter = {
  limit: async (key: string) => initLoginLimiter().limit(key),
};

export const registerLimiter = {
  limit: async (key: string) => initRegisterLimiter().limit(key),
};

export const passwordResetLimiter = {
  limit: async (key: string) => initPasswordResetLimiter().limit(key),
};
