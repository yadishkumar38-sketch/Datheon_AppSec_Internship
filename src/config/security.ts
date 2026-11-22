export const SECURITY_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'datheon_production_ready_hmac_sha256_super_secret_2026',
  JWT_EXPIRES_IN: '1h',
  COOKIE_NAME: process.env.SESSION_COOKIE_NAME || 'datheon_secure_session',
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 1000, // 1 hour
  },
  RATE_LIMIT: {
    WINDOW_MS: 60 * 1000, // 1 minute window
    MAX_REQUESTS: 15,      // 15 requests per minute
  },
};
