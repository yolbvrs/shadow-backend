const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config'); // If using config for JWT_SECRET

// ✅ User Registration Route (Public, No Token Required)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        // ✅ Generate JWT Token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || "your_secret", { expiresIn: "7d" }, (err, token) => {
            if (err) throw err;
            res.json({ token, user });
        });

    } catch (error) {
        console.error("🚨 Registration Error:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

module.exports = router;