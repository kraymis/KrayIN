// FriendRequests.jsx
import React from 'react';

const FriendRequests = ({ friendRequests, error, onAcceptFriendRequest, onRejectFriendRequest }) => {
  return (
    <div className="w-2/3 bg-gray-100 p-4 rounded ml-4">
      <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {friendRequests.length > 0 ? (
        friendRequests.map(request => (
          <div key={request._id} className="flex justify-between items-center mb-2 p-2 bg-white rounded shadow-sm">
            <span>{request.name}</span>
            <div>
              <button
                onClick={() => onAcceptFriendRequest(request._id)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
              >
                Accept
              </button>
              <button
                onClick={() => onRejectFriendRequest(request._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>No friend requests found.</div>
      )}
    </div>
  );
};

export default FriendRequests;
