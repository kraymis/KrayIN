// FriendsList.jsx
import React from 'react';
import img from '../assets/profile.png'; // Adjust the path if necessary

const FriendsList = ({ friends, error, onDeleteFriend }) => {
  return (
    <div className="w-full p-4 rounded-lg  shadow-sm mt-2">
      <h2 className="text-xl font-bold mb-4 text-white">Friends</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {friends.length > 0 ? (
        friends.map(friend => (
          <div key={friend._id} className="flex justify-between items-center mb-2 p-2 rounded-2xl border-[#DAF1DE] border shadow-sm">
            <div className="flex items-center">
              <div className="h-10 w-10">
                <img src={friend.profileImg || img} alt="Friend" className="rounded-full" />
              </div>
              <span className="ml-3 text-white font-bold">{friend.name}</span>
            </div>
            <button
              onClick={() => onDeleteFriend(friend._id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <div className="text-white">No friends found.</div>
      )}
    </div>
  );
};

export default FriendsList;
