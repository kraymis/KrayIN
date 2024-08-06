import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import the useParams hook
import axios from 'axios';
import img from "../assets/profile.png"; // Default profile image
import { sendFriendRequest, getPostsByUserId, likePost, unlikePost, addComment } from '../services/api';
import Post from '../components/Post';
import Navbar from '../components/NavBar';
import { logout } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ currentUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [posts, setPosts] = useState([]);
  const { userId } = useParams(); // Use useParams to get userId from URL
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userPosts = await getPostsByUserId(userId);
        setPosts(userPosts);
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(response.data);
        setIsCurrentUser(currentUser.id === userId);
        setIsFriend(response.data.friends.includes(currentUser.id));
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
      console.error('Failed to send friend request.', err);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      setPosts(posts.map(post => post._id === postId ? { ...post, likes: [...post.likes, user._id], numberOfLikes: post.numberOfLikes + 1, userLiked: true } : post));
      await likePost(postId);
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const handleUnlikePost = async (postId) => {
    try {
      await unlikePost(postId);
      setPosts(posts.map(post => post._id === postId ? { ...post, numberOfLikes: post.numberOfLikes - 1, likes: post.likes.filter(id => id !== user._id), userLiked: false } : post));
    } catch (err) {
      console.error('Failed to unlike post', err);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    try {
      const commentData = { text: commentText };
      const comment = await addComment(postId, commentData);
  
      setPosts(posts.map(post =>
        post._id === postId ? { ...post, comments: [...post.comments, comment] } : post
      ));
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError(err.response.data.message || 'Logout failed');
    }
  };

  if (!user && isCurrentUser===null) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Navbar onLogout={handleLogout}/>
    <div className="h-screen p-4 bg-[#071818]">
      <div className="flex flex-col items-center bg-[#235347] p-6 rounded-lg shadow-md mb-6">
        <img src={img} alt="Profile" className="h-24 w-24 rounded-full mb-4" />
        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
        <p className="text-gray-200">{user.email}</p>
        {!isCurrentUser && !isFriend && (
          <button
            onClick={() => handleSendFriendRequest(user._id)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Add Friend
          </button>
        )}
      </div>

      {isCurrentUser && (
      <div className="flex justify-content">
          <div>
            <h2 className="text-2xl text-white font-bold mb-4">Your Posts</h2>
            {posts.map(post => (
              <Post
                key={post._id}
                post={post}
                onLike={handleLikePost}
                onUnlike={handleUnlikePost}
                onAddComment={handleAddComment}
              />
            ))}
          </div>
          <div>
            <h2 className="text-2xl text-white font-bold mb-4">Your Friends</h2>
            <div className="flex flex-wrap">
              {user.friends.map(friend => (
                <div key={friend._id} className="flex items-center bg-[#235347] p-2 rounded-lg shadow-md m-2">
                  <img src={img} alt="Profile" className="h-12 w-12 rounded-full" />
                  <p className="text-white ml-2">{friend.name}</p>
                </div>
              ))}
            </div>
          </div>
      </div>
      )}

      {!isCurrentUser && isFriend && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{user.name}'s Posts</h2>
          {posts.map(post => (
            <Post
              key={post._id}
              post={post}
              onLike={handleLikePost}
              onUnlike={handleUnlikePost}
              onAddComment={handleAddComment}
            />
          ))}
        </div>
      )}
    </div>
  </>
  );
};

export default ProfilePage;
