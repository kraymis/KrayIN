// Comment.jsx
import React from 'react';

const Comment = ({ comment }) => {
  return (
    <div key={comment._id} className="p-2 border-t">
      <strong>{comment.user.name}</strong>: {comment.text}
    </div>
  );
};

export default Comment;
