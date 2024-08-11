// Comment.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../assets/profile.png'; // Adjust the path if necessary

const Comment = ({ comment }) => {
  const navigate = useNavigate();

  const navigateToUser = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="flex flex-col p-4 mb-2 border-t border-b border-[#9457eb] rounded-lg bg-transparent shadow-sm" style={{borderOpacity: 0.2}}>

      <div className='flex justify-between items-center'>
      <div className="flex items-center justify-center ">
        <div className='h-10 w-10 '>
          <img src={comment.user.profileImg || img} alt="User" className="rounded-full" />
        </div>
          <strong 
            onClick={() => navigateToUser(comment.user._id)} 
            className='cursor-pointer text-white text-lg ml-3'
          >
            {comment.user.name}
          </strong>
      </div>
      <div className="">
          <span className="text-[#f0f0ff] text-sm">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
      </div>
      </div>

      <div className="flex justify-start mt-2">

        <div className='mt-2'>
          <p className="text-white">{comment.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
