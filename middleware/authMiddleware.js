const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.replace('Bearer ', ''); // ✅ Prevents error when token is missing

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("❌ Token Verification Failed:", err.message);
        res.status(401).json({ msg: "Invalid or expired token" });
    }
};