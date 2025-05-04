import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI as string;
    await mongoose.connect(uri);
    console.log(`Connected to database asset`);
  } catch (error) {
    console.error('db connection error:', error);
    process.exit(1);
  }
};
