const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    // Read the token from the "jwt" cookie
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "Not authorized. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token failed" });
    }
};

module.exports = protect;
