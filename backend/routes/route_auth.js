// =============================================
// VIBEZEE — Auth Routes
// POST /api/auth/register
// POST /api/auth/login
// POST /api/auth/admin-login
// GET  /api/auth/me
// =============================================

const express = require('express');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const User    = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ── Generate JWT ──
const generateToken = (id, role = 'customer') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d',
  });
};

// ── REGISTER ──
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const user = await User.create({ name, email, phone, password });
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── CUSTOMER LOGIN ──
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Login successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── ADMIN LOGIN ──
// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass  = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPass) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    // Generate admin token (no DB lookup needed)
    const token = jwt.sign(
      { role: 'admin', email: adminEmail },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      message: 'Admin login successful.',
      token,
      user: { name: 'Admin', email: adminEmail, role: 'admin' },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET ME ──
// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
