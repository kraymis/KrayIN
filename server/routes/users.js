const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { searchUsers } = require('../controllers/userControllers');


// Get all users (example route)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/search', searchUsers);

module.exports = router;
