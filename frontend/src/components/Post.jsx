import React, { useState } from 'react';
import Comment from './Comment'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom';
import img from "../assets/profile.png"; // Adjust the path if necessary

const Post = ({ post, onLike, onUnlike, onAddComment }) => {
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="mb-4 p-4 rounded-xl w-[35vw] bg-[#235347] shadow-sm flex flex-col ">
        <div className='flex justify-between px-2 py-4'>
        <div className='flex justify-start items-center gap-2 mb-6'>
          <div className='h-[2.5vh] w-[2.5vw] flex justify-start items-center'>
            <img src={post.user.profileImg || img} alt="" />
          </div>
          <p onClick={() => navigateToUser(post.user._id)} className="font-bold cursor-pointer text-white">{post.user.name}</p>
        </div>
        <p className="text-[#fff8f8] text-left">{formatDate(post.createdAt)}</p>
        </div>
      <div className='flex items-start w-[95%]'>
      <p className="mb-2 text-[#fff8f8] text-left ml-4">{post.text}</p>
      </div>
      <div className="flex flex-col items-center mb-4">
  {/* Top border line */}
  <div className="w-full border-t-2 opacity-20 border-gray-300 mb-2 flex justify-center items-center mt-4">

  </div>

  <div className="flex items-center justify-between w-full max-w-md ">
    {/* Like/Unlike button */}
    <button
      onClick={() => post.userLiked ? onUnlike(post._id) : onLike(post._id)}
      className={`flex-1 py-2 rounded-2xl ${post.userLiked ? 'bg-[#0b2b26] text-white' : 'bg-transparent text-[#DAF1DE]'} font-bold border border-[#DAF1DE] hover:bg-green-100 hover:text-green-700 transition-all duration-300`}
    >
      {post.userLiked ? 'Unlike' : 'Like'} ({post.numberOfLikes})
    </button>

    {/* Vertical separator line */}
    <div className="w-px h-8 opacity-20 bg-gray-300 mx-4"></div>

    {/* Show/Hide comments button */}
    <button
      onClick={handleCommentToggle}
      className="flex-1 py-2 rounded-2xl bg-transparent text-[#DAF1DE] font-bold border border-[#DAF1DE] hover:bg-green-100 hover:text-green-700 transition-all duration-300"
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
            className="w-full p-2 px-4 border rounded-2xl outline-none mb-2 bg-[#DAF1DE] text-[#333]"
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
