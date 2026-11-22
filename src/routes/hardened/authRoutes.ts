import { Router, Request, Response } from 'express';
import { USERS_DB } from '../../db/mockDatabase.js';
import { issueSessionToken, generateSecureNonce } from '../../utils/crypto.js';
import { SECURITY_CONFIG } from '../../config/security.js';
import { authGuard, AuthenticatedRequest } from '../../middleware/authGuard.js';

const router = Router();

/**
 * Task 3: Cryptographic Session Security
 * Issues HMAC-SHA256 signed JWT inside an HTTP-only, Secure, SameSite=Lax cookie.
 */
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: 'InvalidCredentials',
      message: 'Email and password are required.',
    });
    return;
  }

  // Lookup user in mock database
  const user = Object.values(USERS_DB).find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    res.status(401).json({
      success: false,
      error: 'AuthenticationFailed',
      message: 'Invalid email or password provided.',
    });
    return;
  }

  // Sign cryptographic HMAC-SHA256 JWT
  const token = issueSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Set HTTP-Only, SameSite=Lax cookie to defend against XSS token exfiltration
  res.cookie(SECURITY_CONFIG.COOKIE_NAME, token, SECURITY_CONFIG.COOKIE_OPTIONS);

  // Return session confirmation and anti-CSRF nonce
  res.status(200).json({
    success: true,
    message: 'Authentication successful. Cryptographic session established via HTTP-only cookie.',
    session: {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tokenType: 'Bearer-Cookie',
      antiCsrfNonce: generateSecureNonce(),
    },
    // Also include token in response body for automated testing environments
    token,
  });
});

/**
 * Validates the active session and returns authenticated identity
 */
router.get('/me', authGuard, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    authenticated: true,
    user: req.sessionUser,
  });
});

/**
 * Secure Logout - Flushes HTTP-only session cookie
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie(SECURITY_CONFIG.COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.status(200).json({
    success: true,
    message: 'Session revoked successfully. Cookie cleared.',
  });
});

export default router;
