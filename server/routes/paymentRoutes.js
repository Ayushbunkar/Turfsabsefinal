import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createPaymentOrder, verifyPayment } from "../controllers/bookingController.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", protect, authorize("user"), createPaymentOrder);

// Verify payment
router.post("/verify", protect, authorize("user"), verifyPayment);

export default router;
