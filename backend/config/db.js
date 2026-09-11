import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log('Supabase active as primary database.');
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected (legacy sync): ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB connection notice: ${error.message}`);
  }
};

export default connectDB;
