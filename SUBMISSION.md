# 📋 Datheon Internship Official Submission & Proof of Work
## Application Security & API Pentesting Internship (Cadence Engine · 4 Weeks Track)

---

### 🎓 Candidate & Program Verification Credentials

| **Verification Parameter** | **Official Record Details** |
|:---|:---|
| **Candidate / Security Researcher** | **Yadish Kumar** |
| **GitHub Handle** | [@yadishkumar38-sketch](https://github.com/yadishkumar38-sketch) |
| **Datheon Application ID** | **`DT-2026-7ZENR`** |
| **Internship Track** | Application Security & API Pentesting Internship |
| **Program Duration** | 4 Weeks (28 Total Calendar Days) |
| **Commencement Date** | November 20, 2026 |
| **Evaluation Deadline** | Friday, December 18, 2026 |
| **Submission Repository** | [https://github.com/yadishkumar38-sketch/Datheon_AppSec_Internship](https://github.com/yadishkumar38-sketch/Datheon_AppSec_Internship) |
| **Public Walkthrough Tag** | **`@Datheon`** |
| **Audit Status** | **100% Complete · 4 of 4 Tasks Implemented & Tested** |

---

### 📦 Deliverables Verification Matrix

| Task # | Module Name | Deliverable Artifacts | Verification Location | Status |
|:---:|:---|:---|:---|:---:|
| **Task 1** | **Black-Box Reconnaissance & IDOR Discovery** | • Executive Disclosure Report<br>• CVSS 3.1 Score (7.5 High)<br>• Standalone Python PoC Fuzzer<br>• Raw cURL Reproduction Command | • [`docs/VULNERABILITY_DISCLOSURE_REPORT.md`](docs/VULNERABILITY_DISCLOSURE_REPORT.md)<br>• [`scripts/idor_poc_fuzzer.py`](scripts/idor_poc_fuzzer.py)<br>• [`reports/idor_fuzz_results.json`](reports/idor_fuzz_results.json) | ✅ **Verified** |
| **Task 2** | **Zero-Trust BOLA Remediation** | • Hardened Route Handler Code<br>• Compound DB Query (`appId` + `ownerId`)<br>• Git Diff Pull Request Patch<br>• Automated Regression Tests | • [`src/routes/hardened/dashboardRoutes.ts`](src/routes/hardened/dashboardRoutes.ts)<br>• [`patches/bola_remediation.diff`](patches/bola_remediation.diff)<br>• [`tests/bola_remediation.test.ts`](tests/bola_remediation.test.ts) | ✅ **Verified (6/6 Tests)** |
| **Task 3** | **Cryptographic Session Security** | • HMAC-SHA256 Token Minting<br>• `HttpOnly; SameSite=Lax; Secure` Cookie<br>• Sliding-Window Rate Limiter<br>• Automated Session Tests | • [`src/routes/hardened/authRoutes.ts`](src/routes/hardened/authRoutes.ts)<br>• [`src/middleware/rateLimiter.ts`](src/middleware/rateLimiter.ts)<br>• [`tests/auth_session.test.ts`](tests/auth_session.test.ts) | ✅ **Verified (5/5 Tests)** |
| **Task 4** | **Public Endpoint Shielding & CI/CD** | • Dynamic PII Masking Engine<br>• Strict Enterprise Security Headers<br>• Passing Automated CI/CD Pipeline<br>• Integration Test Suite | • [`src/utils/piiMasker.ts`](src/utils/piiMasker.ts)<br>• [`src/middleware/securityHeaders.ts`](src/middleware/securityHeaders.ts)<br>• [`ci/security-ci.yml`](ci/security-ci.yml)<br>• [`tests/pii_shielding.test.ts`](tests/pii_shielding.test.ts) | ✅ **Verified (4/4 Tests)** |

---

### 🧪 Automated Test Suite Audit (15/15 Passed)

All 15 automated integration tests pass with 100% compliance:

```text
 ✓ tests/bola_remediation.test.ts (6 tests)
   ✓ 1. Should REJECT unauthenticated requests with HTTP 401 Unauthorized
   ✓ 2. Should ALLOW User A to access their own resource (DT-2026-001)
   ✓ 3. Should REJECT User A attempting to read User B's resource (DT-2026-002) with HTTP 403 Forbidden
   ✓ 4. Should REJECT User B attempting to read User A's resource (DT-2026-001) with HTTP 403 Forbidden
   ✓ 5. Should return HTTP 404 Not Found for non-existent resource IDs without leaking DB traces
   ✓ 6. Demonstrates contrast against vulnerable API v1

 ✓ tests/auth_session.test.ts (5 tests)
   ✓ 1. Should login user and return signed token with HttpOnly, SameSite=Lax cookie
   ✓ 2. Should reject invalid login credentials with HTTP 401
   ✓ 3. Should validate active session on /api/v2/auth/me when valid cookie is provided
   ✓ 4. Should reject tampered or invalid cryptographic tokens with HTTP 401
   ✓ 5. Should clear the session cookie upon logout

 ✓ tests/pii_shielding.test.ts (4 tests)
   ✓ 1. Should dynamically mask email, phone, and name on public verification endpoint
   ✓ 2. Should strictly NOT leak confidential mentor notes or internal grades in public response
   ✓ 3. Should verify strict HTTP Security Headers according to OWASP REST Cheat Sheet
   ✓ 4. Should enforce rate-limiting headers and throttle excessive requests (HTTP 429)

Test Files  3 passed (3)
     Tests  15 passed (15)
```

---

### 📸 LinkedIn Post Assets & Slides

Visual presentation deck and walkthrough template for LinkedIn verification tagging `@Datheon`:
* **Slide 1:** [`assets/linkedin_photos/task1_idor_reconnaissance.svg`](assets/linkedin_photos/task1_idor_reconnaissance.svg)
* **Slide 2:** [`assets/linkedin_photos/task2_bola_remediation.svg`](assets/linkedin_photos/task2_bola_remediation.svg)
* **Slide 3:** [`assets/linkedin_photos/task3_session_security.svg`](assets/linkedin_photos/task3_session_security.svg)
* **Slide 4:** [`assets/linkedin_photos/task4_pii_shielding.svg`](assets/linkedin_photos/task4_pii_shielding.svg)
* **Interactive Viewer & PNG Downloader:** [`assets/linkedin_photos/linkedin_slides_viewer.html`](assets/linkedin_photos/linkedin_slides_viewer.html)
* **LinkedIn Post Template:** [`docs/LINKEDIN_WALKTHROUGH.md`](docs/LINKEDIN_WALKTHROUGH.md)

---

### 🚀 Step-by-Step Evaluator Reproduction Commands

```bash
# 1. Clone the repository
git clone https://github.com/yadishkumar38-sketch/Datheon_AppSec_Internship.git
cd Datheon_AppSec_Internship

# 2. Install dependencies (100% free open-source)
npm install

# 3. Run all automated security integration tests
npm test

# 4. Execute the Task 1 IDOR PoC fuzzer script
python scripts/idor_poc_fuzzer.py
```

---

*Submitted by: Yadish Kumar · Datheon Verified Candidate (ID: DT-2026-7ZENR)*
