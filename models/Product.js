// =============================================
// VIBEZEE — Product Model
// =============================================

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['sound-cards','microphones','earphones','keyboards','mouse','joysticks','memory','harddisk','usbc'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  icon: {
    type: String,
    default: '📦',
  },
  badge: {
    type: String,
    enum: ['', 'HOT', 'NEW', 'SALE'],
    default: '',
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
