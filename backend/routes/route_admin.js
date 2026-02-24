// =============================================
// VIBEZEE — Admin Routes
// GET /api/admin/dashboard  — stats overview
// GET /api/admin/users      — all users
// PUT /api/admin/users/:id  — update user
// =============================================

const express = require('express');
const User    = require('../models/User');
const Order   = require('../models/Order');
const Product = require('../models/Product');
const { adminProtect } = require('../middleware/authMiddleware');

const router = express.Router();

// ── DASHBOARD STATS ──
router.get('/dashboard', adminProtect, async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts, revenueAgg, pendingOrders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments({ status: 'pending' }),
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      revenue:       revenueAgg[0]?.total || 0,
      pendingOrders,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── ALL USERS ──
router.get('/users', adminProtect, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: 'customer' };
    if (search) query.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];

    const users = await User.find(query).sort({ createdAt: -1 });

    // Add order count per user
    const usersWithStats = await Promise.all(users.map(async u => {
      const orders = await Order.find({ phone: u.phone });
      const spent  = orders.reduce((s, o) => s + (o.total || 0), 0);
      return {
        id:        u._id,
        name:      u.name,
        email:     u.email,
        phone:     u.phone,
        createdAt: u.createdAt,
        orders:    orders.length,
        spent,
      };
    }));

    res.json({ count: users.length, users: usersWithStats });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── UPDATE USER (block/unblock) ──
router.put('/users/:id', adminProtect, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User updated.', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
