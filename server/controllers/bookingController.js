import Booking from "../models/Booking.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import Turf from "../models/Turf.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";

// 🟢 USER: Create Booking
export const createBooking = async (req, res) => {
  try {
    const { turfId, slot, date } = req.body;

    const turf = await Turf.findById(turfId);
    if (!turf || !turf.isApproved)
      return res.status(404).json({ message: "Turf not available" });

    // Check if slot is already booked or reserved (pending/confirmed/paid)
    const slotConflict = await Booking.findOne({
      turf: turfId,
      "slot.startTime": slot.startTime,
      "slot.endTime": slot.endTime,
      date,
      status: { $in: ["pending", "confirmed", "paid"] },
    });

    if (slotConflict) {
      const base = { message: "Slot already reserved or booked", bookingId: slotConflict._id };
      const isOwner = req.user && String(slotConflict.user) === String(req.user._id);
      const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
      if (isAdmin || isOwner) {
        const reserver = await User.findById(slotConflict.user).select('name email').lean();
        return res.status(409).json({ ...base, reserver: reserver ? { name: reserver.name, email: reserver.email } : undefined });
      }
      return res.status(409).json(base);
    }

    const booking = await Booking.create({
      user: req.user._id,
      turf: turfId,
      slot,
      date,
      price: turf.pricePerHour,
      // create booking as pending until payment verification
      status: "pending",
    });

  // respond with booking so frontend can create a payment order
  const pendingTTL = Number(process.env.PENDING_BOOKING_TTL) || 900;
  const expiresAt = new Date(booking.createdAt.getTime() + pendingTTL * 1000);
  res.status(201).json({ message: "Booking created", booking, expiresAt: expiresAt.toISOString() });
    // send a tentative email that booking was created (optional)
    await sendEmail({
      to: req.user.email,
      subject: "Booking Created",
      text: `Hi ${req.user.name}, your booking at ${turf.name} is created for ${date} ${slot.startTime}-${slot.endTime}. Complete payment to confirm.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 USER: Get My Bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("turf", "name location pricePerHour")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟣 ADMIN: Get Bookings for My Turfs
export const getAdminBookings = async (req, res) => {
  try {
    const turfs = await Turf.find({ admin: req.user._id });
    const turfIds = turfs.map((t) => t._id);

    const bookings = await Booking.find({ turf: { $in: turfIds } })
      .populate("user", "name email")
      .populate("turf", "name location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 ADMIN/SUPERADMIN: Update Booking Status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // confirmed/cancelled
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Admin can update only their turf bookings
    if (req.user.role === "admin") {
      const turf = await Turf.findById(booking.turf);
      if (turf.admin.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Booking updated", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 SUPERADMIN: Get All Bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("turf", "name location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public: get bookings for a specific turf, optional ?date=YYYY-MM-DD
export const getBookingsForTurf = async (req, res) => {
  try {
    const { turfId } = req.params;
    const { date } = req.query;
    const filter = { turf: turfId };
    if (date) filter.date = date;
    // only return confirmed/paid bookings that block slots
    filter.status = { $in: ["confirmed", "paid"] };

    const bookings = await Booking.find(filter).select('slot date status').lean();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create Razorpay Order
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("turf");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const amount = booking.price * 100; // Amount in paise
    const options = {
      amount,
      currency: "INR",
      receipt: booking._id.toString(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const booking = await Booking.findById(bookingId).populate('turf');
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      booking.status = "paid"; // mark as paid
      await booking.save();

      // send confirmation email
      await sendEmail({
        to: req.user.email,
        subject: "Payment Successful",
        text: `Hi ${req.user.name}, your payment of ₹${booking.price} for turf ${booking.turf.name} was successful. Your booking is confirmed for ${booking.date} ${booking.slot.startTime}-${booking.slot.endTime}`,
      });

      res.json({ message: "Payment verified & booking confirmed", booking });
    } else {
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟠 ADMIN: Release a pending booking (mark as cancelled/released)
export const releasePendingBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body; // optional reason provided by admin
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only admins or superadmins can release pending bookings
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Only pending bookings should be released through this endpoint
    if (booking.status !== 'pending') return res.status(400).json({ message: 'Only pending bookings can be released' });

    booking.status = "cancelled"; // mark cancelled/released
    await booking.save();

    // record an audit log for admin action
    try {
      await AuditLog.create({ action: 'release_pending_booking', actor: req.user?._id, targetBooking: booking._id, meta: { reason: reason || 'admin_release' } });
    } catch (e) {
      // non-fatal
      console.warn('Failed to write audit log', e.message);
    }

    res.json({ message: "Pending booking released", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cleanupPendingBookings = async (req, res) => {
  try {
    // only allow superadmin for cleanup
    if (!req.user || req.user.role !== 'superadmin') return res.status(403).json({ message: 'Not authorized' });
    const pendingTTL = Number(process.env.PENDING_BOOKING_TTL) || 900;
    const cutoff = new Date(Date.now() - pendingTTL * 1000);
    const result = await Booking.deleteMany({ status: 'pending', createdAt: { $lt: cutoff } });
    res.json({ message: 'Cleanup done', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: fetch recent audit logs (admin/superadmin)
export const getAuditLogs = async (req, res) => {
  try {
    // only admin/superadmin
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) return res.status(403).json({ message: 'Not authorized' });
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json(logs);
  } catch (e) { res.status(500).json({ message: e.message }); }
};
