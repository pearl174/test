const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    startTime: { type: Date }, // Start time of the match
    endTime: { type: Date },   // End time of the match
    duration: { type: Number, required: true }, // in minutes maybe
    score: { type: String, required: true }, // store as "21-18, 15-21, 21-17" or similar
    players: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true }
    ],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true }
});

module.exports = mongoose.model("Match", MatchSchema);
