import { Router, Response } from 'express';
import { authGuard, AuthenticatedRequest } from '../../middleware/authGuard.js';
import { queryHardenedByAppIdAndOwner, queryVulnerableByAppId } from '../../db/mockDatabase.js';

const router = Router();

/**
 * Task 2: Hardened BOLA/IDOR Route
 * 1. Requires valid session context (authGuard rejects missing auth with 401).
 * 2. Cross-references session user ID against resource ownership.
 * 3. Enforces zero-trust database compound filtering (appId AND ownerId).
 * 4. Gracefully rejects unauthorized access (403 Forbidden or 404 Not Found)
 *    without leaking database schema, internal error traces, or target data.
 */
router.get('/dashboard/:appId', authGuard, (req: AuthenticatedRequest, res: Response) => {
  const { appId } = req.params;
  const sessionUser = req.sessionUser!;

  // Validate parameter format (Defense-in-depth sanitization)
  if (!appId || typeof appId !== 'string' || !/^DT-\d{4}-[A-Za-z0-9]+$/.test(appId)) {
    res.status(400).json({
      success: false,
      error: 'InvalidParameterFormat',
      message: 'Resource identifier format is invalid. Expected format: DT-YYYY-XXXX.',
    });
    return;
  }

  // Check if resource exists in database
  const resourceExists = queryVulnerableByAppId(appId);
  if (!resourceExists) {
    res.status(404).json({
      success: false,
      error: 'ResourceNotFound',
      message: 'The requested dashboard record could not be found.',
    });
    return;
  }

  // Compound database query: filters by BOTH appId AND session ownerId
  const record = queryHardenedByAppIdAndOwner(appId, sessionUser.userId);

  // If the record exists but does not belong to the session owner:
  if (!record) {
    // Audit log security violation
    console.warn(
      `[SECURITY AUDIT] BOLA attempt detected: User '${sessionUser.userId}' (${sessionUser.email}) attempted to access unauthorized resource '${appId}' owned by '${resourceExists.ownerId}'.`
    );

    res.status(403).json({
      success: false,
      error: 'ForbiddenAccess',
      message: 'Access denied: You do not possess authorization to view this resource.',
      statusCode: 403,
      incidentLogged: true,
    });
    return;
  }

  // Authorized return payload
  res.status(200).json({
    success: true,
    data: {
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
    },
    authorizedFor: sessionUser.email,
  });
});

export default router;
