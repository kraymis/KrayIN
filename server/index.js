require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes

app.use('/api/auth', require('./routes/Auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/task', require('./routes/taskRoutes.js'));
app.use('/api/posts', require('./routes/postRoutes'));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

