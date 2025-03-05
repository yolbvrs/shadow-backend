const express = require('express');
const router = express.Router();

console.log("✅ jobRoutes.js loaded");

router.get('/test', (req, res) => {
    res.json({ msg: "✅ Jobs route is working!" });
});

module.exports = router;