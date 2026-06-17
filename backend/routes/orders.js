const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Order, Product } = require('../models');

// @route   GET /api/orders
// @desc    Get all orders (Admin only, can filter by status)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) {
      query.status = status;
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/orders
// @desc    Create a new order (Public for customer checkout / Admin manual entry)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, address, items, notes } = req.body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields (Name, Phone, Address, and Items)' });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    // Verify products and calculate total
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      // Check price for weight
      const priceForWeight = (product.price instanceof Map) ? product.price.get(item.weight) : product.price[item.weight];
      if (priceForWeight === undefined) {
        return res.status(400).json({ message: `Invalid weight option '${item.weight}' for product '${product.name}'` });
      }

      const itemTotal = priceForWeight * item.quantity;
      calculatedTotal += itemTotal;

      // Check and update stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product '${product.name}'. Available: ${product.stock}` });
      }

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        weight: item.weight,
        price: priceForWeight,
        quantity: item.quantity
      });
    }

    const newOrder = new Order({
      customerName,
      phone,
      address,
      items: orderItems,
      total: calculatedTotal,
      notes: notes || '',
      status: 'Pending'
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error: ' + err.message);
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status (Admin only)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'Confirmed', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
