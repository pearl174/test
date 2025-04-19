const express = require("express");
const router = express.Router();
const { createMatch, endMatch } = require("../controllers/matchController");
const auth = require("../middleware/auth");

// Protected route: start a match
router.post("/create", auth, createMatch);

// Protected route: end a match
router.post("/end", auth, endMatch);

module.exports = router;
