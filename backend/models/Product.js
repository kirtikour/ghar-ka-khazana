const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Achaar', 'Papad', 'Chutney', 'Seasonal']
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Map,
    of: Number,
    required: true
  },
  weights: {
    type: [String],
    default: ['250g', '500g', '1kg']
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
