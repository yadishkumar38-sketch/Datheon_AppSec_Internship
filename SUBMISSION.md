# Datheon Application Security & API Pentesting Internship
## Capstone Security Audit & Proof of Work Submission

---

### Candidate & Program Verification Details

* Candidate Name: Yadish Kumar
* GitHub Username: yadishkumar38-sketch
* Datheon Application ID: DT-2026-7ZENR
* Internship Track: Application Security & API Pentesting Internship
* Program Duration: 4 Weeks (28 Total Calendar Days · Cadence Engine)
* Commencement Date: November 20, 2026
* Evaluation Cutoff / Deadline: December 18, 2026
* Audit Status: 100% Complete · All 4 Modules Implemented & Verified

---

### Technical Audit & Deliverables Details

#### Task 1: Black-Box Reconnaissance & URL Parameter Fuzzing (IDOR Discovery)
* Vulnerability Classification: OWASP API1:2023 - Broken Object Level Authorization (BOLA / IDOR) · CWE-639
* CVSS v3.1 Severity Rating: 7.5 HIGH (Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N)
* Vulnerable Endpoint: GET /api/v1/dashboard?appId={ID}
* Flaw Analysis: The backend blindly accepts user-controlled identifiers from query parameters without verifying session context or record ownership.
* PoC Reproduction Command (Stripped Headers):
  curl -s -X GET "http://localhost:3000/api/v1/dashboard?appId=DT-2026-001" -H "Accept: application/json"
* PoC Execution: Automated Python fuzzer (scripts/idor_poc_fuzzer.py) strips all session cookies and extracts unauthenticated student PII, contact numbers, and confidential grading notes (reports/idor_fuzz_results.json).
* Documentation: Complete disclosure report documented in docs/VULNERABILITY_DISCLOSURE_REPORT.md.

#### Task 2: Remediating Broken Object Level Authorization (BOLA) in Node.js / TypeScript
* Defensive Architecture: Replaced naive single-parameter queries with defensive authGuard middleware and compound database queries filtering by BOTH the resource ID and authenticated session owner ID:
  SELECT * FROM records WHERE appId = :appId AND ownerId = :sessionUserId
* Graceful Rejection: Cross-tenant attempts by User A to read User B's record fail gracefully with HTTP 403 Forbidden without database schema or stack trace leakage. Missing session context fails with HTTP 401 Unauthorized.
* Deliverables: Hardened route handler (src/routes/hardened/dashboardRoutes.ts), pull request diff (patches/bola_remediation.diff), and automated integration tests (tests/bola_remediation.test.ts).

#### Task 3: Cryptographic Session Security & Sliding-Window Rate Limiting
* Session Storage: Completely replaced vulnerable client-side storage (localStorage) with cryptographically signed HMAC-SHA256 tokens stored inside HttpOnly; SameSite=Lax; Secure cookies, neutralizing Cross-Site Scripting (XSS) token exfiltration.
* Anti-Fuzzing Defense: In-memory sliding window counter rate limiter enforcing RFC standard headers:
  - X-RateLimit-Limit: 15
  - X-RateLimit-Remaining
  - X-RateLimit-Reset
  Excessive rapid bursts trigger HTTP 429 Too Many Requests with Retry-After: 60.
* Deliverables: Session authentication module (src/routes/hardened/authRoutes.ts) and sliding-window rate limiter middleware (src/middleware/rateLimiter.ts).

#### Task 4: Public Endpoint Shielding, Dynamic PII Masking & DAST CI/CD
* Zero-Leakage Public Verification: Engineered dynamic string masking utility for credential lookups (verifying ID DT-2026-7ZENR):
  - Email: yadishkumar38@gmail.com -> y***********8@gmail.com
  - Phone: +91-98765-43210 -> +XX-XXX-XXX-3210
  - Name: Yadish Kumar -> Y***** K****
  - Confidential mentor notes and evaluation grades are stripped entirely.
* Enterprise Security Headers: Configured strict OWASP REST headers (Content-Security-Policy, Strict-Transport-Security: max-age=31536000, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin).
* CI/CD Security: Automated GitHub Actions pipeline (ci/security-ci.yml) enforcing static analysis, secret non-disclosure checks, and test suites.

---

### Automated Integration Test Audit (15/15 Tests Passing)

* Task 2 BOLA Remediation Tests: 6 passed (401 unauth rejection, owner access allow, cross-tenant 403 rejection, 404 sanitization, v1 vs v2 contrast)
* Task 3 Cryptographic Session Tests: 5 passed (HttpOnly cookie verification, invalid credential rejection, session validation on /auth/me, forged token rejection, logout cookie clearance)
* Task 4 PII Masking & Header Tests: 4 passed (Dynamic email/phone/name masking, confidential field stripping, OWASP security headers check, sliding window rate limit HTTP 429 throttle)

Total Test Execution: 15 passed, 0 failed (100% compliance)

---

### Evaluator Quick Reproduction Steps

1. Clone repository
   git clone https://github.com/yadishkumar38-sketch/Datheon_AppSec_Internship.git
   cd Datheon_AppSec_Internship

2. Install dependencies (100% free open-source)
   npm install

3. Run automated security test suite
   npm test

4. Execute Task 1 IDOR PoC reconnaissance script
   python scripts/idor_poc_fuzzer.py

---

### Project Repository URL
https://github.com/yadishkumar38-sketch/Datheon_AppSec_Internship
