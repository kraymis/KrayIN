// FriendRequests.jsx
import React from 'react';
import img from '../assets/profile.png'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom';

const FriendRequests = ({ friendRequests, error, onAcceptFriendRequest, onRejectFriendRequest }) => {
  const navigate = useNavigate();
  const navigateToUser = (userId) => {
    navigate(`/profile/${userId}`);
  };
  return (
    <div className="p-4 rounded-lg shadow-sm ml-4 mt-2">
      <h2 className="text-xl font-bold mb-4 text-white">Friend Requests</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {friendRequests.length > 0 ? (
        friendRequests.map(request => (
          <div key={request._id} className="flex justify-between items-center mb-2 p-2 border-[#9457eb] hover:border-0 hover:bg-[#4a2574] border rounded-2xl shadow-sm">
            <div className="flex items-center cursor-pointer" onClick={() => navigateToUser(request._id)}>
              <div className="h-10 w-10">
                <img src={request.profileImg || img} alt="Request" className="rounded-full" />
              </div>
              <span className="ml-3 text-white font-bold">{request.name}</span>
            </div>
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
        <div className="text-white">No friend requests found.</div>
      )}
    </div>
  );
};

export default FriendRequests;
