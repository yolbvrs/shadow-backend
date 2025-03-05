const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

console.log("✅ authRoutes.js loaded");

router.get('/test', (req, res) => {
    res.json({ msg: "✅ Auth route is working!" });
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, userId: user.id, role: user.role, msg: "Login successful!" });
    } catch (error) {
        console.error("❌ Login error:", error.message);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;