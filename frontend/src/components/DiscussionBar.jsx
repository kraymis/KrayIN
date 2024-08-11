import React from 'react';
import img from '../assets/profile.png';
const DiscussionBar = ({ imgSrc, onClick, name, lastMessage, isActive }) => {
  return (
    <li 
      onClick={onClick} 
      className={`text-white cursor-pointer flex items-center p-2 rounded-lg ${isActive ? 'bg-[#9457eb]' : 'hover:bg-gray-700'}`}
    >
      <img src={imgSrc || img} alt={name} className="w-10 h-10 rounded-full mr-3" />
      <div>
        <span>{name}</span>
        <p className="text-sm text-gray-400">{lastMessage}</p>
      </div>
    </li>
  );
};

export default DiscussionBar;
