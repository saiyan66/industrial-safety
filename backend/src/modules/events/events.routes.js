import express from "express";
import {
  createEvent,
  getAlerts,
  getRecentEvents,
  resolveEvent
} from "./events.controller.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/recent", authenticate, getRecentEvents);
router.get("/alerts", authenticate, getAlerts)
router.patch("/:id/resolve", authenticate, authorize("admin", "operator"), resolveEvent);

export default router;