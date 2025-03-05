const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(express.json()); // Parses JSON requests
app.use(cors()); // Allows cross-origin requests

// ✅ Test Route (Check if API is Working)
app.get('/api/test', (req, res) => {
    res.json({ msg: "✅ API is working!" });
});

// ✅ Sample Route for Authentication Testing
app.get('/api/auth/test', (req, res) => {
    res.json({ msg: "✅ Auth route is working!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
