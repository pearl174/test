const Match = require("../models/Match");
const Profile = require("../models/Profile");

// Helper function to update streak and activity log
const updateProfileStreakAndActivityLog = async (profile) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Strip time

    const lastMatch = profile.lastMatchDate ? new Date(profile.lastMatchDate) : null;
    if (lastMatch) lastMatch.setHours(0, 0, 0, 0);

    // Update activity log
    const key = today.toISOString().split("T")[0];
    const currentCount = profile.activityLog.get(key) || 0;
    profile.activityLog.set(key, currentCount + 1);

    // Streak logic
    if (!lastMatch || lastMatch.getTime() !== today.getTime()) {
        profile.streak = lastMatch && ((today - lastMatch) === 86400000) ? profile.streak + 1 : 1;
    }

    profile.lastMatchDate = new Date();
    await profile.save();
};

// Controller to create a match
const createMatch = async (req, res) => {
    try {
        const { opponentUsername } = req.body;
        const userId = req.user.id;

        const player1Profile = await Profile.findOne({ user: userId });
        const player2Profile = await Profile.findOne({ username: opponentUsername });

        if (!player1Profile || !player2Profile) {
            return res.status(404).json({ msg: "One or both profiles not found" });
        }

        if (
            !player1Profile.friends.includes(player2Profile._id) ||
            !player2Profile.friends.includes(player1Profile._id)
        ) {
            return res.status(400).json({ msg: "Players must be friends to challenge each other" });
        }

        const match = new Match({
            players: [player1Profile._id, player2Profile._id],
            startTime: new Date(),
            score: "0-0",
            winner: null,
        });

        await match.save();

        await updateProfileStreakAndActivityLog(player1Profile);
        await updateProfileStreakAndActivityLog(player2Profile);

        res.status(201).json({ msg: "Match created", match });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

// Controller to end a match
const endMatch = async (req, res) => {
    try {
        const { matchId, finalScore, winnerUsername } = req.body;

        const match = await Match.findById(matchId);
        if (!match) return res.status(404).json({ msg: "Match not found" });

        const endTime = new Date();
        const duration = Math.floor((endTime - new Date(match.startTime)) / 60000);

        const winnerProfile = await Profile.findOne({ username: winnerUsername });
        if (!winnerProfile) return res.status(404).json({ msg: "Winner profile not found" });

        // Update match
        match.duration = duration;
        match.score = finalScore;
        match.winner = winnerProfile._id;
        await match.save();

        // Update both players
        const [player1, player2] = await Promise.all([
            Profile.findById(match.players[0]),
            Profile.findById(match.players[1]),
        ]);

        for (const player of [player1, player2]) {
            player.matchesPlayed += 1;
            if (player._id.toString() === winnerProfile._id.toString()) {
                player.matchesWon += 1;
            }

            player.winRate = player.matchesWon / player.matchesPlayed;
            player.averageMatchDuration = ((player.averageMatchDuration * (player.matchesPlayed - 1)) + duration) / player.matchesPlayed;
            await player.save();
        }

        res.status(200).json({ msg: "Match ended and stats updated", match });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = { createMatch, endMatch };
