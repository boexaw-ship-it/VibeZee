// =============================================
// VIBEZEE — Order Model
// =============================================

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: Number },
  name:      { type: String, required: true },
  icon:      { type: String, default: '📦' },
  price:     { type: Number, required: true },
  qty:       { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },
  // Customer info
  name:    { type: String, required: true },
  phone:   { type: String, required: true },
  address: { type: String, default: '' },
  city:    { type: String, required: true },
  note:    { type: String, default: '' },

  // Order data
  items:   { type: [orderItemSchema], required: true },
  total:   { type: Number, required: true },

  // Payment
  payment: {
    type: String,
    enum: ['cod', 'kbzpay', 'wavepay'],
    default: 'cod',
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'delivered', 'cancelled'],
    default: 'pending',
  },

  // Telegram sent?
  telegramSent: {
    type: Boolean,
    default: false,
  },

  // Linked user (optional)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, { timestamps: true });

// ── Auto-generate Order ID ──
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = '#VZ-' + String(count + 1).padStart(4, '0');
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
