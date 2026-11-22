import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { SECURITY_CONFIG } from '../config/security.js';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Issues a cryptographically signed HMAC-SHA256 JWT
 */
export function issueSessionToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, SECURITY_CONFIG.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
}

/**
 * Verifies HMAC-SHA256 JWT signature and expiration
 */
export function verifySessionToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECURITY_CONFIG.JWT_SECRET, {
      algorithms: ['HS256'],
    }) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Generates high-entropy cryptographic nonce / CSRF token
 */
export function generateSecureNonce(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
