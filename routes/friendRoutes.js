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
} = require("../controllers/friendController");

router.post("/send", auth, sendFriendRequest);
router.post("/accept", auth, acceptFriendRequest);
router.post("/reject", auth, rejectFriendRequest);
router.post("/delete", auth, deleteFriend);
router.get("/list", auth, getFriendList);
router.get("/requests", auth, getFriendRequests);

module.exports = router;
