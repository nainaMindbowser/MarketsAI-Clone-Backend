const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });

    const users = await User.find({}, "-password").lean();

    console.log("\n=== Users in Database ===");
    users.forEach((user) => {
      const fullName =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : "Not set";

      console.log(`ID: ${user._id}`);
      console.log(`Email: ${user.email}`);
      console.log(`First Name: ${user.firstName || "Not set"}`);
      console.log(`Last Name: ${user.lastName || "Not set"}`);
      console.log(`Full Name: ${fullName}`);
      console.log(`Role: ${user.role}`);
      console.log(`Active: ${user.isActive}`);
      console.log(`Last Login: ${user.lastLoginAt || "Never"}`);
      console.log(`Created: ${user.createdAt}`);
      console.log("---");
    });

    console.log(`Total users: ${users.length}`);
  } catch (error) {
    console.error("Error listing users:", error);
  } finally {
    await mongoose.connection.close();
  }
};

listUsers();
