import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import the useParams hook
import axios from 'axios';
import img from "../assets/profile.png"; // Default profile image
import { sendFriendRequest } from '../services/api';

const ProfilePage = ({ currentUser }) => {
  const [user, setUser] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { userId } = useParams(); // Use useParams to get userId from URL

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(response.data);
        console.log(response.data);
        console.log(currentUser.id);
        setIsCurrentUser(currentUser.id === userId);
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };

    fetchUser();
  }, [userId, currentUser]); // Add userId and currentUser as dependencies

  const handleSendFriendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId);
      alert('Friend request sent!');
    } catch (err) {
      setError('Failed to send friend request.');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <img src={user.profileImg || img} alt="Profile" className="h-16 w-16 rounded-full mr-4" />
        <h1 className="text-2xl font-bold">{user.name}</h1>
      </div>
      <p>Email: {user.email}</p>
      {/* Add more user information as needed */}
      
      {!isCurrentUser && (
        <button
          onClick={handleSendFriendRequest}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Add Friend
        </button>
      )}
    </div>
  );
};

export default ProfilePage;
