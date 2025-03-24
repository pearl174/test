const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true, unique: true }, // To avoid extra lookups
    matchesPlayed: { type: Number, default: 0 },
    matchesWon: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    ranking: { type: Number, default: null }, 
    bio: { type: String, default: "" },
    averageMatchDuration: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    profilePic: { type: String, default: "" },
    lastMatchDate: { type: Date, default: null },
    activityLog: { type: Map, of: Number, default: {} } 
});

module.exports = mongoose.model("Profile", ProfileSchema);
