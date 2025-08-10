const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    deleteFriend,
    getFriendList,
    getFriendRequests,
    getUsers,
} = require("../controllers/friendController");

router.post("/send", auth, sendFriendRequest);
router.post("/accept", auth, acceptFriendRequest);
router.post("/reject", auth, rejectFriendRequest);
router.post("/delete", auth, deleteFriend);
router.get("/list", auth, getFriendList);
router.get("/requests", auth, getFriendRequests);
router.get("/users", auth, getUsers);

module.exports = router;
