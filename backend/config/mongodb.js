import mongoose from "mongoose";
const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Connection Established");
  });

  await mongoose.connect(`${process.env.DB_STRING}spotify`);
};

export default connectDB;
