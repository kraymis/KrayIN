// routes/friendRoutes.js

const express = require('express');
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = require('../controllers/friendControllers');
// const { heheho } = require('../controllers/friendControllers');
const protect = require('../middleware/authMiddleware');

router.post('/send', sendFriendRequest);
router.post('/accept', protect, acceptFriendRequest);
router.post('/reject', protect, rejectFriendRequest);
module.exports = router;
