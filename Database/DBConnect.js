const mongoose = require("mongoose");

const connectDB = async () => {
  const URI =
    "mongodb+srv://6sense_admin:VNJ7VDw6srFNulMO@cluster0.h1s1dxg.mongodb.net/6senseDB?retryWrites=true&w=majority&appName=Cluster0";
  try {
    await mongoose.connect(URI);
    console.log("Database connection successful.");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

module.exports = connectDB;
