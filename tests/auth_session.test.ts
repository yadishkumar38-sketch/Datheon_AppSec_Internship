import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { SECURITY_CONFIG } from '../src/config/security.js';
import { resetRateLimiterStore } from '../src/middleware/rateLimiter.js';

describe('Task 3: Cryptographic Session Security & Rate Limiting Test Suite', () => {
  beforeEach(() => {
    resetRateLimiterStore();
  });

  it('1. Should login user and return signed token with HttpOnly, SameSite=Lax cookie', async () => {
    const res = await request(app)
      .post('/api/v2/auth/login')
      .send({
        email: 'alice@datheon-intern.org',
        password: 'any_valid_password',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.session.userId).toBe('USR-101');

    // Verify Set-Cookie header contains HttpOnly and SameSite=Lax
    const setCookieHeaders = res.headers['set-cookie'];
    expect(setCookieHeaders).toBeDefined();
    const cookieStr = Array.isArray(setCookieHeaders) ? setCookieHeaders.join(';') : (setCookieHeaders as string);
    expect(cookieStr).toContain(SECURITY_CONFIG.COOKIE_NAME);
    expect(cookieStr.toLowerCase()).toContain('httponly');
    expect(cookieStr.toLowerCase()).toContain('samesite=lax');
  });

  it('2. Should reject invalid login credentials with HTTP 401', async () => {
    const res = await request(app)
      .post('/api/v2/auth/login')
      .send({
        email: 'attacker@evil.com',
        password: 'wrong_password',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('AuthenticationFailed');
  });

  it('3. Should validate active session on /api/v2/auth/me when valid cookie is provided', async () => {
    // Perform login first
    const loginRes = await request(app)
      .post('/api/v2/auth/login')
      .send({
        email: 'yadishkumar38@gmail.com',
        password: 'password_yadish',
      });

    const cookie = loginRes.headers['set-cookie'];

    const meRes = await request(app)
      .get('/api/v2/auth/me')
      .set('Cookie', cookie);

    expect(meRes.status).toBe(200);
    expect(meRes.body.authenticated).toBe(true);
    expect(meRes.body.user.userId).toBe('USR-777');
    expect(meRes.body.user.email).toBe('yadishkumar38@gmail.com');
  });

  it('4. Should reject tampered or invalid cryptographic tokens with HTTP 401', async () => {
    const forgedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.tampered_signature_xyz';

    const res = await request(app)
      .get('/api/v2/auth/me')
      .set('Cookie', [`${SECURITY_CONFIG.COOKIE_NAME}=${forgedToken}`]);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('InvalidSessionToken');
  });

  it('5. Should clear the session cookie upon logout', async () => {
    const res = await request(app).post('/api/v2/auth/logout');

    expect(res.status).toBe(200);
    const setCookieHeaders = res.headers['set-cookie'];
    expect(setCookieHeaders).toBeDefined();
    const cookieStr = Array.isArray(setCookieHeaders) ? setCookieHeaders.join(';') : (setCookieHeaders as string);
    // Clearing a cookie sets Max-Age=0 or expires in the past
    expect(cookieStr).toMatch(/expires=|max-age=0/i);
  });
});
