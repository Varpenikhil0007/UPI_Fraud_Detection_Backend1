import dotenv from 'dotenv';

// Load environment variables before other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/auth.routes.js';
import reportRoutes from './routes/reportRoutes.js';
import idValidationRouter from './routes/idValidation.js';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/id', idValidationRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});