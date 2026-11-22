import { Request, Response, NextFunction } from 'express';
import { SECURITY_CONFIG } from '../config/security.js';
import { verifySessionToken, TokenPayload } from '../utils/crypto.js';

export interface AuthenticatedRequest extends Request {
  sessionUser?: TokenPayload;
}

/**
 * Defensive Authentication Guard
 * Validates session identity from cryptographically signed HTTP-only cookies
 * or Bearer Authorization header. Rejects missing/tampered sessions with 401.
 */
export function authGuard(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  // 1. Extract token from HTTP-only cookie (Primary secure mechanism)
  let token = req.cookies?.[SECURITY_CONFIG.COOKIE_NAME];

  // 2. Fallback to Authorization Bearer header (for automated API/CLI testing)
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  // 3. Reject unauthenticated requests immediately
  if (!token) {
    res.status(401).json({
      success: false,
      error: 'AuthenticationRequired',
      message: 'Access denied. Valid cryptographic session cookie or Bearer token is required.',
      statusCode: 401,
      remediation: 'Authenticate via POST /api/v2/auth/login to establish an HTTP-only secure session.',
    });
    return;
  }

  // 4. Verify cryptographic HMAC-SHA256 signature and expiration
  const decoded = verifySessionToken(token);
  if (!decoded) {
    res.status(401).json({
      success: false,
      error: 'InvalidSessionToken',
      message: 'Session token signature verification failed or token has expired.',
      statusCode: 401,
    });
    return;
  }

  // 5. Attach authenticated user session context
  req.sessionUser = decoded;
  next();
}
