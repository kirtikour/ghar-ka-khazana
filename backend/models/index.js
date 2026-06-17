const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const mockDb = require('./dbMock');

// User Wrapper
function UserWrapper(data) {
  if (global.useMockDb) {
    return {
      email: data.email,
      password: data.password,
      role: data.role || 'admin',
      async save() {
        return mockDb.User.save(this);
      }
    };
  }
  return new User(data);
}

UserWrapper.findOne = function(...args) {
  return global.useMockDb ? mockDb.User.findOne(...args) : User.findOne(...args);
};

UserWrapper.deleteMany = function(...args) {
  return global.useMockDb ? mockDb.User.deleteMany(...args) : User.deleteMany(...args);
};

// Product Wrapper
function ProductWrapper(data) {
  if (global.useMockDb) {
    return mockDb.Product.createInstance(data);
  }
  return new Product(data);
}

ProductWrapper.find = function(...args) {
  return global.useMockDb ? mockDb.Product.find(...args) : Product.find(...args);
};

ProductWrapper.findById = function(...args) {
  return global.useMockDb ? mockDb.Product.findById(...args) : Product.findById(...args);
};

ProductWrapper.findByIdAndUpdate = function(...args) {
  return global.useMockDb ? mockDb.Product.findByIdAndUpdate(...args) : Product.findByIdAndUpdate(...args);
};

ProductWrapper.findByIdAndDelete = function(...args) {
  return global.useMockDb ? mockDb.Product.findByIdAndDelete(...args) : Product.findByIdAndDelete(...args);
};

ProductWrapper.insertMany = function(...args) {
  return global.useMockDb ? mockDb.Product.insertMany(...args) : Product.insertMany(...args);
};

ProductWrapper.deleteMany = function(...args) {
  return global.useMockDb ? mockDb.Product.deleteMany(...args) : Product.deleteMany(...args);
};

// Order Wrapper
function OrderWrapper(data) {
  if (global.useMockDb) {
    return mockDb.Order.createInstance(data);
  }
  return new Order(data);
}

OrderWrapper.find = function(...args) {
  return global.useMockDb ? mockDb.Order.find(...args) : Order.find(...args);
};

OrderWrapper.findById = function(...args) {
  return global.useMockDb ? mockDb.Order.findById(...args) : Order.findById(...args);
};

OrderWrapper.findByIdAndUpdate = function(...args) {
  return global.useMockDb ? mockDb.Order.findByIdAndUpdate(...args) : Order.findByIdAndUpdate(...args);
};

OrderWrapper.deleteMany = function(...args) {
  return global.useMockDb ? mockDb.Order.deleteMany(...args) : Order.deleteMany(...args);
};

module.exports = {
  User: UserWrapper,
  Product: ProductWrapper,
  Order: OrderWrapper
};
