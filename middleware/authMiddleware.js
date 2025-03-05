const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET || "your_secret");
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Invalid token" });
    }
};