// PostList.js

import React, { useEffect, useState } from 'react';
import Comment from './Comment'; // Adjust the path as needed
import { likePost, unlikePost, addComment} from '../services/api';

const PostList = ({ posts }) => {
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

  return (
    <div className="mt-6">
      {posts.map(post => (
        <div key={post._id} className="mb-4 p-4 border rounded bg-white shadow-sm">
          <p className="mb-2 font-bold">{post.user.name}</p>
          <p className="mb-2">{post.text}</p>
          <div className="flex items-center mb-2">
            <button
              onClick={() => post.userLiked ? handleUnlikePost(post._id) : handleLikePost(post._id)}
              className={`py-1 px-2 rounded ${post.userLiked ? 'bg-red-500' : 'bg-blue-500'} text-white font-bold`}
            >
              {post.userLiked ? 'Unlike' : 'Like'} ({post.numberOfLikes})
            </button>
          </div>
          <div>
            <textarea
              placeholder="Add a comment..."
              className="w-full p-2 border rounded mb-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment(post._id, e.target.value);
                  e.target.value = '';
                }
              }}
            />
            {post.comments.map(comment => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
