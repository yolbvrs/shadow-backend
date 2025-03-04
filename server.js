const express = require('express');
const cors = require('cors');
const connectDB = require('./config'); // ✅ MongoDB connection
const authRoutes = require('./routes/authRoutes'); // ✅ Authentication routes
const jobRoutes = require('./routes/jobRoutes'); // ✅ Job management routes
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(express.json()); // Parses JSON body
app.use(cors({
    origin: "https://yolbvrs.github.io",  // ✅ Allows frontend requests
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
}));

// ✅ Connect to MongoDB
connectDB();

// ✅ Test Route (Check if Server is Running)
app.get('/', (req, res) => {
    res.send('Welcome to SHADOW API 🚀');
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// ✅ Global Error Handling (Catches Unexpected Errors)
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.message);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));