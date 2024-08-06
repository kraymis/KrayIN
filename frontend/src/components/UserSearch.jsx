import React, { useState, useEffect } from 'react';
import { searchUsers, sendFriendRequest } from '../services/api'; // Adjust import according to your file structure
import { useNavigate } from 'react-router-dom';

const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      if (query.trim() === '') {
        setUsers([]);
        return;
      }

      try {
        const results = await searchUsers(query);
        setUsers(results);
      } catch (err) {
        setError('Failed to search users.');
      }
    };

    fetchUsers();
  }, [query]);

  const handleSendFriendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId);
      alert('Friend request sent!');
    } catch (err) {
      setError('Failed to send friend request.');
    }
  };

  const navigate = useNavigate();

  const navigateToUser = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="relative border-0 rounded-2xl w-[60vw] max-w-md mx-auto">
      <div className="bg-[#DAF1DE] border-0 rounded-2xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          className="border-0 p-2 rounded-2xl w-full focus:outline-[#DAF1DE] focus:ring-0 animate-pulse"
        />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="absolute top-full left-0 w-full mt-2 bg-[#DAF1DE] z-10 border-0 rounded-xl ">
        <div className={`transition-all duration-300 ${users.length > 0 ? 'max-h-60' : 'max-h-0'} overflow-y-auto border-0 rounded-xl`}>
          {users.length > 0 ? (
            users.map(user => (
              <div
                key={user._id}
                className="flex justify-between items-center mb-2 p-2 bg-white  shadow-sm border rounded-xl border-[#235347] cursor-pointer hover:bg-[#e9f5f3] m-2"
                onClick={() => navigateToUser(user._id)}
              >
                <span className="text-[#051F20] font-semibold">{user.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from triggering on the parent div
                    handleSendFriendRequest(user._id);
                  }}
                  className="bg-[#235347] hover:bg-[#1e3d34] text-white font-bold py-1 px-2 rounded"
                >
                  Send Request
                </button>
              </div>
            ))
          ) : (
            <div className="text-[#051F20]">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
