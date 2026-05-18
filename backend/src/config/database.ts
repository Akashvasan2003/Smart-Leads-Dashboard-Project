import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL;

  if (!mongoUri) {
    throw new Error(
      `No MongoDB URI found. Available env keys: ${Object.keys(process.env).join(', ')}`
    );
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected successfully');
};

export default connectDB;
