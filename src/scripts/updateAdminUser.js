const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const updateAdminUser = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", process.env.MONGODB_URI ? "Set" : "Not set");
    console.log("DB Name:", process.env.DB_NAME ? "Set" : "Not set");

    // Connect to MongoDB with additional options
    await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB successfully");

    // Find existing admin user
    const existingAdmin = await User.findOne({
      email: "admin@marketsai.com",
    });

    if (!existingAdmin) {
      console.log("Admin user not found. Please create the admin user first.");
      return;
    }

    console.log("Admin user found. Current data:", {
      email: existingAdmin.email,
      firstName: existingAdmin.firstName,
      lastName: existingAdmin.lastName,
      role: existingAdmin.role,
    });

    console.log("Updating with new fields...");

    // Update existing admin user with new fields
    existingAdmin.firstName = "Naina";
    existingAdmin.lastName = "Premani";
    existingAdmin.password = "MarketsCRM09890"; // Will be hashed by pre-save middleware

    await existingAdmin.save();
    console.log("Admin user updated successfully");
    console.log(`Email: ${existingAdmin.email}`);
    console.log(`Name: ${existingAdmin.fullName}`);
    console.log(`Role: ${existingAdmin.role}`);
  } catch (error) {
    console.error("Error updating admin user:", error);
    if (error.name === "MongooseServerSelectionError") {
      console.error("MongoDB connection failed. Please check:");
      console.error("1. MongoDB URI is correct");
      console.error("2. Network connection");
      console.error("3. IP whitelist in MongoDB Atlas");
      console.error("4. Database credentials");
    }
  } finally {
    // Close connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("Database connection closed");
    }
  }
};

// Run the update function
updateAdminUser();
