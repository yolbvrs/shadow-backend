const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup Endpoint
router.post('/signup', async (req, res) => {
    const { name, email, password, role, experience, specialties } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ name, email, password: hashedPassword, role, experience, specialties });
        await user.save();

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, msg: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login Endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, msg: 'Login successful!' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// GET all registered security providers
router.get('/providers', async (req, res) => {
    try {
        const providers = await User.find({ role: 'provider' }).select('-password');
        res.json(providers);
    } catch (error) {
        console.error("Error fetching providers:", error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

// GET Logged-In User's Details
router.get('/user', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password'); // Remove password for security
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user); // Send user details (including role)
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(401).json({ msg: 'Invalid or expired token' });
    }
});

// ✅ Move this line to the **end of the file**
module.exports = router;