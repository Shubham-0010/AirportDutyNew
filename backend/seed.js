require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const adminExists = await User.findOne({ role: 'ADMIN' });
  if (adminExists) {
    console.log('Admin already exists, skipping seed');
    process.exit(0);
  }

  await User.create({
    name: 'Admin User',
    username: 'admin',
    email: 'admin@airport.com',
    password: 'admin123',
    phone: '9000000000',
    employeeId: 'EMP001',
    role: 'ADMIN',
    isEnabled: true,
  });

  console.log('Admin created — username: admin | password: admin123');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
