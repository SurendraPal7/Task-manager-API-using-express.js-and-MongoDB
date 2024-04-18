// index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Task = require('./src/models/Task');

const app = express();
const PORT = 3000;

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/task_manager', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB database');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

// Middleware
app.use(bodyParser.json());

// Create a new task
app.post('/tasks', async (req, res) => {
    const { title, description, dueDate } = req.body;
    try {
        const newTask = await Task.create({ title, description, dueDate });
        res.json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { title, description, dueDate, completed }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
