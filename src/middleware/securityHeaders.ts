import { Request, Response, NextFunction } from 'express';

/**
 * Enterprise HTTP Security Headers Middleware
 * Enforces Zero-Trust browser-side defenses according to OWASP REST Security Cheat Sheet.
 */
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent Clickjacking (framing attacks)
  res.setHeader('X-Frame-Options', 'DENY');

  // Strict Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
  );

  // HTTP Strict Transport Security (HSTS) - 1 year with subdomains and preload
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Referrer Policy to prevent credential leakage via Referer header
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy to disable unused hardware APIs
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // Modern browser XSS filter disablement (as recommended by OWASP in favor of strict CSP)
  res.setHeader('X-XSS-Protection', '0');

  // Cache-Control to prevent caching of sensitive responses in proxies/browsers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');

  next();
}
