// controllers/friendControllers.js

const User = require('../models/User');

// Send friend request
const sendFriendRequest = async (req, res) => {
res.status(200).json({ message: 'kayna frr' });

  const { recipientId } = req.body;
  const senderId = req.user.id;

  if (recipientId === senderId) {
    return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
  }

  const recipient = await User.findById(recipientId);
  const sender = await User.findById(senderId);

  if (!recipient || !sender) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (recipient.friendRequests.includes(senderId) || recipient.friends.includes(senderId)) {
    return res.status(400).json({ message: 'Friend request already sent' });
  }

  recipient.friendRequests.push(senderId);
  await recipient.save();

  res.status(200).json({ message: 'Friend request sent' });
};




// Accept friend request
const acceptFriendRequest = async (req, res) => {
  const { requesterId } = req.body;
  const recipientId = req.user.id;

  const requester = await User.findById(requesterId);
  const recipient = await User.findById(recipientId);

  if (!requester || !recipient) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!recipient.friendRequests.includes(requesterId)) {
    return res.status(400).json({ message: 'Friend request not found' });
  }

  recipient.friends.push(requesterId);
  requester.friends.push(recipientId);

  recipient.friendRequests = recipient.friendRequests.filter(id => id.toString() !== requesterId);
  await recipient.save();
  await requester.save();

  res.status(200).json({ message: 'Friend request accepted' });
};

// Reject friend request
const rejectFriendRequest = async (req, res) => {
  const { requesterId } = req.body;
  const recipientId = req.user.id;

  const recipient = await User.findById(recipientId);

  if (!recipient) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!recipient.friendRequests.includes(requesterId)) {
    return res.status(400).json({ message: 'Friend request not found' });
  }

  recipient.friendRequests = recipient.friendRequests.filter(id => id.toString() !== requesterId);
  await recipient.save();

  res.status(200).json({ message: 'Friend request rejected' });
};





module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};
