// routes/messagesRoutes.js (Make sure this filename is correctly named)

const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/messagesControllers');
const protect = require('../middleware/authMiddleware'); // Ensure this middleware exists and works

// Define the route to get all messages
router.get('/getMessages', protect, getMessages);

module.exports = router;
