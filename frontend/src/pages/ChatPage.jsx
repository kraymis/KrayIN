import React, { useEffect } from 'react';
import io from 'socket.io-client';
import Chat from '../components/Chat'; // Adjust the import path as necessary

const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') }
});

const ChatPage = ({ user }) => {
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>Chat</h1>
      <Chat socket={socket} user={user} />
    </div>
  );
};

export default ChatPage;
