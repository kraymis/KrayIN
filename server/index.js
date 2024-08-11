require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const jwt = require('jsonwebtoken');
const socketIo = require('socket.io');
const testRoutes = require('./routes/testRoutes'); // Adjust the path if necessary
const Message = require('./models/Message');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Create HTTP server and set up Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173', // Replace with your frontend's URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization'],
        credentials: true,
    }
});

// Socket.io authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error'));
            }
            socket.user = decoded; // Attach user info to socket
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
});

// Socket.io connection handling

io.on('connection', (socket) => {
    console.log('A user connected:', socket.user);

    socket.on('joinRoom', ({ userId1, userId2 }) => {
        const roomId = [userId1, userId2].sort().join('_');
        socket.join(roomId);
        console.log(`${socket.user.name} joined room: ${roomId}`);

        // Send previous messages to the user when they join the room
        Message.find({ roomId })
            .sort({ timestamp: 1 }) // Sort by oldest first
            .then(messages => {
                socket.emit('previousMessages', messages);
            });
    });

    socket.on('chatMessage', async ({ roomId, message }) => {
        const newMessage = new Message({
            roomId,
            sender: socket.user.id,
            content: message,
        });

        try {
            const savedMessage = await newMessage.save();
            io.to(roomId).emit('chatMessage', {
                user: socket.user.name,
                content: savedMessage.content,
                timestamp: savedMessage.timestamp,
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/Auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/task', require('./routes/taskRoutes.js'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/friends', require('./routes/friendRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api', testRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
