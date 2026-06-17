require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Product, Order } = require('../models');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gharkazaika';

const seedProducts = [
  {
    name: 'Teekha Mango Achaar',
    category: 'Achaar',
    description: 'Homemade spicy and sour green mango pickle prepared with premium cold-pressed mustard oil and authentic spices.',
    price: {
      '250g': 250,
      '500g': 450,
      '1kg': 850
    },
    weights: ['250g', '500g', '1kg'],
    stock: 25,
    image: 'mango-achaar.jpg',
    visible: true
  },
  {
    name: 'Khatta Lemon Achaar',
    category: 'Achaar',
    description: 'Zesty and tangy pickled lemons infused with red chilies, fennel seeds, and salt. Oil-free recipe.',
    price: {
      '250g': 200,
      '500g': 380,
      '1kg': 700
    },
    weights: ['250g', '500g', '1kg'],
    stock: 15,
    image: 'lemon-achaar.jpg',
    visible: true
  },
  {
    name: 'Chatpata Mixed Achaar',
    category: 'Achaar',
    description: 'A traditional mixture of carrots, green chilies, mangoes, and lemons pickled with a perfect spice blend.',
    price: {
      '250g': 240,
      '500g': 420,
      '1kg': 800
    },
    weights: ['250g', '500g', '1kg'],
    stock: 30,
    image: 'mixed-achaar.jpg',
    visible: true
  },
  {
    name: 'Spicy Green Chili Achaar',
    category: 'Achaar',
    description: 'Hot and fiery green chilies slit and stuffed with mustard seeds, turmeric, and sour spices, aged in mustard oil.',
    price: {
      '250g': 220,
      '500g': 400,
      '1kg': 750
    },
    weights: ['250g', '500g', '1kg'],
    stock: 4, // low stock for testing highlighting
    image: 'green-chili-achaar.jpg',
    visible: true
  },
  {
    name: 'Crispy Masala Papad',
    category: 'Papad',
    description: 'Crunchy and flavorful lentil flatbreads spiced with black pepper and roasted cumin. Delicious when roasted or fried.',
    price: {
      '250g': 150,
      '500g': 280,
      '1kg': 500
    },
    weights: ['250g', '500g', '1kg'],
    stock: 20,
    image: 'masala-papad.jpg',
    visible: true
  },
  {
    name: 'Handmade Moong Papad',
    category: 'Papad',
    description: 'Mild and nutritious split mung bean papad, rolled by hand and dried in hygienic solar dryers.',
    price: {
      '250g': 140,
      '500g': 260,
      '1kg': 480
    },
    weights: ['250g', '500g', '1kg'],
    stock: 18,
    image: 'moong-papad.jpg',
    visible: true
  },
  {
    name: 'Lehsun (Garlic) Lal Chutney',
    category: 'Chutney',
    description: 'Fiery garlic chutney paste featuring whole red chilies, coriander seeds, cumin, and sea salt. Desi style.',
    price: {
      '250g': 180,
      '500g': 320,
      '1kg': 600
    },
    weights: ['250g', '500g', '1kg'],
    stock: 12,
    image: 'garlic-chutney.jpg',
    visible: true
  },
  {
    name: 'Meethi Imli Chutney',
    category: 'Chutney',
    description: 'Tangy and sweet tamarind sauce blended with organic jaggery, ginger powder, and roasted black salt.',
    price: {
      '250g': 160,
      '500g': 300,
      '1kg': 550
    },
    weights: ['250g', '500g', '1kg'],
    stock: 3, // low stock for testing highlighting
    image: 'imli-chutney.jpg',
    visible: true
  }
];

async function seedDatabase() {
  let useMock = false;
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');
    global.useMockDb = false;
  } catch (error) {
    console.log('MongoDB connection failed. Seeding local JSON database instead...');
    global.useMockDb = true;
    useMock = true;
  }

  try {

    // Clear existing data
    console.log('Clearing old collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('Collections cleared.');

    // Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'gharkakhazana@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    console.log(`Creating Admin user: ${adminEmail}`);
    const adminUser = new User({
      email: adminEmail,
      password: adminPassword, // Will be hashed by pre-save middleware
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully.');

    // Seed Products
    console.log('Seeding products...');
    const insertedProducts = await Product.insertMany(seedProducts);
    console.log(`Seeded ${insertedProducts.length} products successfully.`);

    // Seed a couple of dummy orders for the dashboard stats
    console.log('Seeding demo orders...');
    const order1 = new Order({
      customerName: 'Karan Tejwani',
      phone: '923001234567',
      address: 'House 45, Street 12, Gulshan-e-Iqbal, Karachi',
      items: [
        {
          product: insertedProducts[0]._id,
          name: insertedProducts[0].name,
          weight: '500g',
          price: 450,
          quantity: 2
        },
        {
          product: insertedProducts[4]._id,
          name: insertedProducts[4].name,
          weight: '250g',
          price: 150,
          quantity: 1
        }
      ],
      total: 1050,
      status: 'Pending',
      notes: 'Please pack tightly, shipping to Gulshan-e-Iqbal.'
    });

    const order2 = new Order({
      customerName: 'Ayesha Khan',
      phone: '923339876543',
      address: 'Flat 302, Jasmine Heights, Clifton, Karachi',
      items: [
        {
          product: insertedProducts[2]._id,
          name: insertedProducts[2].name,
          weight: '1kg',
          price: 800,
          quantity: 1
        }
      ],
      total: 800,
      status: 'Confirmed',
      notes: 'Deliver in evening.'
    });

    const order3 = new Order({
      customerName: 'Zainab Ahmed',
      phone: '923151122334',
      address: 'House A-19, Defence Phase 6, Karachi',
      items: [
        {
          product: insertedProducts[6]._id,
          name: insertedProducts[6].name,
          weight: '500g',
          price: 320,
          quantity: 1
        }
      ],
      total: 320,
      status: 'Delivered',
      notes: 'No spicy variations.'
    });

    await order1.save();
    await order2.save();
    await order3.save();
    console.log('Demo orders seeded.');

    console.log('Seeding completed successfully!');
    if (!useMock) {
      mongoose.connection.close();
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    if (!useMock) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
}

seedDatabase();
