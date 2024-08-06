// components/CreatePostForm.js
import React, { useState } from 'react';
import img from "../assets/profile.png"; // Adjust the path if necessary
import { createPost } from '../services/api'; // Adjust the path if necessary

const CreatePostForm = ({ user, onPostCreated }) => {
  const [newPost, setNewPost] = useState('');

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    try {
      const postData = { text: newPost };
      const createdPost = await createPost(postData);
      onPostCreated(createdPost); // Notify parent about the new post
      setNewPost('');
    } catch (err) {
      console.error('Failed to create post', err);
    }
  };

  return (
    <div className="bg-[#235347] py-4 px-4 rounded-lg w-[35vw]">
      <div className='flex flex-col items-center justify-center mb-8'>
        <p className='text-white text-[1.8vw] font-bold'>Créer une publication</p>
        <div className='w-[80%] rounded-2xl h-1 bg-white'></div> {/* White line */}
      </div>
      <div className='flex items-center justify-start mb-4 gap-3'>
        <div className='h-[2.5vh] w-[2.5vw] flex justify-start items-center'>
          <img src={img} alt="" />
        </div>
        <p className='text-white font-semibold text-[1.5vw]'>{user.name}</p>
      </div>
      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        className="w-full p-2 border rounded mb-4 bg-[#DAF1DE] focus:outline-none focus:ring-0 text-[#333]"
        placeholder="What's on your mind?"
      />
      <button
        onClick={handleCreatePost}
        className="bg-[#8EB69B] hover:bg-[#0B2B26] w-full text-white font-bold py-2 mb-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
      >
        Post
      </button>
    </div>
  );
};

export default CreatePostForm;
