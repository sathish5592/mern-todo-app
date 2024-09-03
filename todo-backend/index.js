const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204 
};
app.use(cors(corsOptions)); // Invoke cors middleware

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/todo-app")
.then(() => {
    console.log("DB connected");
})
.catch((err) => {
    console.error("DB connection error:", err);
});

// Define Todo Schema and Model
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Todo = mongoose.model('Todo', todoSchema);

// Create a new Todo item
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTodo = new Todo({ title, description });
        await newTodo.save();
        res.status(200).json(newTodo);
    } catch (err) {
        console.error("Error saving todo:", err);
        res.status(500).json({ error: "Failed to save todo" });
    }
});

// Get all Todo items
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (err) {
        console.error("Error retrieving todos:", err);
        res.status(500).json({ error: "Failed to retrieve todos" });
    }
});

// Update a Todo item
app.put('/todos/:id', async (req, res) => {
    const { title, description } = req.body;
    const id = req.params.id;
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.status(200).json(updatedTodo);
    } catch (err) {
        console.error("Error updating todo:", err);
        res.status(500).json({ error: "Failed to update todo" });
    }
});

// Delete a Todo item
app.delete('/todos/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Todo.findByIdAndDelete(id);
        res.status(204).end();
    } catch (err) {
        console.error("Error deleting todo:", err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
