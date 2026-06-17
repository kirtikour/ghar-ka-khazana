const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readData(collection) {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeData(collection, data) {
  fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2), 'utf8');
}

// Chainable mock query class to mimic Mongoose Query objects (.sort and .select)
class MockQuery {
  constructor(dataPromise) {
    this.dataPromise = dataPromise;
  }

  sort(sortObj) {
    this.dataPromise = this.dataPromise.then(data => {
      const key = Object.keys(sortObj)[0];
      const direction = sortObj[key]; // 1 for asc, -1 for desc
      return [...data].sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        if (valA === undefined) return 1;
        if (valB === undefined) return -1;

        // Date sorting
        if (valA instanceof Date || (typeof valA === 'string' && !isNaN(Date.parse(valA)) && isNaN(valA))) {
          const dateA = new Date(valA);
          const dateB = new Date(valB);
          return direction === 1 ? dateA - dateB : dateB - dateA;
        }

        // String sorting
        if (typeof valA === 'string') {
          return direction === 1 ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        // Numeric sorting
        return direction === 1 ? valA - valB : valB - valA;
      });
    });
    return this;
  }

  select(fieldsString) {
    this.dataPromise = this.dataPromise.then(data => {
      const fields = fieldsString.split(' ');
      return data.map(item => {
        const filtered = {};
        fields.forEach(f => {
          filtered[f] = item[f];
        });
        filtered._id = item._id; // Always retain ID
        return filtered;
      });
    });
    return this;
  }

  then(onFulfilled, onRejected) {
    return this.dataPromise.then(onFulfilled, onRejected);
  }
}

// Mock User Model
const MockUser = {
  async findOne({ email }) {
    const users = readData('users');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      // Attach comparison function
      return {
        ...user,
        async comparePassword(candidatePassword) {
          return bcrypt.compare(candidatePassword, user.password);
        }
      };
    }
    return null;
  },

  async save(userObj) {
    const users = readData('users');
    const newUser = {
      _id: userObj._id || crypto.randomBytes(12).toString('hex'),
      email: userObj.email,
      password: userObj.password.startsWith('$2a$') ? userObj.password : await bcrypt.hash(userObj.password, 10),
      role: userObj.role || 'admin',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeData('users', users);
    return newUser;
  },

  async deleteMany() {
    writeData('users', []);
    return { deletedCount: 0 };
  }
};

// Mock Product Model
class ProductInstance {
  constructor(data) {
    Object.assign(this, data);
    this._id = this._id || crypto.randomBytes(12).toString('hex');
    this.stock = this.stock !== undefined ? parseInt(this.stock) : 0;
    this.visible = this.visible !== undefined ? !!this.visible : true;
    this.weights = this.weights || ['250g', '500g', '1kg'];
  }

  async save() {
    const products = readData('products');
    
    // Check if updating
    const index = products.findIndex(p => p._id === this._id);
    
    // Make sure price is plain object
    const rawPrice = this.price instanceof Map ? Object.fromEntries(this.price) : this.price;

    const dataToSave = {
      _id: this._id,
      name: this.name,
      category: this.category,
      description: this.description,
      price: rawPrice,
      weights: this.weights,
      stock: this.stock,
      image: this.image,
      visible: this.visible,
      createdAt: this.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (index !== -1) {
      products[index] = dataToSave;
    } else {
      products.push(dataToSave);
    }

    writeData('products', products);
    return this;
  }
}

const MockProduct = {
  find(query = {}) {
    const executeFind = async () => {
      let products = readData('products');
      
      if (query.visible !== undefined) {
        products = products.filter(p => p.visible === query.visible);
      }
      
      return products;
    };
    return new MockQuery(executeFind());
  },

  async findById(id) {
    const products = readData('products');
    const p = products.find(prod => prod._id === id.toString());
    if (!p) return null;
    return new ProductInstance(p);
  },

  async findByIdAndUpdate(id, update, options) {
    const products = readData('products');
    const index = products.findIndex(prod => prod._id === id.toString());
    if (index === -1) return null;

    const fields = update.$set || update;
    let priceObj = fields.price;
    if (priceObj instanceof Map) {
      priceObj = Object.fromEntries(priceObj);
    }

    const current = products[index];
    const updated = {
      ...current,
      ...fields,
      price: priceObj || current.price,
      updatedAt: new Date().toISOString()
    };

    products[index] = updated;
    writeData('products', products);
    return updated;
  },

  async findByIdAndDelete(id) {
    const products = readData('products');
    const filtered = products.filter(prod => prod._id !== id.toString());
    writeData('products', filtered);
    return { message: 'Product removed' };
  },

  async insertMany(arr) {
    const products = readData('products');
    const inserted = arr.map(item => {
      let priceObj = item.price;
      if (priceObj instanceof Map) {
        priceObj = Object.fromEntries(priceObj);
      }

      return {
        _id: item._id || crypto.randomBytes(12).toString('hex'),
        name: item.name,
        category: item.category,
        description: item.description,
        price: priceObj,
        weights: item.weights || ['250g', '500g', '1kg'],
        stock: item.stock !== undefined ? parseInt(item.stock) : 0,
        image: item.image,
        visible: item.visible !== undefined ? !!item.visible : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    products.push(...inserted);
    writeData('products', products);
    return inserted;
  },

  async deleteMany() {
    writeData('products', []);
    return { deletedCount: 0 };
  },

  createInstance(data) {
    return new ProductInstance(data);
  }
};

// Mock Order Model
class OrderInstance {
  constructor(data) {
    Object.assign(this, data);
    this._id = this._id || crypto.randomBytes(12).toString('hex');
    this.status = this.status || 'Pending';
    this.notes = this.notes || '';
    this.createdAt = this.createdAt || new Date().toISOString();
  }

  async save() {
    const orders = readData('orders');
    const index = orders.findIndex(o => o._id === this._id);
    const dataToSave = {
      _id: this._id,
      customerName: this.customerName,
      phone: this.phone,
      address: this.address,
      items: this.items,
      total: this.total,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: new Date().toISOString()
    };
    if (index !== -1) {
      orders[index] = dataToSave;
    } else {
      orders.push(dataToSave);
    }
    writeData('orders', orders);
    return this;
  }
}

const MockOrder = {
  find(query = {}) {
    const executeFind = async () => {
      let orders = readData('orders');
      if (query.status) {
        orders = orders.filter(o => o.status === query.status);
      }
      return orders;
    };
    return new MockQuery(executeFind());
  },

  async findById(id) {
    const orders = readData('orders');
    const o = orders.find(ord => ord._id === id.toString());
    if (!o) return null;
    return new OrderInstance(o);
  },

  async findByIdAndUpdate(id, update, options) {
    const orders = readData('orders');
    const index = orders.findIndex(ord => ord._id === id.toString());
    if (index === -1) return null;

    const fields = update.$set || update;
    orders[index] = {
      ...orders[index],
      ...fields,
      updatedAt: new Date().toISOString()
    };
    writeData('orders', orders);
    return orders[index];
  },

  async deleteMany() {
    writeData('orders', []);
    return { deletedCount: 0 };
  },

  createInstance(data) {
    return new OrderInstance(data);
  }
};

module.exports = {
  User: MockUser,
  Product: MockProduct,
  Order: MockOrder
};
