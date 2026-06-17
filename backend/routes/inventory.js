const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Product } = require('../models');

// @route   GET /api/inventory
// @desc    Get all inventory items (product name, category, stock, last updated)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const inventory = await Product.find({})
      .select('name category stock updatedAt')
      .sort({ name: 1 });
    res.json(inventory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/inventory/:id
// @desc    Update stock level of an item
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || isNaN(stock)) {
      return res.status(400).json({ message: 'Please provide a valid stock number' });
    }

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.stock = parseInt(stock);
    await product.save();

    res.json({
      _id: product._id,
      name: product.name,
      category: product.category,
      stock: product.stock,
      updatedAt: product.updatedAt
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
