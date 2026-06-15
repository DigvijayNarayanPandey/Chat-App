// In-memory store for rate limiting
// Note: For production with multiple server instances, use Redis or similar distributed store
const rateLimitMap = new Map();

// Window size in milliseconds (15 minutes)
const WINDOW_MS = 15 * 60 * 1000;
// Max requests per window for auth endpoints
const MAX_REQUESTS = 5;

export const authRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  if (!ip) return next();

  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Get or create request history for this IP
  let history = rateLimitMap.get(ip) || [];

  // Remove old requests outside the window
  history = history.filter(timestamp => timestamp > windowStart);

  // Check if limit exceeded
  if (history.length >= MAX_REQUESTS) {
    return res.status(429).json({
      message: "Too many requests, please try again later.",
    });
  }

  // Add current request timestamp
  history.push(now);
  rateLimitMap.set(ip, history);

  // Clean up old entries periodically (every 100 requests)
  if (rateLimitMap.size % 100 === 0) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const validTimestamps = timestamps.filter(t => t > windowStart);
      if (validTimestamps.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, validTimestamps);
      }
    }
  }

  next();
};