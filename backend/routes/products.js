const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { Product } = require('../models');

// Configure Multer for local file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   GET /api/products
// @desc    Get all products (public gets only visible, admin can get all)
// @access  Public / Admin
router.get('/', async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true';
    let query = {};
    
    // If not request from admin dashboard, show only visible
    if (!isAdmin) {
      query.visible = true;
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/products
// @desc    Add new product (Admin only)
// @access  Private
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    const { name, category, description, price, weights, stock, visible } = req.body;

    if (!name || !category || !description || !price) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Parse price and weights since they are sent via FormData
    let parsedPrice;
    let parsedWeights;
    try {
      parsedPrice = typeof price === 'string' ? JSON.parse(price) : price;
      parsedWeights = typeof weights === 'string' ? JSON.parse(weights) : weights;
    } catch (e) {
      return res.status(400).json({ message: 'Invalid price or weights format' });
    }

    // Save filename to database
    const imageName = req.file.filename;

    const newProduct = new Product({
      name,
      category,
      description,
      price: parsedPrice,
      weights: parsedWeights,
      stock: parseInt(stock) || 0,
      image: imageName,
      visible: visible === 'true' || visible === true
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error: ' + err.message);
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private
router.put('/:id', [auth, upload.single('image')], async (req, res) => {
  try {
    const { name, category, description, price, weights, stock, visible } = req.body;
    
    // Find product
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Parse fields
    let parsedPrice;
    let parsedWeights;
    if (price) {
      try {
        parsedPrice = typeof price === 'string' ? JSON.parse(price) : price;
      } catch (e) {
        return res.status(400).json({ message: 'Invalid price format' });
      }
    }
    
    if (weights) {
      try {
        parsedWeights = typeof weights === 'string' ? JSON.parse(weights) : weights;
      } catch (e) {
        return res.status(400).json({ message: 'Invalid weights format' });
      }
    }

    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (category) updateFields.category = category;
    if (description) updateFields.description = description;
    if (parsedPrice) updateFields.price = parsedPrice;
    if (parsedWeights) updateFields.weights = parsedWeights;
    if (stock !== undefined) updateFields.stock = parseInt(stock);
    if (visible !== undefined) updateFields.visible = visible === 'true' || visible === true;

    // If new file uploaded
    if (req.file) {
      // Optional: Delete old image from server
      const oldImagePath = path.join(__dirname, '../uploads/', product.image);
      if (fs.existsSync(oldImagePath)) {
        try {
          // Keep default seeded images in place if they are not from uploads
          if (!product.image.startsWith('default_') && !['garlic-chutney.jpg', 'green-chili-achaar.jpg', 'imli-chutney.jpg', 'lemon-achaar.jpg', 'mango-achaar.jpg', 'masala-papad.jpg', 'mixed-achaar.jpg', 'moong-papad.jpg'].includes(product.image)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Failed to delete old image:', err);
        }
      }
      updateFields.image = req.file.filename;
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Optional: Delete image from server
    const imagePath = path.join(__dirname, '../uploads/', product.image);
    if (fs.existsSync(imagePath)) {
      try {
        if (!['garlic-chutney.jpg', 'green-chili-achaar.jpg', 'imli-chutney.jpg', 'lemon-achaar.jpg', 'mango-achaar.jpg', 'masala-papad.jpg', 'mixed-achaar.jpg', 'moong-papad.jpg'].includes(product.image)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
