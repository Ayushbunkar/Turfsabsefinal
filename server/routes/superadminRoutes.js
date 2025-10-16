import express from 'express';
import { getAnalytics, getDashboardStats, getRecentActivities, getSystemMetrics } from '../controllers/superadminController.js';
import { verifySuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Analytics endpoint
router.get('/analytics', verifySuperAdmin, getAnalytics);

// Dashboard stats endpoint for superadmin
router.get('/dashboard-stats', verifySuperAdmin, getDashboardStats);



// Recent activities endpoint
router.get('/recent-activities', verifySuperAdmin, getRecentActivities);

// System metrics endpoint
router.get('/system/metrics', verifySuperAdmin, getSystemMetrics);

export default router;
