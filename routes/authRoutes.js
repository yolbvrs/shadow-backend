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

module.exports = router;