import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json()); // giúp express đọc hiểu request body dạng json

// public routes


// private routes


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
