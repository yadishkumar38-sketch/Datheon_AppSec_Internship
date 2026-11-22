# 📢 LinkedIn Executive AppSec Project Walkthrough

> **Submission Requirement:** Share an executive AppSec walkthrough on LinkedIn tagging `@Datheon`.
> Below is a production-ready, professional post template tailored for **Yadish Kumar** (Application ID: `DT-2026-7ZENR`). You can copy, customize, and post this directly to LinkedIn!

---

### 📸 Visual Slide Deck for LinkedIn (Photos to Attach)

Attach these 4 slide images to your LinkedIn post as an image gallery or carousel:

| Slide # | Module | Image File | Description |
|:---:|:---|:---|:---|
| **Slide 1** | **Task 1: IDOR Discovery** | [`task1_idor_reconnaissance.svg`](../assets/linkedin_photos/task1_idor_reconnaissance.svg) | CVSS 7.5 High, Terminal cURL fuzzing, unauthenticated PII leak |
| **Slide 2** | **Task 2: BOLA Remediation** | [`task2_bola_remediation.svg`](../assets/linkedin_photos/task2_bola_remediation.svg) | Before vs After Code Diff, compound DB query, Vitest 6/6 tests passing |
| **Slide 3** | **Task 3: Session Security** | [`task3_session_security.svg`](../assets/linkedin_photos/task3_session_security.svg) | HttpOnly cookie vs localStorage, HMAC-SHA256, Sliding Window Rate Limiter (HTTP 429) |
| **Slide 4** | **Task 4: PII Shielding** | [`task4_pii_shielding.svg`](../assets/linkedin_photos/task4_pii_shielding.svg) | Dynamic string masking for `DT-2026-7ZENR`, Enterprise CSP/HSTS headers, CI/CD Pipeline |

> 💡 **Quick PNG Downloader:** Open [`assets/linkedin_photos/linkedin_slides_viewer.html`](../assets/linkedin_photos/linkedin_slides_viewer.html) in your browser (Chrome or Edge) and click **"Download This Slide as PNG"** to get crystal-clear 1200x675 PNG images ready for LinkedIn upload!

---

### 📝 LinkedIn Post Template

```markdown
🛡️ Thrilled to complete the Application Security & API Pentesting Internship with @Datheon! 

Over 60% of modern cloud and enterprise API breaches originate from Broken Object Level Authorization (BOLA/IDOR) and unauthenticated data exposure. During this intensive engineering track, I audited, exploited, remediated, and engineered zero-trust defenses across four core security modules:

🔍 Task 1: Black-Box Reconnaissance & URL Parameter Fuzzing (IDOR Discovery)
• Identified unauthenticated query parameter leakage on candidate dashboard routes (?appId=DT-2026-001).
• Authored a complete Responsible Vulnerability Disclosure Report with CVSS v3.1 calculation (Base Score: 7.5 HIGH | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N).
• Developed an autonomous Python PoC fuzzer reproducing unauthenticated PII exfiltration without cookies or headers.

🛠️ Task 2: Remediating Broken Object Level Authorization (BOLA/IDOR) in Node.js / TypeScript
• Re-engineered backend endpoints from naive single-parameter lookups into compound database queries filtering by BOTH resource ID and authenticated session owner ID.
• Enforced graceful HTTP 401/403 rejection without database stack trace or schema disclosure.
• Built automated Vitest/Jest integration test suites proving cross-tenant isolation (User A cannot access User B's record).

🔐 Task 3: Cryptographic Session Security & HTTP-Only Cookie Defense
• Replaced vulnerable client-side storage (localStorage) with cryptographically signed HMAC-SHA256 tokens stored in HttpOnly, Secure, SameSite=Lax cookies to completely neutralize Cross-Site Scripting (XSS) token exfiltration.
• Implemented sliding-window rate limiting with standard RFC headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset) to thwart automated brute-force parameter fuzzing.

🌐 Task 4: Public Endpoint Shielding, PII Masking & Automated DAST Pipeline
• Designed a zero-leakage public credential lookup service with dynamic string masking algorithms (e.g. j***e@domain.com, +XX-XXX-XXX-3210).
• Configured enterprise HTTP security headers (Content-Security-Policy, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy).
• Engineered a CI/CD GitHub Actions security pipeline for automated test execution, static analysis, and credential leak prevention.

📁 Full Source Code, PoC Fuzzers, Patch Diffs & Disclosure Reports:
https://github.com/yadishkumar38-sketch/Datheon_AppSec_Internship

Student Application ID: DT-2026-7ZENR

Huge thank you to @Datheon for this hands-on, high-impact cybersecurity curriculum!

#ApplicationSecurity #APISecurity #Pentesting #OWASP #Cybersecurity #IDOR #BOLA #ZeroTrust #NodeJS #TypeScript #Datheon #DevSecOps #BugBounty
```

---

### 💡 Video Walkthrough Recording Checklist (If recording a 1-2 min screen demo)
1. **Show Terminal Running Tests:** Run `npm test` showing all 15 tests passing across Task 2, Task 3, and Task 4.
2. **Show Task 1 Exploit:** Run `python scripts/idor_poc_fuzzer.py` showing how unauthenticated requests in API v1 return sensitive PII.
3. **Show Task 2 Defense:** Demonstrate `GET /api/v2/dashboard/DT-2026-002` returning `403 Forbidden` for unauthorized users.
4. **Show GitHub Repo:** Highlight the README with architecture diagrams and the `.github/workflows/security-ci.yml` pipeline.
