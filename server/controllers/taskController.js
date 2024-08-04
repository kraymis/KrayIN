// controllers/taskController.js
const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.status(200).json(tasks);
});

const createTask = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ message: 'Please add a task' });
  }
  const task = await Task.create({ text: req.body.text, user: req.user.id });
  res.status(201).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  if (task.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  if (task.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }
  await task.remove();
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
