export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string; // bcrypt or mock hash
  name: string;
  role: 'student' | 'lead_auditor' | 'admin';
}

export interface InternshipRecord {
  appId: string;
  ownerId: string;
  studentName: string;
  email: string;
  phone: string;
  program: string;
  status: 'Active & In Progress' | 'Under Review' | 'Completed';
  commencementDate: string;
  deadlineDate: string;
  internalEvaluationGrade: string;
  confidentialMentorNotes: string;
}

export const USERS_DB: Record<string, UserRecord> = {
  'USR-101': {
    id: 'USR-101',
    email: 'alice@datheon-intern.org',
    passwordHash: 'argon2_mock_hash_alice_99182',
    name: 'Alice Harrison',
    role: 'student',
  },
  'USR-102': {
    id: 'USR-102',
    email: 'bob.target@datheon-intern.org',
    passwordHash: 'argon2_mock_hash_bob_77491',
    name: 'Bob Target',
    role: 'student',
  },
  'USR-777': {
    id: 'USR-777',
    email: 'yadishkumar38@gmail.com',
    passwordHash: 'argon2_mock_hash_yadish_2026',
    name: 'Yadish Kumar',
    role: 'student',
  },
};

export const INTERNSHIP_RECORDS: Record<string, InternshipRecord> = {
  'DT-2026-001': {
    appId: 'DT-2026-001',
    ownerId: 'USR-101',
    studentName: 'Alice Harrison',
    email: 'alice@datheon-intern.org',
    phone: '+1-555-019-2834',
    program: 'Application Security & API Pentesting Internship',
    status: 'Active & In Progress',
    commencementDate: '2026-11-20',
    deadlineDate: '2026-12-18',
    internalEvaluationGrade: 'A+',
    confidentialMentorNotes: 'Strong grasp of Wireshark and OWASP Juice Shop.',
  },
  'DT-2026-002': {
    appId: 'DT-2026-002',
    ownerId: 'USR-102',
    studentName: 'Bob Target',
    email: 'bob.target@datheon-intern.org',
    phone: '+1-555-882-9901',
    program: 'Application Security & API Pentesting Internship',
    status: 'Active & In Progress',
    commencementDate: '2026-11-20',
    deadlineDate: '2026-12-18',
    internalEvaluationGrade: 'B-',
    confidentialMentorNotes: 'Pending remediation submission on JWT secret exposure.',
  },
  'DT-2026-7ZENR': {
    appId: 'DT-2026-7ZENR',
    ownerId: 'USR-777',
    studentName: 'Yadish Kumar',
    email: 'yadishkumar38@gmail.com',
    phone: '+91-98765-43210',
    program: 'Application Security & API Pentesting Internship',
    status: 'Active & In Progress',
    commencementDate: '2026-11-20',
    deadlineDate: '2026-12-18',
    internalEvaluationGrade: 'Outstanding',
    confidentialMentorNotes: 'Candidate verified full zero-trust BOLA remediation and cryptographic token defense.',
  },
};

/**
 * Vulnerable Database Lookup (Direct Single Parameter Query)
 * Simulates: SELECT * FROM internship_records WHERE appId = :appId
 */
export function queryVulnerableByAppId(appId: string): InternshipRecord | null {
  return INTERNSHIP_RECORDS[appId] || null;
}

/**
 * Hardened Zero-Trust Database Lookup (Compound Query by Resource ID + Session Owner ID)
 * Simulates: SELECT * FROM internship_records WHERE appId = :appId AND ownerId = :sessionUserId
 */
export function queryHardenedByAppIdAndOwner(appId: string, ownerId: string): InternshipRecord | null {
  const record = INTERNSHIP_RECORDS[appId];
  if (!record) return null;
  if (record.ownerId !== ownerId) {
    return null; // Defense-in-depth: Reject access if ownership does not match
  }
  return record;
}

/**
 * Public Lookup for Verification Services
 */
export function queryPublicRecordByAppId(appId: string): InternshipRecord | null {
  return INTERNSHIP_RECORDS[appId] || null;
}
