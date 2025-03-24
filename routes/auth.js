const express = require("express");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
require("dotenv").config(); // Load .env variables at the top of your file

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router(); // allows defining routes in separate file
// as we are doing here

// register route
router.post(
    "/register",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Include a valid email").isEmail(),
        check("password", "Password must be 6 or more chars").isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ msg: "User already exists" });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({ name, email, password: hashedPassword });
            await user.save();

            const payload = { user: { id: user.id } };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

            res.json({ token });
        } catch (err) {
            res.status(500).send("Server Error");
        }
    }
);

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