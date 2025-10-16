// System metrics for superadmin dashboard
export async function getSystemMetrics(req, res) {
  try {
    // Example: system metrics aggregation (customize as needed)
    // You can add real server stats, DB stats, or mock for now
    const metrics = {
      serverLoad: Math.round(Math.random() * 100),
      memoryUsage: Math.round(process.memoryUsage().rss / 1024 / 1024), // MB
      responseTime: Math.round(Math.random() * 200), // ms
      activeConnections: Math.floor(Math.random() * 100),
      errorRate: Math.round(Math.random() * 5),
      uptime: Math.round(process.uptime() / 60), // minutes
    };
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch system metrics', details: err.message });
  }
}
import AuditLog from '../models/AuditLog.js';
// Recent activities for superadmin dashboard
export async function getRecentActivities(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activities = await AuditLog.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('actor', 'name email role')
      .populate('targetBooking');
    res.json({ activities });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recent activities', details: err.message });
  }
}

import User from '../models/User.js';
import Turf from '../models/Turf.js';
import Booking from '../models/Booking.js';

export async function getAnalytics(req, res) {
  // Example: fetch analytics data from DB/services
  try {
    // Replace with real aggregation logic
    const overview = {
      totalBookings: 0,
      totalRevenue: 0,
      totalUsers: 0,
      totalTurfs: 0,
      growthMetrics: {
        bookingsGrowth: 0,
        revenueGrowth: 0,
        usersGrowth: 0,
        turfsGrowth: 0
      }
    };
    // Add more analytics data as needed
    res.json({ overview });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

export async function getDashboardStats(req, res) {
  try {
    // Total users
    const totalUsers = await User.countDocuments({});
    // Active users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({ updatedAt: { $gte: thirtyDaysAgo } });

    // Turf admins
    const turfAdmins = await User.countDocuments({ role: 'Turfadmin' });
    // Superadmin pending approvals (turfs not approved)
    const pendingApprovals = await Turf.countDocuments({ isApproved: false });
    // Total turfs
    const totalTurfs = await Turf.countDocuments({});

    // Total bookings
    const totalBookings = await Booking.countDocuments({});
    // Monthly bookings (last 30 days)
    const monthlyBookings = await Booking.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Total revenue (sum of all paid bookings)
    const paidBookings = await Booking.find({ status: 'paid' });
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    // Monthly revenue (last 30 days)
    const monthlyRevenue = paidBookings.filter(b => new Date(b.createdAt) >= thirtyDaysAgo).reduce((sum, b) => sum + (b.price || 0), 0);

    // System health (mock: % of approved turfs)
    const systemHealth = totalTurfs === 0 ? 100 : Math.round((await Turf.countDocuments({ isApproved: true }) / totalTurfs) * 100);

    res.json({
      totalUsers,
      activeUsers,
      turfAdmins,
      pendingApprovals,
      totalTurfs,
      totalBookings,
      monthlyBookings,
      totalRevenue,
      monthlyRevenue,
      systemHealth
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats', details: err.message });
  }
}
