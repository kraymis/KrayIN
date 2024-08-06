import React, { useEffect, useState } from 'react';
import img from "../assets/profile.png"; // Adjust the path if necessary
import UserSearch from '../components/UserSearch'; // Adjust the path if necessary
import { getUserData } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Navbar = ({onLogout}) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${user.id}`); // Navigate to the user's profile page
  };

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUserData();
      setUser(fetchedUser);
    };

    fetchUser();
  }, [getUserData]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="relative bg-[#235347] p-16 flex justify-between items-center h-[15vh]">
      {/* Logo */}
      <div className="text-white text-2xl font-bold">
        <h3 className='text-[2.5vw]'>Kray<span className='text-[#8EB69B]'>IN</span></h3>
      </div>

      {/* Search Bar */}
      <div className="relative ">
        <UserSearch />
      </div>

      {/* Profile Section */}
      <div className='flex justify-between items-center gap-3 h-auto w-auto'>
      <div className="flex items-center justify-between cursor-pointer bg-[#DAF1DE] p-2 px-6 border rounded-lg text-[#051F20] h-[6vh] " onClick={handleProfileClick}>
        <img src={user.profileImg || img} alt="Profile" className="h-8 w-8 rounded-full mr-2" />
        <span className=" font-bold">{user.name}</span>
      </div>
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline h-[6vh]"
      >
        Logout
      </button>
      </div>
    </nav>
  );
};

export default Navbar;
