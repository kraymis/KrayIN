const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, unlikePost, addComment,getPostsByUserId } = require('../controllers/postControllers');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createPost);
router.get('/', protect, getPosts);
router.get('/:userId', getPostsByUserId);
router.put('/:id/like',protect, likePost);
router.put('/:id/unlike', protect, unlikePost);
router.post('/:id/comment', protect, addComment);

module.exports = router;
