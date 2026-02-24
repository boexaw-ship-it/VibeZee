// =============================================
// VIBEZEE — Main Server
// =============================================

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const connectDB  = require('./config/db');
const { initBot } = require('./config/telegram');

// ── Routes ──
const authRoutes    = require('./routes/route_auth');
const productRoutes = require('./routes/route_products');
const orderRoutes   = require('./routes/route_orders');
const adminRoutes   = require('./routes/route_admin');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Connect DB ──
connectDB();

// ── Init Telegram Bot ──
initBot();

// ── Middleware ──
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5500',  // Live Server
    'http://localhost:5500',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Serve Frontend (static files) ──
// Frontend folder ကို backend ရဲ့ parent directory ထဲ ထားပါ
// vibezee/
// ├── frontend/   ← HTML files
// └── backend/    ← Node.js (ဒီ folder)
app.use(express.static(path.join(__dirname, '../frontend')));

// ── API Routes ──
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/admin',    adminRoutes);

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '⚡ VibeZee API is running',
    time: new Date().toISOString(),
  });
});

// ── Catch-all: serve frontend ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error.',
  });
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log('');
  console.log('  ██╗   ██╗██╗██████╗ ███████╗███████╗███████╗███████╗');
  console.log('  ██║   ██║██║██╔══██╗██╔════╝╚══███╔╝██╔════╝██╔════╝');
  console.log('  ██║   ██║██║██████╔╝█████╗    ███╔╝ █████╗  █████╗  ');
  console.log('  ╚██╗ ██╔╝██║██╔══██╗██╔══╝   ███╔╝  ██╔══╝  ██╔══╝  ');
  console.log('   ╚████╔╝ ██║██████╔╝███████╗███████╗███████╗███████╗');
  console.log('    ╚═══╝  ╚═╝╚═════╝ ╚══════╝╚══════╝╚══════╝╚══════╝');
  console.log('');
  console.log(`  🚀 Server running on http://localhost:${PORT}`);
  console.log(`  📦 API:    http://localhost:${PORT}/api/health`);
  console.log(`  🌐 Shop:   http://localhost:${PORT}`);
  console.log('');
});

module.exports = app;
