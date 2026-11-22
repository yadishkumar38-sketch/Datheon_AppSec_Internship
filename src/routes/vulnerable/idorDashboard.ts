import { Router, Request, Response } from 'express';
import { queryVulnerableByAppId } from '../../db/mockDatabase.js';

const router = Router();

/**
 * @vulnerability OWASP API1:2023 - Broken Object Level Authorization (BOLA) / IDOR
 * Blind parameter lookup without session verification or ownership checks.
 * An attacker can fuzz '?appId=DT-2026-001' or '?appId=DT-2026-002' and leak all PII.
 */
router.get('/dashboard', (req: Request, res: Response) => {
  const appId = (req.query.appId as string) || (req.query.id as string);

  if (!appId) {
    res.status(400).json({
      error: 'MissingParameter',
      message: 'Query parameter appId is required (e.g. ?appId=DT-2026-001)',
    });
    return;
  }

  // Blind lookup in database directly from user-supplied ID
  const record = queryVulnerableByAppId(appId);

  if (!record) {
    res.status(404).json({
      error: 'NotFound',
      message: `Record with appId '${appId}' does not exist in the database.`,
    });
    return;
  }

  // Flaw: Unauthenticated leakage of personal and confidential mentor notes
  res.status(200).json({
    warning: 'VULNERABLE ENDPOINT: This route returns unauthenticated sensitive data without session checks.',
    appId: record.appId,
    studentName: record.studentName,
    email: record.email,
    phone: record.phone,
    program: record.program,
    status: record.status,
    commencementDate: record.commencementDate,
    deadlineDate: record.deadlineDate,
    internalEvaluationGrade: record.internalEvaluationGrade,
    confidentialMentorNotes: record.confidentialMentorNotes,
  });
});

export default router;
