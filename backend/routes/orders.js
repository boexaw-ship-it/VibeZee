// =============================================
// VIBEZEE — Orders Routes
// POST /api/orders              — place order (public) + Telegram notify
// GET  /api/orders              — all orders (admin)
// GET  /api/orders/:id          — single order (admin)
// PUT  /api/orders/:id/status   — update status (admin)
// =============================================

const express = require('express');
const Order   = require('../models/Order');
const { adminProtect } = require('../middleware/authMiddleware');
const { sendOrderNotification } = require('../config/telegram');

const router = express.Router();

// ── PLACE ORDER ──
// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { name, phone, address, city, note, items, total, payment } = req.body;

    // Validate required fields
    if (!name || !phone || !city || !items?.length || !total) {
      return res.status(400).json({ message: 'Missing required order fields.' });
    }

    // Create order in DB
    const order = await Order.create({
      name, phone, address, city, note,
      items, total, payment: payment || 'cod',
    });

    // ── Send Telegram Notification ──
    const notifData = {
      orderId:  order.orderId,
      name:     order.name,
      phone:    order.phone,
      address:  order.address,
      city:     order.city,
      note:     order.note,
      items:    order.items,
      total:    order.total,
      payment:  order.payment,
      date:     new Date().toLocaleString('en-GB', { timeZone: 'Asia/Yangon' }),
    };

    const sent = await sendOrderNotification(notifData);
    await Order.findByIdAndUpdate(order._id, { telegramSent: sent });

    res.status(201).json({
      message: 'Order placed successfully.',
      orderId: order.orderId,
      telegramSent: sent,
    });
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ message: 'Server error placing order.' });
  }
});

// ── GET ALL ORDERS (admin) ──
// GET /api/orders
router.get('/', adminProtect, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    let query = {};
    if (status && status !== 'all') query.status = status;

    const skip    = (Number(page) - 1) * Number(limit);
    const orders  = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total   = await Order.countDocuments(query);

    res.json({ total, page: Number(page), orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET SINGLE ORDER (admin) ──
// GET /api/orders/:id
router.get('/:id', adminProtect, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── UPDATE ORDER STATUS (admin) ──
// PUT /api/orders/:id/status
router.put('/:id/status', adminProtect, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending','processing','delivered','cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    res.json({ message: 'Status updated.', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── STATS (admin) ──
// GET /api/orders/stats/summary
router.get('/stats/summary', adminProtect, async (req, res) => {
  try {
    const totalOrders  = await Order.countDocuments();
    const pendingCount = await Order.countDocuments({ status: 'pending' });
    const revenueAgg   = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const revenue = revenueAgg[0]?.total || 0;

    // Monthly revenue (last 6 months)
    const monthly = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: new Date(Date.now() - 180*24*60*60*1000) } } },
      { $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        revenue: { $sum: '$total' },
        count:   { $sum: 1 },
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({ totalOrders, pendingCount, revenue, monthly });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
