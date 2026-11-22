import { Request, Response, NextFunction } from 'express';
import { SECURITY_CONFIG } from '../config/security.js';

interface RequestLog {
  timestamps: number[];
}

const memoryStore = new Map<string, RequestLog>();

/**
 * In-Memory Sliding Window Counter Rate Limiter
 * Mitigates brute-force parameter fuzzing and automated ID guessing.
 */
export function createRateLimiter(options?: { windowMs?: number; maxRequests?: number }) {
  const windowMs = options?.windowMs || SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS;
  const maxRequests = options?.maxRequests || SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS;

  return function rateLimiter(req: Request, res: Response, next: NextFunction): void {
    const clientIp = (req.ip || req.socket.remoteAddress || 'unknown-client').replace('::ffff:', '');
    const now = Date.now();

    let clientLog = memoryStore.get(clientIp);
    if (!clientLog) {
      clientLog = { timestamps: [] };
      memoryStore.set(clientIp, clientLog);
    }

    // Filter out timestamps outside the sliding window
    clientLog.timestamps = clientLog.timestamps.filter((timestamp) => now - timestamp < windowMs);

    const currentCount = clientLog.timestamps.length;
    const remaining = Math.max(0, maxRequests - currentCount - 1);
    const oldestTimestamp = clientLog.timestamps[0] || now;
    const resetTimeSeconds = Math.ceil((oldestTimestamp + windowMs) / 1000);

    // Set standard rate-limiting headers
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', resetTimeSeconds.toString());

    if (currentCount >= maxRequests) {
      const retryAfterSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
      res.setHeader('Retry-After', Math.max(1, retryAfterSeconds).toString());

      res.status(429).json({
        success: false,
        error: 'TooManyRequests',
        message: 'Rate limit exceeded: Automated burst or ID brute-force behavior detected.',
        retryAfterSeconds: Math.max(1, retryAfterSeconds),
        statusCode: 429,
        securityAdvisory: 'Sliding window defense active against OWASP API4:2023 Unrestricted Resource Consumption.',
      });
      return;
    }

    clientLog.timestamps.push(now);
    next();
  };
}

/**
 * Clear the in-memory store (useful for tests)
 */
export function resetRateLimiterStore(): void {
  memoryStore.clear();
}
