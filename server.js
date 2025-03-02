 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: "https://yolbvrs.github.io", // Allows requests from GitHub Pages
    methods: "GET,POST,PUT,DELETE",
    credentials: true

// Connect to MongoDB
connectDB();

// Test Route (To check if server is running)
app.get('/', (req, res) => {
    res.send('Welcome to SHADOW!🚀');
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));