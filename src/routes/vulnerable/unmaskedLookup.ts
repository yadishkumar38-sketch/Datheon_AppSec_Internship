import { Router, Request, Response } from 'express';
import { queryPublicRecordByAppId } from '../../db/mockDatabase.js';

const router = Router();

/**
 * @vulnerability OWASP API3:2023 - Broken Object Property Level Authorization & Data Exposure
 * Public verification endpoint leaking full plaintext PII (phone, email, mentor evaluations).
 */
router.get('/public/verify/:appId', (req: Request, res: Response) => {
  const { appId } = req.params;
  const record = queryPublicRecordByAppId(appId);

  if (!record) {
    res.status(404).json({ error: 'RecordNotFound', message: `No credential found for ${appId}` });
    return;
  }

  // Flaw: Exposing unmasked PII publicly
  res.status(200).json({
    warning: 'VULNERABLE ENDPOINT: Leaks full PII and internal mentor evaluations publicly.',
    appId: record.appId,
    studentName: record.studentName,
    email: record.email,
    phone: record.phone,
    program: record.program,
    status: record.status,
    internalEvaluationGrade: record.internalEvaluationGrade,
    confidentialMentorNotes: record.confidentialMentorNotes,
  });
});

export default router;
