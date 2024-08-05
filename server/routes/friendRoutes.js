// routes/friendRoutes.js

const express = require('express');
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest ,showFriendRequests,
    deleteFriend,getFriends } = require('../controllers/friendControllers');
// const { heheho } = require('../controllers/friendControllers');
const protect = require('../middleware/authMiddleware');

router.post('/send',protect, sendFriendRequest);
router.post('/accept', protect, acceptFriendRequest);
router.post('/reject', protect, rejectFriendRequest);
router.get('/requests', protect, showFriendRequests); // Add this route to show friend requests
router.delete('/', protect, deleteFriend); // Add this route to delete a friend
router.get('/', protect, getFriends);

module.exports = router;
