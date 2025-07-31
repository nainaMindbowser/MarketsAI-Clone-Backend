const mongoose = require("mongoose");
const MESSAGES = require("../constants/messages");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: process.env.DB_NAME,
    });
    console.log(
      MESSAGES.DATABASE.CONNECTED.replace("{host}", conn.connection.host)
    );
  } catch (error) {
    console.error(MESSAGES.DATABASE.ERROR, error);
    process.exit(1);
  }
};

module.exports = connectDB;
