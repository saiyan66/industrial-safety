import express from "express";
import { getPpeOverview, getViolationsByZone, getComplianceTrend, getPpeViolations, getViolationsByCamera, getActiveAlerts, getViolationsTodayCount, getHighSeverityAlertsCount, getZonesBreachedCount, getSystemHealth } from "./analytics.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";


const router = express.Router();

router.get("/ppe-overview", authenticate, getPpeOverview);
router.get("/violations-by-zone", authenticate, getViolationsByZone);
router.get("/compliance-trend", authenticate, getComplianceTrend);
router.get("/ppe-violations", authenticate, getPpeViolations);
router.get("/violations-by-camera", authenticate, getViolationsByCamera);
router.get("/active-alerts", authenticate, getActiveAlerts);
router.get("/violations-today", authenticate, getViolationsTodayCount);
router.get("/high-severity-alerts", authenticate, getHighSeverityAlertsCount);
router.get("/zones-breached", authenticate, getZonesBreachedCount);
router.get("/system-health", authenticate, getSystemHealth);

export default router;