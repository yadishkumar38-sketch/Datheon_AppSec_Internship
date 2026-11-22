#!/usr/bin/env python3
"""
Pure Python PDF Report Generator for Datheon AppSec Internship
Generates a compliant PDF 1.4 report without external dependencies.
"""

import sys
import os

class SimplePDF:
    def __init__(self):
        self.objects = []
        self.pages = []
        self.page_streams = []

    def add_page(self):
        stream = []
        self.page_streams.append(stream)
        page_num = len(self.page_streams)
        return stream

    def compile(self) -> bytes:
        # Standard Letter: 612 x 792 pt
        # Objects:
        # 1: Catalog
        # 2: Pages
        # 3..3+N: Page objects
        # Font F1 (Helvetica), Font F2 (Helvetica-Bold), Font F3 (Courier)
        
        obj_id = 1
        catalog_id = 1
        pages_id = 2
        
        num_pages = len(self.page_streams)
        page_obj_ids = [3 + i for i in range(num_pages)]
        font1_id = 3 + num_pages
        font2_id = 4 + num_pages
        font3_id = 5 + num_pages
        content_obj_ids = [6 + num_pages + i for i in range(num_pages)]

        # Object 1: Catalog
        objs = {}
        objs[catalog_id] = f"<< /Type /Catalog /Pages {pages_id} 0 R >>"

        # Object 2: Pages
        kids_str = " ".join([f"{pid} 0 R" for pid in page_obj_ids])
        objs[pages_id] = f"<< /Type /Pages /Kids [{kids_str}] /Count {num_pages} >>"

        # Fonts
        objs[font1_id] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
        objs[font2_id] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
        objs[font3_id] = "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>"

        # Content Streams and Page Objects
        for i in range(num_pages):
            pid = page_obj_ids[i]
            cid = content_obj_ids[i]
            stream_content = "\n".join(self.page_streams[i]).encode("latin1")
            
            objs[pid] = (
                f"<< /Type /Page /Parent {pages_id} 0 R /MediaBox [0 0 612 792] "
                f"/Resources << /Font << /F1 {font1_id} 0 R /F2 {font2_id} 0 R /F3 {font3_id} 0 R >> >> "
                f"/Contents {cid} 0 R >>"
            )
            objs[cid] = f"<< /Length {len(stream_content)} >>\nstream\n".encode("latin1") + stream_content + b"\nendstream"

        # Assemble PDF byte stream
        out = [b"%PDF-1.4\n"]
        xref = []
        total_len = len(out[0])

        all_obj_ids = sorted(objs.keys())
        # Add dummy 0 obj
        xref.append(b"0000000000 65535 f \n")

        for oid in all_obj_ids:
            offset = total_len
            xref.append(f"{offset:010d} 00000 n \n".encode("latin1"))
            val = objs[oid]
            if isinstance(val, str):
                chunk = f"{oid} 0 obj\n{val}\nendobj\n".encode("latin1")
            else:
                chunk = f"{oid} 0 obj\n".encode("latin1") + val + b"\nendobj\n"
            out.append(chunk)
            total_len += len(chunk)

        xref_offset = total_len
        xref_str = f"xref\n0 {len(all_obj_ids) + 1}\n".encode("latin1") + b"".join(xref)
        trailer_str = (
            f"trailer\n<< /Size {len(all_obj_ids) + 1} /Root {catalog_id} 0 R >>\n"
            f"startxref\n{xref_offset}\n%%EOF\n"
        ).encode("latin1")

        out.append(xref_str)
        out.append(trailer_str)
        return b"".join(out)


def build_report():
    pdf = SimplePDF()

    # PAGE 1: Executive Summary & Task 1 (IDOR)
    p1 = pdf.add_page()
    # Dark blue header band
    p1.append("0.05 0.09 0.16 rg") # Dark blue fill
    p1.append("36 700 540 60 re f")
    
    # Header text
    p1.append("BT /F2 18 Tf 1 1 1 rg 50 735 Td (DATHEON APPLICATION SECURITY INTERNSHIP) Tj ET")
    p1.append("BT /F1 10 Tf 0.22 0.74 0.97 rg 50 715 Td (OFFICIAL SUBMISSION & AUDIT REPORT | ID: DT-2026-7ZENR) Tj ET")
    
    # Metadata Block
    p1.append("0.95 0.96 0.98 rg 36 610 540 75 re f")
    p1.append("0.8 0.85 0.9 RG 1 w 36 610 540 75 re s")
    p1.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 50 665 Td (Student / Researcher: ) Tj /F1 10 Tf (Yadish Kumar) Tj ET")
    p1.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 320 665 Td (Datheon Application ID: ) Tj /F1 10 Tf (DT-2026-7ZENR) Tj ET")
    p1.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 50 645 Td (Repository: ) Tj /F1 10 Tf (github.com/yadishkumar38-sketch/Datheon_AppSec_Internship) Tj ET")
    p1.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 50 625 Td (Audit Track: ) Tj /F1 10 Tf (4-Week Cadence | Nov 20 - Dec 18, 2026) Tj /F2 10 Tf 320 625 Td (Status: ) Tj /F2 10 Tf 0 0.5 0.2 rg (100% Verified) Tj ET")

    # Section 1: Task 1
    p1.append("0.93 0.27 0.27 rg 36 575 540 22 re f")
    p1.append("BT /F2 12 Tf 1 1 1 rg 45 582 Td (TASK 1: BLACK-BOX RECONNAISSANCE & IDOR DISCOVERY) Tj ET")

    p1.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 50 550 Td (Vulnerability Classification:) Tj /F1 10 Tf ( OWASP API1:2023 Broken Object Level Authorization) Tj ET")
    p1.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 50 535 Td (CVSS v3.1 Severity Score:) Tj /F2 10 Tf 0.8 0.2 0.2 rg ( 7.5 HIGH ) Tj /F1 9 Tf (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N) Tj ET")
    p1.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 50 520 Td (Target Endpoint:) Tj /F3 9.5 Tf ( GET /api/v1/dashboard?appId={ID} (Unauthenticated)) Tj ET")
    
    p1.append("BT /F1 9.5 Tf 0.2 0.2 0.2 rg 50 495 Td (During black-box testing, candidate dashboard queries were found to be completely unauthenticated.) Tj ET")
    p1.append("BT /F1 9.5 Tf 0.2 0.2 0.2 rg 50 482 Td (An external attacker can iterate through sequential IDs and extract full Personally Identifiable) Tj ET")
    p1.append("BT /F1 9.5 Tf 0.2 0.2 0.2 rg 50 469 Td (Information (PII), contact numbers, email addresses, and confidential mentor grading notes.) Tj ET")

    # Terminal box
    p1.append("0.05 0.07 0.12 rg 50 350 512 105 re f")
    p1.append("BT /F3 8.5 Tf 0.4 0.8 1 rg 60 435 Td ($ curl -s -X GET \"http://localhost:3000/api/v1/dashboard?appId=DT-2026-001\") Tj ET")
    p1.append("BT /F3 8 Tf 0.2 0.9 0.4 rg 60 415 Td (HTTP/1.1 200 OK | Content-Type: application/json) Tj ET")
    p1.append("BT /F3 8 Tf 0.9 0.9 0.9 rg 60 395 Td ({ \"appId\": \"DT-2026-001\", \"studentName\": \"Alice Harrison\",) Tj ET")
    p1.append("BT /F3 8 Tf 0.9 0.9 0.9 rg 60 380 Td (  \"email\": \"alice@datheon-intern.org\", \"phone\": \"+1-555-019-2834\",) Tj ET")
    p1.append("BT /F3 8 Tf 0.9 0.9 0.9 rg 60 365 Td (  \"internalEvaluationGrade\": \"A+\", \"notes\": \"Strong grasp of Wireshark...\" }) Tj ET")

    # Section 2: Task 2
    p1.append("0.06 0.72 0.5 rg 36 305 540 22 re f")
    p1.append("BT /F2 12 Tf 1 1 1 rg 45 312 Td (TASK 2: ZERO-TRUST BOLA REMEDIATION (NODE.JS / TYPESCRIPT)) Tj ET")

    p1.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 50 280 Td (Defense Architecture:) Tj /F1 10 Tf ( Compound Database Filtering + authGuard Middleware) Tj ET")
    p1.append("BT /F1 9.5 Tf 0.2 0.2 0.2 rg 50 260 Td (1. Defensive authGuard verifies HMAC-SHA256 session token from HttpOnly cookie (rejects with 401).) Tj ET")
    p1.append("BT /F1 9.5 Tf 0.2 0.2 0.2 rg 50 245 Td (2. Compound database query enforces: SELECT * WHERE id = :appId AND owner_id = :sessionUserId.) Tj ET")
    p1.append("BT /F1 9.5 Tf 0.2 0.2 0.2 rg 50 230 Td (3. Cross-tenant queries by User A to read User B's record fail gracefully with HTTP 403 Forbidden.) Tj ET")
    p1.append("BT /F1 9.5 Tf 0.2 0.2 0.2 rg 50 215 Td (4. Non-existent queries return HTTP 404 without leaking internal schema or stack traces.) Tj ET")

    # Pass badge
    p1.append("0.9 0.97 0.92 rg 50 160 512 40 re f")
    p1.append("0.1 0.6 0.3 RG 1 w 50 160 512 40 re s")
    p1.append("BT /F2 10 Tf 0.1 0.5 0.2 rg 65 182 Td (VITEST INTEGRATION TEST PROOF: 6 / 6 TESTS PASSING) Tj ET")
    p1.append("BT /F1 9 Tf 0.2 0.4 0.2 rg 65 168 Td (Verified cross-tenant rejection, 401 unauthorized handling, and clean error sanitization.) Tj ET")

    p1.append("BT /F1 8 Tf 0.5 0.5 0.5 rg 260 50 Td (Page 1 of 2 - Datheon Internship Official Report) Tj ET")

    # PAGE 2: Task 3, Task 4 & Verification Checklist
    p2 = pdf.add_page()
    p2.append("0.05 0.09 0.16 rg 36 715 540 45 re f")
    p2.append("BT /F2 15 Tf 1 1 1 rg 50 732 Td (CRYPTOGRAPHIC SECURITY & DAST AUDIT (TASKS 3 & 4)) Tj ET")

    # Section 3: Task 3
    p2.append("0.55 0.36 0.96 rg 36 675 540 22 re f")
    p2.append("BT /F2 12 Tf 1 1 1 rg 45 682 Td (TASK 3: CRYPTOGRAPHIC SESSION SECURITY & RATE LIMITING) Tj ET")
    
    p2.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 50 650 Td (Storage Architecture:) Tj /F1 10 Tf ( Replaced localStorage with HttpOnly; SameSite=Lax; Secure cookies.) Tj ET")
    p2.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 50 635 Td (Cryptographic Defense:) Tj /F1 10 Tf ( HMAC-SHA256 signed JWT with 1-hour expiration and token rotation.) Tj ET")
    p2.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 50 620 Td (Sliding-Window Limiter:) Tj /F1 10 Tf ( In-memory token bucket throttling automated parameter fuzzing.) Tj ET")
    p2.append("BT /F1 9 Tf 0.3 0.3 0.3 rg 50 600 Td (Sets X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset. Excessive bursts yield HTTP 429.) Tj ET")

    # Section 4: Task 4
    p2.append("0.15 0.5 0.9 rg 36 560 540 22 re f")
    p2.append("BT /F2 12 Tf 1 1 1 rg 45 567 Td (TASK 4: PUBLIC ENDPOINT SHIELDING & AUTOMATED DAST CI/CD) Tj ET")

    p2.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 50 535 Td (Dynamic String Masking:) Tj /F1 10 Tf ( Student lookups dynamically redact PII before transmission:) Tj ET")
    p2.append("BT /F3 9.5 Tf 0.1 0.4 0.7 rg 65 515 Td (Email: yadishkumar38@gmail.com  ->  y***********8@gmail.com) Tj ET")
    p2.append("BT /F3 9.5 Tf 0.1 0.4 0.7 rg 65 500 Td (Phone: +91-98765-43210          ->  +XX-XXX-XXX-3210) Tj ET")
    p2.append("BT /F3 9.5 Tf 0.1 0.4 0.7 rg 65 485 Td (Name:  Yadish Kumar             ->  Y***** K****) Tj ET")
    p2.append("BT /F1 9.5 Tf 0.2 0.2 0.2 rg 50 465 Td (Confidential mentor grades and internal feedback notes are stripped completely.) Tj ET")

    p2.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 50 440 Td (Security Headers:) Tj /F1 9.5 Tf ( Content-Security-Policy, HSTS (max-age=31536000), X-Frame-Options: DENY) Tj ET")
    p2.append("BT /F2 10 Tf 0.1 0.1 0.2 rg 50 425 Td (Automated CI/CD:) Tj /F1 9.5 Tf ( GitHub Actions workflow executing type checking, test suites, and secret scanning.) Tj ET")

    # Complete Test Suite Summary
    p2.append("0.96 0.97 0.98 rg 36 260 540 145 re f")
    p2.append("0.8 0.85 0.9 RG 1 w 36 260 540 145 re s")
    p2.append("BT /F2 12 Tf 0.1 0.5 0.2 rg 50 380 Td (OFFICIAL SUBMISSION VERIFICATION CHECKLIST (15/15 PASS)) Tj ET")
    p2.append("BT /F2 9.5 Tf 0.2 0.2 0.2 rg 50 360 Td ([x] Task 1:) Tj /F1 9.5 Tf ( Black-Box IDOR Fuzzing PoC script + CVSS 3.1 Disclosure Report) Tj ET")
    p2.append("BT /F2 9.5 Tf 0.2 0.2 0.2 rg 50 340 Td ([x] Task 2:) Tj /F1 9.5 Tf ( Hardened route handler + Git diff patch + 6 Vitest integration tests) Tj ET")
    p2.append("BT /F2 9.5 Tf 0.2 0.2 0.2 rg 50 320 Td ([x] Task 3:) Tj /F1 9.5 Tf ( HttpOnly cookie authentication + Sliding window rate limiter (5 tests)) Tj ET")
    p2.append("BT /F2 9.5 Tf 0.2 0.2 0.2 rg 50 300 Td ([x] Task 4:) Tj /F1 9.5 Tf ( Dynamic PII masking + Security headers + CI/CD pipeline (4 tests)) Tj ET")
    p2.append("BT /F2 9.5 Tf 0.2 0.2 0.2 rg 50 280 Td ([x] LinkedIn:) Tj /F1 9.5 Tf ( Executive walkthrough post tagging @Datheon + 4 slide images) Tj ET")

    # Sign-off box
    p2.append("0.05 0.09 0.16 rg 36 120 540 115 re f")
    p2.append("BT /F2 11 Tf 0.22 0.74 0.97 rg 50 210 Td (SUBMISSION STATEMENT & INTEGRITY HASH) Tj ET")
    p2.append("BT /F1 9 Tf 0.9 0.9 0.9 rg 50 190 Td (I hereby submit this completed application security audit and zero-trust engineering proof of work) Tj ET")
    p2.append("BT /F1 9 Tf 0.9 0.9 0.9 rg 50 175 Td (for the Datheon Application Security & API Pentesting Internship.) Tj ET")
    p2.append("BT /F2 9.5 Tf 1 1 1 rg 50 150 Td (Candidate: Yadish Kumar) Tj /F1 9.5 Tf 220 150 Td (Datheon Application ID: DT-2026-7ZENR) Tj ET")
    p2.append("BT /F3 8.5 Tf 0.38 0.74 0.97 rg 50 135 Td (GitHub Repo: https://github.com/yadishkumar38-sketch/Datheon_AppSec_Internship) Tj ET")

    p2.append("BT /F1 8 Tf 0.5 0.5 0.5 rg 260 50 Td (Page 2 of 2 - Datheon Internship Official Report) Tj ET")

    return pdf.compile()

if __name__ == "__main__":
    out_dir = r"C:\Users\YADISH KUMAR M\Datheon_AppSec_Internship"
    out_path = os.path.join(out_dir, "Datheon_AppSec_Security_Audit_Report.pdf")
    pdf_bytes = build_report()
    with open(out_path, "wb") as f:
        f.write(pdf_bytes)
    print(f"Successfully generated PDF: {out_path} ({len(pdf_bytes)} bytes)")
