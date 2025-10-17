import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createPaymentOrder, verifyPayment, getUserPayments } from "../controllers/bookingController.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", protect, authorize("user"), createPaymentOrder);

// Get user's payment history
router.get('/user', protect, authorize('user'), getUserPayments);

// Dev-only helper: complete a payment without Razorpay (for local testing)
if (process.env.NODE_ENV !== 'production') {
	router.post('/dev/complete', protect, authorize('user'), async (req, res) => {
		try {
			const { bookingId } = req.body;
			const booking = await (await import('../models/Booking.js')).default.findById(bookingId).populate('turf');
			if (!booking) return res.status(404).json({ message: 'Booking not found' });
			booking.payment = { amount: booking.price, method: 'Dev', transactionId: `dev_txn_${booking._id}`, providerOrderId: `dev_order_${booking._id}`, providerPaymentId: `dev_pay_${booking._id}`, signature: 'devsig', status: 'completed', date: new Date() };
			booking.status = 'paid';
			await booking.save();
			return res.json({ message: 'Dev payment completed', booking });
		} catch (e) { return res.status(500).json({ message: e.message }); }
	});
}

// Verify payment
router.post("/verify", protect, authorize("user"), verifyPayment);

export default router;
