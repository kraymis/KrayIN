import React, { useEffect } from 'react';
import io from 'socket.io-client';
import Chat from '../components/Chat';

const socket = io('https://jwt-app-one.vercel.app/', {
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
