import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, logout, createPost, getPosts, likePost, unlikePost, addComment } from '../services/api';

const Home = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
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
      // setPosts(posts.map(post => post._id === postId ? { ...post, userLiked: false } : post)); // Update userLiked property
         
    } catch (err) {
      console.error('Failed to unlike post', err);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    try {
      const commentData = { text: commentText };
      const comment = await addComment(postId, commentData);
  
      // Update the posts state to include the new comment with user details
      setPosts(posts.map(post =>
        post._id === postId ? { ...post, comments: [...post.comments, comment] } : post
      ));
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };
  


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-6">Khra</h1>
        {error && <ErrorNotification message={error} />}
        {user ? (
          <div>
            <p className="mb-6">Welcome, {user.name}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Logout
            </button>

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

            <div className="mt-6">
              {posts.map(post => (
                <div key={post._id} className="mb-4 p-4 bg-gray-200 rounded">
                  <p><strong>{post.user.name}</strong></p>
                  <p>{post.text}</p>
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => post.userLiked ? handleUnlikePost(post._id) : handleLikePost(post._id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      {post.userLiked ? 'Unlike' : 'Like'}
                    </button>
                    <span>{post.numberOfLikes} likes</span>
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full p-1 border rounded"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post._id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    {post.comments.map(comment => (
                      <p key={comment._id} className="text-sm mt-1">
                        <strong>{comment.user.name}:</strong> {comment.text}
                      </p>
                    ))}

                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Signup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
