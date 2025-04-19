// checking for jwt token in the request
// verifying it
// if either process fails, returning 401
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // attach user to request obj
        next();    
    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
};