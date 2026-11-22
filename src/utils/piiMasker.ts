import { InternshipRecord } from '../db/mockDatabase.js';

export interface MaskedPublicVerificationResponse {
  appId: string;
  studentNameMasked: string;
  emailMasked: string;
  phoneMasked: string;
  program: string;
  status: string;
  commencementDate: string;
  deadlineDate: string;
  verificationBadge: string;
  verifiedAt: string;
}

/**
 * Masks email address: j***e@domain.com
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***';
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  const first = localPart[0];
  const last = localPart[localPart.length - 1];
  const maskedMiddle = '*'.repeat(Math.max(1, localPart.length - 2));
  return `${first}${maskedMiddle}${last}@${domain}`;
}

/**
 * Masks phone number: +1-555-***-**34
 */
export function maskPhone(phone: string): string {
  if (!phone) return '***';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '***-***-****';
  const visibleLast4 = digits.slice(-4);
  return `+XX-XXX-XXX-${visibleLast4}`;
}

/**
 * Masks full name: "Alice Harrison" -> "A**** H*******"
 */
export function maskName(name: string): string {
  if (!name) return '***';
  return name
    .split(' ')
    .map((part) => {
      if (part.length <= 1) return part;
      return part[0] + '*'.repeat(part.length - 1);
    })
    .join(' ');
}

/**
 * Sanitizes and strips all PII and confidential internal fields from public record
 */
export function maskPublicRecord(record: InternshipRecord): MaskedPublicVerificationResponse {
  return {
    appId: record.appId,
    studentNameMasked: maskName(record.studentName),
    emailMasked: maskEmail(record.email),
    phoneMasked: maskPhone(record.phone),
    program: record.program,
    status: record.status,
    commencementDate: record.commencementDate,
    deadlineDate: record.deadlineDate,
    verificationBadge: 'VERIFIED_DATHEON_STUDENT_CREDENTIAL',
    verifiedAt: new Date().toISOString(),
  };
}
