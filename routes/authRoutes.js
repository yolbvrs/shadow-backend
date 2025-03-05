const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // ✅ Make sure this is correct

const router = express.Router();

// ✅ Sign-Up Route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, experience, specialties, idNumber, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ name, email, phone, experience, specialties, idNumber, password: hashedPassword, role });
        await user.save();

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, msg: 'User registered successfully!' });
    } catch (error) {
        console.error("❌ Error in signup:", error.message);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

router.get('/user', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password'); // ✅ Make sure this is correct

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("❌ Error fetching user:", error.message);
        res.status(401).json({ msg: "Invalid or expired token" });
    }
});

module.exports = router;