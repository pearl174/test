const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    startTime: { type: Date, required: true }, // Start time of the match
    endTime: { type: Date },   // End time of the match (not required on creation)
    duration: { type: Number, required: false }, // Duration in minutes, not required on creation
    score: { type: String, required: true }, // Store score as "21-18, 15-21, 21-17" or similar
    players: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true }
    ],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: false } // Winner not required on creation
});

// Optional validation for 'winner' and 'duration' when match ends
MatchSchema.methods.endMatch = function (winner, score, duration) {
    this.winner = winner;
    this.score = score;
    this.duration = duration;
    this.endTime = new Date();
    return this.save();
};

module.exports = mongoose.model("Match", MatchSchema);
