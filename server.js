const express = require('express');
const cors = require('cors');
const connectDB = require('./config'); // ✅ Connect MongoDB
const authRoutes = require('./routes/authRoutes'); // ✅ Authentication Routes
const jobRoutes = require('./routes/jobRoutes'); // ✅ Job Management Routes
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: "https://yolbvrs.github.io",  // ✅ Allow frontend to communicate with backend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
}));

// ✅ Connect to MongoDB
connectDB();

// ✅ Base Test Route (Check if Server is Running)
app.get('/', (req, res) => {
    res.send('Welcome to SHADOW!🚀');
});

// ✅ Use Authentication & Job Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes); // ✅ Ensures job routes work

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));