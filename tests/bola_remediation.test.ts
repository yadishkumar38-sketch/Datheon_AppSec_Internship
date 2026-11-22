import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { issueSessionToken } from '../src/utils/crypto.js';
import { SECURITY_CONFIG } from '../src/config/security.js';

describe('Task 2: Broken Object Level Authorization (BOLA/IDOR) Remediation Test Suite', () => {
  // Token for User A (Alice - USR-101)
  const tokenUserA = issueSessionToken({
    userId: 'USR-101',
    email: 'alice@datheon-intern.org',
    role: 'student',
  });

  // Token for User B (Bob - USR-102)
  const tokenUserB = issueSessionToken({
    userId: 'USR-102',
    email: 'bob.target@datheon-intern.org',
    role: 'student',
  });

  it('1. Should REJECT unauthenticated requests with HTTP 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v2/dashboard/DT-2026-001');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('AuthenticationRequired');
  });

  it('2. Should ALLOW User A to access their own resource (DT-2026-001)', async () => {
    const res = await request(app)
      .get('/api/v2/dashboard/DT-2026-001')
      .set('Cookie', [`${SECURITY_CONFIG.COOKIE_NAME}=${tokenUserA}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.appId).toBe('DT-2026-001');
    expect(res.body.data.studentName).toBe('Alice Harrison');
    expect(res.body.authorizedFor).toBe('alice@datheon-intern.org');
  });

  it('3. Should REJECT User A attempting to read User B\'s resource (DT-2026-002) with HTTP 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/v2/dashboard/DT-2026-002')
      .set('Cookie', [`${SECURITY_CONFIG.COOKIE_NAME}=${tokenUserA}`]);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('ForbiddenAccess');
    // Ensure no target user data was leaked in the response payload
    expect(res.body.data).toBeUndefined();
  });

  it('4. Should REJECT User B attempting to read User A\'s resource (DT-2026-001) with HTTP 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/v2/dashboard/DT-2026-001')
      .set('Cookie', [`${SECURITY_CONFIG.COOKIE_NAME}=${tokenUserB}`]);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('ForbiddenAccess');
  });

  it('5. Should return HTTP 404 Not Found for non-existent resource IDs without leaking DB traces', async () => {
    const res = await request(app)
      .get('/api/v2/dashboard/DT-2026-999')
      .set('Cookie', [`${SECURITY_CONFIG.COOKIE_NAME}=${tokenUserA}`]);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('ResourceNotFound');
  });

  it('6. Demonstrates contrast against vulnerable API v1 (which leaks data unauthenticated)', async () => {
    // Calling vulnerable endpoint without any cookie or token
    const res = await request(app).get('/api/v1/dashboard?appId=DT-2026-001');

    expect(res.status).toBe(200);
    expect(res.body.studentName).toBe('Alice Harrison');
    expect(res.body.warning).toContain('VULNERABLE ENDPOINT');
  });
});
