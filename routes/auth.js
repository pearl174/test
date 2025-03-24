const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Profile = require("../models/ProfileSchema");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

router.post(
    "/register",
    [
        check("username", "Username is required").not().isEmpty(),
        check("email", "Include a valid email").isEmail(),
        check("password", "Password must be 6 or more chars").isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, email, password } = req.body;

        try {
            // Check if email already exists
            let existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ msg: "Email already exists" });
            }

            // Check if username already exists
            let existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ msg: "Username already taken" });
            }

            user = new User({ username, email, password: await bcrypt.hash(password, 10) });
            await user.save();

            // Create a default profile for the user
            const profile = new Profile({ user: user._id, username });
            await profile.save();

            const payload = { user: { id: user.id } };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

            res.json({ token });
        } catch (err) {
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;

// login route
router.post(
    "/login",
    [
        check("email", "Include a valid email").isEmail(),
        check("password", "Password is required").exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) return res.status(400).json({ msg: "Invalid Credentials (User does not exist)" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials (wrong password)" });

            const payload = { user: {id: user.id } };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

            res.json({ token });
        } catch(err) {
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;