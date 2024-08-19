import React, { useEffect } from 'react';
import io from 'socket.io-client';
import Chat from '../components/Chat';
import imggauche from '../assets/gauche.png';

const socket = io('https://jwtapp-backend.onrender.com', {
  auth: { token: localStorage.getItem('token') }
});

const ChatPage = ({ user }) => {
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  return (
    <div className="flex h-screen">
      <Chat socket={socket} user={user} />
    </div>
  );
};

export default ChatPage;
