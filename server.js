const express = require('express');
const cors = require('cors');
const connectDB = require('./config');
const authRoutes = require('./routes/authRoutes'); // ✅ Ensure it's imported only once
const jobRoutes = require('./routes/jobRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: "https://yolbvrs.github.io",  
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
}));

// ✅ Connect to MongoDB
connectDB();

// ✅ Use Authentication & Job Routes Only Once
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));