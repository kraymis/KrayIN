import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, logout, createPost, getPosts, likePost, unlikePost, addComment ,getFriends,getFriendRequests, deleteFriend, acceptFriendRequest, rejectFriendRequest} from '../services/api';
import UserSearch from '../components/UserSearch';
import Post from '../components/Post';
import FriendRequests from '../components/FriendRequests'; // Adjust the path if necessary
import FriendsList from '../components/FriendsList'; // Adjust the path if necessary
import UserGreeting from '../components/UserGreeting'; // Adjust the path if necessary
import Navbar from '../components/NavBar';

const Home = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [newPost, setNewPost] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userData = await getUserData();
        setUser(userData);
        console.log(userData.id);
        console.log("kraymis")
  
        // Fetch posts with user ID
        const postsData = await getPosts(userData.id);
        setPosts(postsData);

        const friendsData = await getFriends();
        setFriends(friendsData);

        const fRequests = await getFriendRequests();
        setFriendRequests(fRequests);
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        navigate('/login');
      }
    };
  
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError(err.response.data.message || 'Logout failed');
    }
  };

  const handleCreatePost = async () => {
    if (!newPost) return;
    try {
      const postData = { text: newPost };
      const createdPost = await createPost(postData);
      setPosts([createdPost, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error('Failed to create post', err);
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


  
  const handleDeleteFriend = async (friendId) => {
    try {
      console.log("raana hna")
      console.log(friendId);
      console.log("raana hna")
      await deleteFriend(friendId);
      setFriends(friends.filter(friend => friend._id !== friendId));
    } catch (err) {
      console.error('Failed to delete friend', err);
    }
  };

  const handleAcceptFriendRequest = async (requesterId) => {
    try {

      await acceptFriendRequest(requesterId);
      setFriendRequests(friendRequests.filter(request => request._id !== requesterId));
      setFriends([...friends, { _id: requesterId }]);  // Update friends list
    
    } catch (err) {
      console.log(requesterId)
      console.error('Failed to accept friend request', err);
    }
  };

  const handleRejectFriendRequest = async (requesterId) => {
    try {
      await rejectFriendRequest(requesterId);
      setFriendRequests(friendRequests.filter(request => request._id !== requesterId));
    } catch (err) {
      console.error('Failed to reject friend request', err);
    }
  };


return (
  <>
  <Navbar user={user}/>
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
      {/* <UserSearch /> */}
      <h1 className="text-3xl font-bold mb-6">Khra</h1>
      {error && <ErrorNotification message={error} />}
      {user ? (
        <div>
          
          <div>
            <UserGreeting
              user={user}
              onLogout={handleLogout}
            />
            {/* Other components or content */}
          </div>
          <div className="mt-6">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="What's on your mind?"
            />
            <button
              onClick={handleCreatePost}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Post
            </button>
          </div>

          <div className="mt-6 flex">
                {/* Friends list */}
              <div className="flex">
                <FriendsList
                  friends={friends}
                  error={error}
                  onDeleteFriend={handleDeleteFriend}
                />
              </div>

              {/* Friend requests */}
              <div className="flex">
                <FriendRequests
                  friendRequests={friendRequests}
                  error={error}
                  onAcceptFriendRequest={handleAcceptFriendRequest}
                  onRejectFriendRequest={handleRejectFriendRequest}
                />
              </div>
              
          </div>

          {/* <PostList posts={posts}/> */}
          <div className="mt-6">
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

        </div>
      ) : (
        <p>Please log in to see the content.</p>
      )}
    </div>
  </div>
  </>
);
};
export default Home;