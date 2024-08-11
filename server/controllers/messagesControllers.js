// controllers/messagesControllers.js

const Message = require('../models/Message'); // Import your Message model

// Get all messages
const getMessages = async (req, res) => {
    try {
        // Fetch all messages from the database
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { getMessages };
