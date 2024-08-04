// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');

router.get('/',protect, getTasks) // Get all tasks for a user
router.post('/',protect, createTask); // Create a new task

router.put('/:id',protect, updateTask) // Update a task
router.delete('/:id',protect, deleteTask); // Delete a task

module.exports = router;
