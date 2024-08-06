const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  profileImg: { type: String, default: 'D:\Fsociety\Kraymis\Front-End\JWTapp\server\pictures\profile.png' }, // Add this line for profile image


}
,{timestamps:true});

module.exports = mongoose.model('User', UserSchema);
