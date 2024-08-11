import React, { useState, useEffect,useRef } from 'react';
import { getFriends, fetchAllMessages, getUserData} from '../services/api';
import { IoIosSend } from 'react-icons/io';
import imgsearch from '../assets/chercher.png';
import DiscussionBar from './DiscussionBar';

const Chat = ({ socket, user }) => {
  const [friends, setFriends] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [messages, setMessages] = useState(new Map());
  const [message, setMessage] = useState('');
  const [meUser, setMeUser] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsData = await getFriends();
      setFriends(friendsData);
      const me = await getUserData();
      setMeUser(me);  
      // Fetch all messages data
      const messagesData = await fetchAllMessages();
  
      // Transform messages data to a Map
      const messagesMap = new Map();
      messagesData.forEach(({ roomId, sender, content, timestamp }) => {
        if (!messagesMap.has(roomId)) {
          messagesMap.set(roomId, []);
        }
        messagesMap.get(roomId).push({ sender, content, timestamp });
      });
      setMessages(messagesMap);
    };
    scrollToBottom();
  
    fetchFriends();
    console.log("use effect ran");
  
    socket.on('chatMessage', (msg) => {

      setMessages(prevMessages => {
        const updatedMessages = new Map(prevMessages);
        if (!updatedMessages.has(msg.roomId)) {
          updatedMessages.set(msg.roomId, []);
        }
        updatedMessages.get(msg.roomId).push(msg);
        console.log("here's it",updatedMessages);
        return updatedMessages;
      });
    });
  
    socket.on('previousMessages', (msgs) => {
      const roomId = [user.id, activeFriend].sort().join('_');
      setMessages(prevMessages => {
        const updatedMessages = new Map(prevMessages);
        updatedMessages.set(roomId, msgs);
        return updatedMessages;
      });
    });
  
    return () => {
      socket.off('chatMessage');
      socket.off('previousMessages');
    };
  }, [socket, user.id, activeFriend]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };
    


  useEffect(() => {
    const updatedFriends = friends.map(friend => getLastMessage(friend._id));
    setSearchResults(updatedFriends);
  }, [messages, friends, user.id]);

  const startChat = (friendId) => {
    setSearching(false); // Hide the search bar
    setActiveFriend(friendId);
    const roomId = [user.id, friendId].sort().join('_');
    socket.emit('joinRoom', { userId1: user.id, userId2: friendId });
    
    // Fetch previous messages when starting a chat
    socket.emit('getPreviousMessages', roomId);
  };
let counter = 0;
  const sendMessage = () => {

    const roomId = [user.id, activeFriend].sort().join('_');
    socket.emit('chatMessage', { roomId, message });
    console.log(messages);
    // Update local messages state with the new message
    setMessages(prevMessages => {
    //   console.log(prevMessages);
      const updatedMessages = new Map(prevMessages);
    //   console.log(updatedMessages);
      if (!updatedMessages.has(roomId)) {
        updatedMessages.set(roomId, []);
      }
    //   console.log(updatedMessages);
      updatedMessages.get(roomId).push({
        sender: user.id,
        content: message,
        timestamp: new Date().toISOString()
      });
      return updatedMessages;
    });
  
    setMessage('');
  };
  

  const handleSearch = async (query) => {
    if (query.trim()) {
      const results = friends.filter(friend => friend.name.toLowerCase().includes(query.toLowerCase()));
      setSearchResults(results);
    } else {
      setSearchResults([]);
      setSearching(false); // Hide the search bar when the input is empty
    }
  };

  const toggleSearch = () => {
    setSearching(!searching);
    setSearchResults([]);
  };

  const getLastMessage = (friendId) => {
    const roomId = [user.id, friendId].sort().join('_');
    const roomMessages = messages.get(roomId);
    if (roomMessages && roomMessages.length > 0) {
      return {
        friendId,
        lastMessage: roomMessages[roomMessages.length - 1].content
      };
    } else {
      return {
        friendId,
        lastMessage: "No messages yet"
      };
    }
  };

  return (
    <div className="flex w-full h-full">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-[#170f2d] p-4">
        <div className="flex h-[10vh] justify-between items-center px-6">
          <h2 className="text-white font-bold text-2xl">Chats</h2>
          <button className="text-white flex justify-center items-center " onClick={toggleSearch}>
            <div className='h-[1.5vh] w-[1.5vw] flex justify-center items-center '>
              <img src={imgsearch} alt="Search" />
            </div>
          </button>
        </div>

        {searching && (
          <input
            type="text"
            placeholder="Search friends..."
            onChange={(e) => handleSearch(e.target.value)}
            className="mt-2 p-2 rounded bg-gray-700 text-white w-full h-auto"  
          />
        )}

        <ul className="mt-4">
          {(searching ? searchResults : friends).map(friend => (
            <DiscussionBar
            key={friend._id}
            imgSrc={friend.profileImage}
            onClick={() => startChat(friend._id)} // Call startChat on click
            name={friend.name}
            lastMessage={getLastMessage(friend._id).lastMessage}
            isActive={activeFriend === friend._id} // Pass isActive to DiscussionBar
            />    
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 bg-[#090515] p-4 flex flex-col justify-between">
        {activeFriend ? (
          <>
            <div className="overflow-y-auto h-full">
            {(messages.get([user.id, activeFriend].sort().join('_')) || []).map((msg, index) => (
                <div
                key={index}
                className={`text-white p-2 rounded-lg mb-2 ${
                    msg.sender === meUser.id ? 'bg-[#9457eb] self-end' : 'bg-gray-700 self-start'
                }`}
                style={{
                    maxWidth: '70%',
                    marginLeft: msg.sender === meUser.id ? 'auto' : '0',
                    marginRight: msg.sender === meUser.id ? '0' : 'auto',
                }}
                >
                <strong>{msg.sender}</strong>: {msg.content} <br />
                <small>{new Date(msg.timestamp).toLocaleString()}</small>
                </div>
            ))}
            <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full  h-[6vh] p-2 rounded bg-[#1f143c] text-white"
              />
              <button onClick={sendMessage} className="p-2 text-white bg-[#9457eb] rounded ml-2">
                <IoIosSend />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-white">
            <p>No messages here yet...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
