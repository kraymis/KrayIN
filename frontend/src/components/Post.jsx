import React, { useState,useEffect } from 'react';
import Comment from './Comment'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom';
import img from "../assets/profile.png"; // Adjust the path if necessary
import { getUserData,deletePost } from '../services/api';
import imgcorbeille from '../assets/corbeille.png';

const Post = ({ post, onLike, onUnlike, onAddComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUserData();
      setUser(fetchedUser);
    };

    fetchUser();
  }, [getUserData]);


  const navigateToUser = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleCommentToggle = () => {
    setShowComments(!showComments);
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      // onDelete(post._id); // Call the onDelete function to update the UI
    } catch (error) {
      console.error('Failed to delete the post:', error);
    }
  };
  return (
    <div className="mb-4 p-4 rounded-xl w-[35vw] bg-transparent border-2 border-[#9457eb] shadow-sm flex flex-col ">
      <div className='flex justify-between items-center px-2 py-4  mb-6'>
        <div className='flex justify-center items-center gap-2 cursor-pointer ' onClick={() => navigateToUser(post.user._id)}>
          <div className='h-[2.5vh] w-[2.5vw] flex justify-start items-center'>
            <img src={post.user.profileImg || img} alt="" />
          </div>
          <p className="font-bold cursor-pointer text-white">{post.user.name}</p>
        </div>
        <div className='flex justify-center items-center gap-6'>
        <p className="text-[#f0f0ff] text-left">{formatDate(post.createdAt)}</p>
        {user && user.id === post.user._id && (
          <button
            onClick={handleDelete}
            className="text-red-500 font-bold hover:text-red-700"
          >
            <div className='h-[1vh] w-[1vw] flex justify-center items-center hover:scale-110' onClick={handleDelete}>
              <img src={imgcorbeille} alt="" />
            </div>
          </button>
        )}
        </div>
      </div>
      <div className='flex items-start w-[95%]'>
        <p className="mb-2 text-[#f0f0ff] text-left ml-4">{post.text}</p>
      </div>
      <div className="flex flex-col items-center mb-4">
        {/* Top border line */}
        <div className="w-full border-t-2 opacity-20 border-gray-300 mb-2 flex justify-center items-center mt-4"></div>

        <div className="flex items-center justify-between w-full max-w-md ">
          {/* Like/Unlike button */}
          <button
            onClick={() => post.userLiked ? onUnlike(post._id) : onLike(post._id)}
            className={`flex-1 py-2 rounded-2xl ${post.userLiked ? 'bg-[#9457eb] text-[#f0f0ff]' : 'bg-transparent text-[#9457eb]'} font-bold border border-[#9457eb] hover:bg-[#9457eb] hover:text-[#f0f0ff] transition-all duration-300`}
          >
            {post.userLiked ? 'Unlike' : 'Like'} ({post.numberOfLikes})
          </button>

          {/* Vertical separator line */}
          <div className="w-px h-8 opacity-20 bg-gray-300 mx-4"></div>

          {/* Show/Hide comments button */}
          <button
            onClick={handleCommentToggle}
            className="flex-1 py-2 rounded-2xl bg-transparent text-[#9457eb] font-bold border border-[#9457eb] hover:bg-[#9457eb] hover:text-[#f0f0ff] transition-all duration-300"
          >
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>
        </div>

        {/* Bottom border line */}
        <div className="w-full border-b-2 opacity-20 border-gray-300 mt-2 rounded-xl"></div>
      </div>

      {showComments && (
        <div className='flex flex-col gap-2'>
          <textarea
            placeholder="Add a comment..."
            className="w-full p-2 px-4 border rounded-2xl outline-none mb-2 bg-[#f0f0ff] text-[#333]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onAddComment(post._id, e.target.value);
                e.target.value = '';
              }
            }}
          />
          {post.comments.map(comment => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;