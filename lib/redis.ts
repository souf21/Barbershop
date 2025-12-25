// lib/redis.ts
import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

declare global {
  // eslint-disable-next-line no-var
  var redisClient: Redis | undefined;
}

const client = global.redisClient ?? new Redis(REDIS_URL);

client.on("connect", () => console.log("✅ Redis connected"));
client.on("error", (err) => console.error("❌ Redis error:", err));

if (!global.redisClient) {
  global.redisClient = client;
}

export default client;
