const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userControllers');
const protect = require('../middleware/authMiddleware');
// Signup Route
// Signup Route
router.post('/signup', registerUser);

// Login Route
router.post('/login', loginUser);

// Get current user Route
router.get('/me', protect, getMe);
module.exports = router;
