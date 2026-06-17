require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Routes mapping
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/inventory', require('./routes/inventory'));

// Home Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GharKaZaika API!' });
});

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gharkazaika';

console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    global.useMockDb = false;
  })
  .catch(err => {
    console.log(`MongoDB connection failed (${err.message}).`);
    if (process.env.VERCEL) {
      console.log('Running on Vercel: Mock DB fallback disabled (read-only filesystem). MongoDB is REQUIRED.');
      global.useMockDb = false;
    } else {
      console.log('Falling back to local JSON database...');
      global.useMockDb = true;
    }
  });

// Start listening locally (skip on Vercel serverless)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
