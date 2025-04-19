const Profile = require("../models/Profile");

// Send a friend request
const sendFriendRequest = async (req, res) => {
    const senderId = req.user.id;
    const { username } = req.body;

    try {
        const sender = await Profile.findOne({ user: senderId });
        const receiver = await Profile.findOne({ username });

        if (!sender || !receiver) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (receiver.friendRequests.includes(sender._id)) {
            return res.status(400).json({ msg: "Friend request already sent" });
        }

        receiver.friendRequests.push(sender._id);
        await receiver.save();

        res.status(200).json({ msg: "Friend request sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Accept friend request
const acceptFriendRequest = async (req, res) => {
    const receiverId = req.user.id;
    const { requesterId } = req.body;

    try {
        const receiver = await Profile.findOne({ user: receiverId });
        const requester = await Profile.findById(requesterId);

        if (!receiver || !requester) {
            return res.status(404).json({ msg: "Profile not found" });
        }

        if (!receiver.friendRequests.includes(requester._id)) {
            return res.status(400).json({ msg: "No friend request from this user" });
        }

        receiver.friends.push(requester._id);
        requester.friends.push(receiver._id);

        receiver.friendRequests = receiver.friendRequests.filter(
            id => id.toString() !== requester._id.toString()
        );

        await receiver.save();
        await requester.save();

        res.status(200).json({ msg: "Friend request accepted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Reject friend request
const rejectFriendRequest = async (req, res) => {
    const receiverId = req.user.id;
    const { requesterId } = req.body;

    try {
        const receiver = await Profile.findOne({ user: receiverId });

        if (!receiver) {
            return res.status(404).json({ msg: "Profile not found" });
        }

        receiver.friendRequests = receiver.friendRequests.filter(
            id => id.toString() !== requesterId
        );

        await receiver.save();
        res.status(200).json({ msg: "Friend request rejected" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Remove a friend
const deleteFriend = async (req, res) => {
    const userId = req.user.id;
    const { friendId } = req.body;

    try {
        const profile = await Profile.findOne({ user: userId });
        const friend = await Profile.findById(friendId);

        if (!profile || !friend) {
            return res.status(404).json({ msg: "Profile not found" });
        }

        profile.friends = profile.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== profile._id.toString());

        await profile.save();
        await friend.save();

        res.status(200).json({ msg: "Friend removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Get friend list
const getFriendList = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("friends", "username");
        if (!profile) return res.status(404).json({ msg: "Profile not found" });

        res.status(200).json({ friends: profile.friends });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

// Get incoming friend requests
const getFriendRequests = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("friendRequests", "username");
        if (!profile) return res.status(404).json({ msg: "Profile not found" });

        res.status(200).json({ friendRequests: profile.friendRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    deleteFriend,
    getFriendList,
    getFriendRequests,
};
