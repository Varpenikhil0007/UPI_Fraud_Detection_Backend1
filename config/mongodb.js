import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Parse MongoDB URI and handle database name properly
        const mongoUri = process.env.MONGODB_URI;
        // const dbName = 'upi_fraud';
        const dbName = 'test';
        const uri = mongoUri.includes('?') 
            ? mongoUri.replace('?', `/${dbName}?`)
            : `${mongoUri}/${dbName}`;

        // Connection event handlers
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            // Attempt reconnection on error
            setTimeout(() => {
                console.log('Attempting to reconnect to MongoDB...');
                connectDB();
            }, 5000);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
            setTimeout(() => {
                connectDB();
            }, 5000);
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

        // Initial connection with retry logic and improved options
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            maxPoolSize: 50,
            retryWrites: true,
            w: 'majority'
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        // Instead of exiting immediately, attempt to reconnect
        setTimeout(() => {
            console.log('Retrying MongoDB connection...');
            connectDB();
        }, 5000);
    }
}

export default connectDB;