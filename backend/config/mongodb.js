import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.DB_STRING);

  isConnected = true;
};

export default connectDB;
