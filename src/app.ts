import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { securityHeadersMiddleware } from './middleware/securityHeaders.js';

// Route Handlers
import vulnerableIdorRoutes from './routes/vulnerable/idorDashboard.js';
import vulnerableLookupRoutes from './routes/vulnerable/unmaskedLookup.js';
import hardenedAuthRoutes from './routes/hardened/authRoutes.js';
import hardenedDashboardRoutes from './routes/hardened/dashboardRoutes.js';
import hardenedPublicRoutes from './routes/hardened/publicVerificationRoutes.js';

export const app = express();

// Core Middleware
app.use(express.json());
app.use(cookieParser());

// Task 4: Global Enterprise Security Headers
app.use(securityHeadersMiddleware);

// Base Documentation / Status Endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    program: 'Application Security & API Pentesting Internship',
    organization: 'Datheon',
    author: 'Yadish Kumar',
    applicationId: 'DT-2026-7ZENR',
    status: 'Active & In Progress',
    version: '2.0.0-zero-trust',
    endpoints: {
      vulnerableV1: {
        task1_idor_fuzzing: 'GET /api/v1/dashboard?appId=DT-2026-001',
        task4_unmasked_lookup: 'GET /api/v1/public/verify/DT-2026-7ZENR',
      },
      hardenedV2: {
        task3_login_http_cookie: 'POST /api/v2/auth/login',
        task3_validate_session: 'GET /api/v2/auth/me',
        task3_logout: 'POST /api/v2/auth/logout',
        task2_hardened_dashboard: 'GET /api/v2/dashboard/:appId',
        task4_masked_verification: 'GET /api/v2/public/verify/:appId',
      },
    },
    documentation: 'See README.md for PoC cURL scripts, CVSS 3.1 disclosure report, and architecture diagrams.',
  });
});

// Mount Vulnerable Routes (API v1 - For Security Audit & Pentesting PoC)
app.use('/api/v1', vulnerableIdorRoutes);
app.use('/api/v1', vulnerableLookupRoutes);

// Mount Hardened Zero-Trust Routes (API v2 - Defense-in-Depth Architecture)
app.use('/api/v2/auth', hardenedAuthRoutes);
app.use('/api/v2', hardenedDashboardRoutes);
app.use('/api/v2', hardenedPublicRoutes);

// Global Error Handler - Prevents DB stack trace leakage
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Internal Error Suppressed]:', err.message);
  res.status(500).json({
    success: false,
    error: 'InternalServerError',
    message: 'An unexpected security-monitored error occurred.',
  });
});
