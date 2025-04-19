const Profile = require("../models/ProfileSchema");

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["username", "email"]);
    if (!profile) return res.status(404).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  const { bio, profilePic } = req.body;
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ msg: "Profile not found" });

    profile.bio = bio || profile.bio;
    profile.profilePic = profilePic || profile.profilePic;

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
