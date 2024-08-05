// controllers/friendControllers.js

const User = require('../models/User');

// Send friend request
const sendFriendRequest = async (req, res) => {

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





// Show all friend requests
const showFriendRequests = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('friendRequests', 'name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.friendRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a friend
const deleteFriend = async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.body;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: 'Friend deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getFriends = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('friends', 'name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  showFriendRequests,
  deleteFriend,
};