// FriendsList.jsx
import React from 'react';

const FriendsList = ({ friends, error, onDeleteFriend }) => {
  return (
    <div className="w-1/3 bg-gray-200 p-4 rounded">
      <h2 className="text-xl font-bold mb-4">Friends</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {friends.length > 0 ? (
        friends.map(friend => (
          <div key={friend._id} className="flex justify-between items-center mb-2 p-2 bg-white rounded shadow-sm">
            <span>{friend.name}</span>
            <button
              onClick={() => onDeleteFriend(friend._id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <div>No friends found.</div>
      )}
    </div>
  );
};

export default FriendsList;
