import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { resetRateLimiterStore } from '../src/middleware/rateLimiter.js';

describe('Task 4: Public Endpoint Shielding, PII Masking & Security Headers', () => {
  beforeEach(() => {
    resetRateLimiterStore();
  });

  it('1. Should dynamically mask email, phone, and name on public verification endpoint', async () => {
    const res = await request(app).get('/api/v2/public/verify/DT-2026-7ZENR');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const verification = res.body.verification;
    expect(verification.appId).toBe('DT-2026-7ZENR');

    // Verify email is dynamically masked: e.g. y***********8@gmail.com
    expect(verification.emailMasked).toMatch(/^y\*+.*@gmail\.com$/);
    expect(verification.emailMasked).not.toBe('yadishkumar38@gmail.com');

    // Verify phone is masked: e.g. +XX-XXX-XXX-3210
    expect(verification.phoneMasked).toContain('3210');
    expect(verification.phoneMasked).not.toBe('+91-98765-43210');

    // Verify name is masked
    expect(verification.studentNameMasked).toMatch(/^Y\*+ K\*+$/);
    expect(verification.studentNameMasked).not.toBe('Yadish Kumar');
  });

  it('2. Should strictly NOT leak confidential mentor notes or internal grades in public response', async () => {
    const res = await request(app).get('/api/v2/public/verify/DT-2026-7ZENR');

    expect(res.status).toBe(200);
    expect(res.body.verification.internalEvaluationGrade).toBeUndefined();
    expect(res.body.verification.confidentialMentorNotes).toBeUndefined();
    expect(res.body.confidentialMentorNotes).toBeUndefined();
  });

  it('3. Should verify strict HTTP Security Headers according to OWASP REST Cheat Sheet', async () => {
    const res = await request(app).get('/api/v2/public/verify/DT-2026-7ZENR');

    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['strict-transport-security']).toContain('max-age=31536000');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });

  it('4. Should enforce rate-limiting headers and throttle excessive requests (HTTP 429)', async () => {
    // 10 requests are allowed in the window, 11th should be blocked
    for (let i = 0; i < 10; i++) {
      const res = await request(app).get('/api/v2/public/verify/DT-2026-7ZENR');
      expect(res.status).toBe(200);
      expect(res.headers['x-ratelimit-limit']).toBe('10');
      expect(res.headers['x-ratelimit-remaining']).toBeDefined();
    }

    // 11th request triggers rate limiter
    const blockedRes = await request(app).get('/api/v2/public/verify/DT-2026-7ZENR');
    expect(blockedRes.status).toBe(429);
    expect(blockedRes.body.error).toBe('TooManyRequests');
    expect(blockedRes.headers['retry-after']).toBeDefined();
  });
});
