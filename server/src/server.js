require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const connectDB  = require('./config/db');

const PORT = process.env.PORT || 8080;

const app = express();

// Connect to MongoDB
let dbConnected = false;
connectDB().then(connected => {
    dbConnected = connected;
    if (connected) {
        console.log('Database connection successful');
    } else {
        console.log('Database connection failed - running in limited mode');
    }
}).catch(err => {
    console.error('Database connection error:', err);
    console.log('Running in limited mode without database');
});

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/health', async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        database: dbConnected ? 'connected' : 'disconnected'
    });
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});
