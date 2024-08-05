import React, { useState, useEffect } from 'react';
import { searchUsers, sendFriendRequest } from '../services/api'; // Adjust import according to your file structure

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

  return (
    <div className="mt-6">
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Search Users</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          className="border p-2 rounded mb-4 w-full"
        />
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {users.length > 0 ? (
          users.map(user => (
            <div key={user._id} className="flex justify-between items-center mb-2 p-2 bg-white rounded shadow-sm">
              <span>{user.name}</span>
              <button
                onClick={() => handleSendFriendRequest(user._id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              >
                Send Friend Request
              </button>
            </div>
          ))
        ) : (
          <div>No users found.</div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
