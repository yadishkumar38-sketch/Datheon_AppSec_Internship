# 🏛️ Zero-Trust API Security Architecture

This document provides a technical deep-dive into the architectural decisions, threat models, and security controls engineered for the **Datheon Application Security & API Pentesting Internship**.

---

## 1. Threat Model & Attack Vectors

| Attack Vector | Vulnerable Pattern (v1) | Mitigated Architecture (v2) | OWASP Reference |
|:---|:---|:---|:---|
| **Broken Object Level Authorization (BOLA)** | Single-parameter lookup `WHERE appId = ?` | Compound query `WHERE appId = ? AND ownerId = ?` | OWASP API1:2023 |
| **XSS Token Exfiltration** | JWT stored in `localStorage` or `sessionStorage` | Stored exclusively in `HttpOnly; SameSite=Lax; Secure` cookie | OWASP API2:2023 |
| **Automated Parameter Fuzzing** | Unthrottled API endpoint | In-memory sliding window rate limiter with `X-RateLimit-*` headers | OWASP API4:2023 |
| **Public PII Exposure** | Plaintext email, phone, and internal notes returned | Dynamic string masking (`j***e@domain.com`, `+XX-XXX-XXX-3210`) | OWASP API3:2023 |
| **Clickjacking / MIME Sniffing** | Default Express headers | Strict CSP, HSTS, `X-Frame-Options: DENY`, `nosniff` | OWASP REST Security |

---

## 2. Authentication & Session Lifecycles

```
+-------------+                 +----------------------+                 +-------------------------+
|   Client    |                 |   Auth Route (v2)    |                 |  Protected Routes (v2)  |
+-------------+                 +----------------------+                 +-------------------------+
       |                                    |                                         |
       |  1. POST /api/v2/auth/login        |                                         |
       |     (email + password)             |                                         |
       |----------------------------------->|                                         |
       |                                    |                                         |
       |                                    |-- Verify Credentials                    |
       |                                    |-- Sign HMAC-SHA256 JWT                  |
       |                                    |                                         |
       |  2. Set-Cookie: datheon_session    |                                         |
       |     (HttpOnly, Secure, Lax)        |                                         |
       |<-----------------------------------|                                         |
       |                                                                              |
       |  3. GET /api/v2/dashboard/DT-2026-001 (Cookie included automatically)        |
       |----------------------------------------------------------------------------->|
       |                                                                              |
       |                                                                              |-- authGuard()
       |                                                                              |   - Verify HS256
       |                                                                              |   - Check Expiry
       |                                                                              |-- Compound Query
       |                                                                              |   (appId + ownerId)
       |                                                                              |
       |  4. HTTP 200 OK (Authorized Record) OR HTTP 403 (Cross-tenant rejection)     |
       |<-----------------------------------------------------------------------------|
```

---

## 3. Defense-in-Depth Engineering Principles Applied

1. **Least Privilege & Zero-Trust:** Every route verifies authorization at the request boundary and within the database query itself.
2. **Fail-Safe Defaults:** If a query fails or returns no matching row for that user, access is denied (`403 Forbidden` or `404 Not Found`).
3. **Information Hiding:** Internal database stack traces and error messages are suppressed by a centralized error handler.
4. **Dynamic Data Minimization:** Public lookup endpoints strip all internal notes and dynamically mask personal identifiers.
