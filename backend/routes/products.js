// =============================================
// VIBEZEE — Products Routes
// GET    /api/products          — all products
// GET    /api/products/:id      — single product
// POST   /api/products          — add (admin)
// PUT    /api/products/:id      — edit (admin)
// DELETE /api/products/:id      — delete (admin)
// =============================================

const express = require('express');
const Product = require('../models/Product');
const { adminProtect } = require('../middleware/authMiddleware');

const router = express.Router();

// ── GET ALL ──
router.get('/', async (req, res) => {
  try {
    const { cat, search, sort, maxPrice } = req.query;

    let query = {};

    if (cat && cat !== 'all')  query.category = cat;
    if (maxPrice)              query.price = { $lte: Number(maxPrice) };
    if (search)                query.name = { $regex: search, $options: 'i' };

    let productsQuery = Product.find(query);

    if (sort === 'price-asc')  productsQuery = productsQuery.sort({ price: 1 });
    if (sort === 'price-desc') productsQuery = productsQuery.sort({ price: -1 });
    if (sort === 'name-asc')   productsQuery = productsQuery.sort({ name: 1 });

    const products = await productsQuery;
    res.json({ count: products.length, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET SINGLE ──
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── ADD PRODUCT (admin) ──
router.post('/', adminProtect, async (req, res) => {
  try {
    const { name, category, price, icon, badge, description } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: 'Name, category, and price required.' });
    }

    const product = await Product.create({ name, category, price, icon, badge, description });
    res.status(201).json({ message: 'Product added.', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── UPDATE PRODUCT (admin) ──
router.put('/:id', adminProtect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product updated.', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── DELETE PRODUCT (admin) ──
router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
