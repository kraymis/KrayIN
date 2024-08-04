// routes/testRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Make sure the path is correct
const protect = require('../middleware/authMiddleware');


// Define the test route
router.get('/test-friends/:userId',protect, async (req, res) => {
  const { userId } = req.params; // Get userId from route parameters

  try {
    // Find the user and populate the 'friends' field
    const user = await User.findById(userId).populate('friends');

    // Extract friend IDs
    const friendIds = user.friends.map(friend => friend._id);
    const posts = await Post.find({ user: { $in: [...friendIds, userId] } })
    .populate('user', 'name')
    .populate('comments')
    .sort({ createdAt: -1 });

    // Respond with the friend IDs for testing
    res.status(200).json({ friendIds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
