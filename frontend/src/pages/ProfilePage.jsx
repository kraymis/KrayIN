import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import the useParams hook
import axios from 'axios';
import img from "../assets/profile.png"; // Default profile image
import { sendFriendRequest, getPostsByUserId, likePost, unlikePost, addComment,getFriends ,getUserData} from '../services/api';
import Post from '../components/Post';
import Navbar from '../components/NavBar';
import { logout } from '../services/api';
import { useNavigate } from 'react-router-dom';
import FriendsList from '../components/FriendsList';
import messageimg from '../assets/envoyer.png';
import messageimgwhite from '../assets/envoyerwhite.png';

const ProfilePage = ({ currentUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [posts, setPosts] = useState([]);
  const { userId } = useParams(); // Use useParams to get userId from URL
  const [friends, setFriends] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const API_URL = 'http://localhost:5000';


  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userPosts = await getPostsByUserId(userId);
        setPosts(userPosts);
        const response = await axios.get(`${API_URL}/api/users/${userId}`);
        setUser(response.data);
        setIsCurrentUser(currentUser.id === userId);
        setIsFriend(response.data.friends.includes(currentUser.id));
        const friendsData = await getFriends();
        setFriends(friendsData);

      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };

    fetchUser();
  }, [userId, currentUser,posts]); // Add userId and currentUser as dependencies

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleSendFriendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId);
      alert('Friend request sent!');
    } catch (err) {
      console.error('Failed to send friend request.', err);
    }
  };
  const handleClickMessage = () => {
    navigate(`/chat`); // Navigate to the user's profile page
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
  const handleDeleteFriend = async (friendId) => {
    try {
      await deleteFriend(friendId);
      setFriends(friends.filter(friend => friend._id !== friendId));
    } catch (err) {
      console.error('Failed to delete friend', err);
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
    <div className='bg-[#0f0822] h-full'>
    <Navbar onLogout={handleLogout}/>
    <div className="min-h-screen p-4 bg-[#0f0822]">
      <div className="flex flex-col items-center bg-[#9457eb] p-6 rounded-lg shadow-md mb-6">
        <img src={img} alt="Profile" className="h-24 w-24 rounded-full mb-4" />
        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
        <p className="text-gray-200">{user.email}</p>
        {!isCurrentUser && !isFriend && (
          <div className='flex justify-center gap-4'>
          <button
            onClick={() => handleSendFriendRequest(user._id)}
            className="bg-[#f0f0ff] text-[#4a2574]  hover:bg-[#4a2574] hover:text-white font-bold py-2 px-4 rounded mt-4"
          >
            Add Friend
          </button>

          </div>


        )}
          {!isCurrentUser && isFriend && (
          <div className='flex justify-center gap-4'>
            <button
              onClick={() => handleClickMessage()}
              className="bg-[#f0f0ff] text-[#4a2574] hover:bg-[#4a2574] hover:text-white font-bold py-2 px-4 rounded mt-4 flex items-center gap-2 transition-all duration-300"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={isHovered ? messageimgwhite : messageimg}
                alt="Message"
                className="h-6 w-6"
              />
              Message
            </button>

          </div>


        )}
      </div>

      {isCurrentUser && (
      <div className="flex justify-center gap-8">
          <div className='flex flex-col w-[36vw] mt-2 p-4'>
            <h2 className="text-xl text-white font-bold mb-4 ">Your Posts</h2>
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
          <div className='w-[36vw]'>
            <div className="flex flex-col ">
            <FriendsList
              friends={friends}
              
              onDeleteFriend={handleDeleteFriend}
            />
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
  </div>
  );
};

export default ProfilePage;
