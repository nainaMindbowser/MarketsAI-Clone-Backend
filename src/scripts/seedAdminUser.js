const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const seedAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });

    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_LOGIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    const adminUser = new User({
      email: process.env.ADMIN_LOGIN_EMAIL,
      password: process.env.ADMIN_LOGIN_PASSWORD,
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    console.log(`Email: ${adminUser.email}`);
    console.log(`Name: ${adminUser.fullName}`);
    console.log(`Role: ${adminUser.role}`);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedAdminUser();
