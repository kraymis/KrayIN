// Post.jsx
import React from 'react';
import Comment from './Comment'; // Adjust the path if necessary

const Post = ({ post, onLike, onUnlike, onAddComment }) => {
  return (
    <div className="mb-4 p-4 border rounded bg-white shadow-sm">
      <p className="mb-2 font-bold">{post.user.name}</p>
      <p className="mb-2">{post.text}</p>
      <div className="flex items-center mb-2">
        <button
          onClick={() => post.userLiked ? onUnlike(post._id) : onLike(post._id)}
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
              onAddComment(post._id, e.target.value);
              e.target.value = '';
            }
          }}
        />
        {post.comments.map(comment => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Post;
