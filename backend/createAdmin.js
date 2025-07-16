import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const mongoURI =
  process.env.MONGO_URI ||
  'mongodb+srv://ganyu:66667777@cluster0.fdbg8fo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'siu@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '12345678';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      return;
    }

    // Create new admin (password will be hashed via pre-save hook)
    const adminUser = new User({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      isAdmin: true,
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${adminEmail}`);
    console.log('🔐 Password: [HIDDEN]');
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
// Note: Ensure you have the necessary environment variables set up in a .env file:
// ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME