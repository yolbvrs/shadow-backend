const express = require('express');
const router = express.Router(); // ✅ Declare router only once
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ Ensure middleware is imported

// ✅ User Authentication Route (Check Logged-in User)
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// ✅ Export router only once
module.exports = router;