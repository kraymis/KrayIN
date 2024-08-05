// UserGreeting.jsx
import React from 'react';

const UserGreeting = ({ user, onLogout }) => {
  return (
    <div>
      <p className="mb-6">Welcome, {user.name}</p>
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Logout
      </button>
    </div>
  );
};

export default UserGreeting;
