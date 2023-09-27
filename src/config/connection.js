import mongoose from 'mongoose';

export async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.log('Error while connecting to database', error);
  }
}
