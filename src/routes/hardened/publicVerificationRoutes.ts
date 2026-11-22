import { Router, Request, Response } from 'express';
import { queryPublicRecordByAppId } from '../../db/mockDatabase.js';
import { maskPublicRecord } from '../../utils/piiMasker.js';
import { createRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Apply strict rate limiting on public lookup to stop brute force enumeration
const publicLookupLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
});

/**
 * Task 4: Public Endpoint Shielding & Zero-PII Verification
 * Publicly verifies student/intern credential without exposing sensitive PII.
 */
router.get('/public/verify/:appId', publicLookupLimiter, (req: Request, res: Response) => {
  const { appId } = req.params;

  if (!appId || !/^DT-\d{4}-[A-Za-z0-9]+$/.test(appId)) {
    res.status(400).json({
      success: false,
      error: 'InvalidAppIdFormat',
      message: 'Invalid credential format. Expected format: DT-YYYY-XXXX.',
    });
    return;
  }

  const record = queryPublicRecordByAppId(appId);

  if (!record) {
    res.status(404).json({
      success: false,
      error: 'CredentialNotFound',
      message: `No active credential verified for identifier '${appId}'.`,
    });
    return;
  }

  // Sanitize and mask all PII before returning
  const maskedPayload = maskPublicRecord(record);

  res.status(200).json({
    success: true,
    credentialStatus: 'AUTHENTICATED_AND_ACTIVE',
    verification: maskedPayload,
    disclaimer: 'PII dynamically masked according to zero-leakage enterprise privacy protocols.',
  });
});

export default router;
