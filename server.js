const express = require('express');
const cors = require('cors');
const connectDB = require('./config');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes'); // ✅ Import job routes

require('dotenv').config();
const app = express(); // ✅ Ensure `app` is declared BEFORE using it

app.use(express.json());
app.use(cors({
    origin: "https://yolbvrs.github.io",  // Allow frontend access
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
}));

// Connect to MongoDB
connectDB();

// Test Route (To check if server is running)
app.get('/', (req, res) => {
    res.send('Welcome to SHADOW!🚀');
});

// ✅ Make sure `app.use` is placed AFTER declaring `app`
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);  // ✅ Job routes now properly registered

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));