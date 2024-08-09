import React, { useState, useEffect } from 'react';
import { getFriends } from '../services/api';

const Chat = ({ socket, user }) => {
    const [friends, setFriends] = useState([]);
    const [activeFriend, setActiveFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const friendsData = await getFriends();
            setFriends(friendsData);
        };

        fetchData();

        socket.on('chatMessage', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.on('previousMessages', (msgs) => {
            setMessages(msgs);
        });
    }, [socket]);

    const startChat = (friendId) => {
        setActiveFriend(friendId);
        const roomId = [user.id, friendId].sort().join('_');
        socket.emit('joinRoom', { userId1: user.id, userId2: friendId });
    };

    const sendMessage = () => {
        const roomId = [user.id, activeFriend].sort().join('_');
        socket.emit('chatMessage', { roomId, message });
        setMessage('');
    };

    return (
        <div>
            <div>
                <h2>Friends</h2>
                <ul>
                    {friends.map(friend => (
                        <li key={friend._id} onClick={() => startChat(friend._id)}>
                            {friend.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                {activeFriend && (
                    <>
                        <div>
                            {messages.map((msg, index) => (
                                <div key={index}>
                                    <strong>{msg.user}</strong>: {msg.content} <br />
                                    <small>{new Date(msg.timestamp).toLocaleString()}</small>
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Chat;
