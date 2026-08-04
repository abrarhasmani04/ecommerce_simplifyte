import mongoose from "mongoose";

const connectDB = async () => {
  const connect = await mongoose.connect(process.env.MONGODB_URI);

  if (connect) {
    console.log("Database connected!!!");
  } else {
    console.log("Failed to connect Database!!!");
  }
};

export default connectDB