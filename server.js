const express = require('express');
const cors = require('cors');
const connectDB = require('./config'); // ✅ MongoDB connection
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(express.json()); // Parses JSON requests
app.use(cors()); // Allows cross-origin requests

console.log("✅ Server is running...");

// ✅ Connect to MongoDB (before loading routes)
connectDB();

// ✅ Test Route (Check if API is Working)
app.get('/api/test', (req, res) => {
    res.json({ msg: "✅ API is working!" });
});

// ✅ Sample Route for Authentication Testing
app.get('/api/auth/test', (req, res) => {
    res.json({ msg: "✅ Auth route is working!" });
});

// ✅ Main Route (Landing Page)
app.get('/', (req, res) => {
    res.send('Welcome to SHADOW API 🚀');
});

// ✅ Load Routes
try {
    const authRoutes = require('./routes/authRoutes');
    const jobRoutes = require('./routes/jobRoutes');

    console.log("✅ Routes loaded successfully!");

    app.use('/api/auth', authRoutes);
    app.use('/api/jobs', jobRoutes);
} catch (error) {
    console.error("🚨 Error loading routes:", error.message);
}

// ✅ Contact Route (Fixed)
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        console.log(`📩 New Contact Form Submission:
        Name: ${name}
        Email: ${email}
        Message: ${message}`);

        res.json({ msg: "Message sent successfully!" });
    } catch (error) {
        console.error("❌ Contact form error:", error);
        res.status(500).json({ msg: "Server error, try again later." });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));