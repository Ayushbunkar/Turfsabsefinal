import express from "express";
import {
  createBooking,
  getMyBookings,
  getAdminBookings,
  updateBookingStatus,
  getBookingsForTurf,
  getAllBookings,
  releasePendingBooking,
  getAuditLogs,
  cleanupPendingBookings,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/", protect, authorize("user"), createBooking);
router.get("/my-bookings", protect, authorize("user"), getMyBookings);
// Public: get bookings for a turf (optionally filter by date)
router.get("/turf/:turfId", getBookingsForTurf);

// Admin routes
router.get("/admin", protect, authorize("admin"), getAdminBookings);
router.put("/:id/status", protect, authorize("admin", "superadmin"), updateBookingStatus);
// Admin release endpoint (cancel a pending booking to free a slot)
router.post("/:bookingId/release", protect, authorize("admin", "superadmin"), releasePendingBooking);

// Superadmin-only cleanup helper for tests: delete old pending bookings immediately
router.post('/cleanup-pending', protect, authorize('superadmin'), cleanupPendingBookings);
// Audit logs (admin)
router.get('/audit-logs', protect, authorize('admin', 'superadmin'), getAuditLogs);

// SuperAdmin routes
router.get("/all", protect, authorize("superadmin"), getAllBookings);

export default router;
