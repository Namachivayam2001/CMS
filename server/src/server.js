require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const departmentRouts = require('./routes/departmentRouts');
const studentRuters = require('./routes/studentRoutes');
const userRouters = require("./routes/userRoutes");
const teacherRouters = require("./routes/teacherRoutes");
const hodReducers = require('./routes/hodRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const courseRoutes = require('./routes/courseRoutes');
const classRoutes = require('./routes/classRoutes');
const academicYearRoutes = require('./routes/academicYearRoutes');
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
app.use('/api/department', departmentRouts);
app.use('/api/student', studentRuters);
app.use('/api/user', userRouters);
app.use('/api/teacher', teacherRouters);
app.use('/api/hod', hodReducers);
app.use('/api', attendanceRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/class', classRoutes);
app.use('/api/academicYear', academicYearRoutes);

// Health check endpoint

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
