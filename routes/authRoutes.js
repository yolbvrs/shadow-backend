const express = require('express');
const router = express.Router();

console.log("✅ authRoutes.js loaded");

router.get('/test', (req, res) => {
    res.json({ msg: "✅ Auth route is working!" });
});

module.exports = router;