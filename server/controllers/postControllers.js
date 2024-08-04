const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Create a new post
const createPost = async (req, res) => {
  const { text } = req.body;

  try {
    const post = new Post({ user: req.user.id, text });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all posts
const getPosts = async (req, res) => {
  const { userId } = req.query; // Get userId from query params

  try {
    const posts = await Post.find()
      .populate('user', 'name')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    // Optionally filter posts or include userLiked in the response
    const enrichedPosts = posts.map(post => ({
      ...post._doc,
      userLiked: post.likes.includes(userId) // Check if user has liked the post
    }));

    res.status(200).json(enrichedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Like a post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
      post.numberOfLikes += 1;
      await post.save();
      res.status(200).json({ message: 'Post liked' });
    } else {
      res.status(400).json({ message: 'Post already liked' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Unlike a post
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
      post.numberOfLikes -= 1;
      await post.save();
      res.status(200).json({ message: 'Post unliked' });
    } else {
      res.status(400).json({ message: 'Post not liked' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a comment to a post
const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({ user: req.user.id, post: req.params.id, text });
    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createPost, getPosts, likePost, unlikePost, addComment };
