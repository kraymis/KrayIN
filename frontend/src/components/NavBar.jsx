import React, { useEffect, useState } from 'react';
import img from "../assets/profile.png"; // Adjust the path if necessary
import UserSearch from '../components/UserSearch'; // Adjust the path if necessary
import { getUserData } from '../services/api';
import { useNavigate } from 'react-router-dom';
import messageimg from '../assets/envoyer.png';
import messageimgwhite from '../assets/envoyerwhite.png';

const Navbar = ({onLogout}) => {
  const [user, setUser] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${user.id}`); // Navigate to the user's profile page
  };
  const navigateToHome = () => {
    navigate(`/`); // Navigate to the user's profile page
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
  const handleClickMessage = () => {
    navigate(`/chat`); // Navigate to the user's profile page
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <nav className="relative bg-[#4a2574] p-16 flex justify-between items-center h-[15vh]">
      {/* Logo */}
      <div className="text-white text-2xl font-bold">
        <h3 className='text-[2.5vw] cursor-pointer' onClick={() => navigateToHome()}>Kray<span className='text-[#9e72c3]'>IN</span></h3>
      </div>

      {/* Search Bar */}
      <div className="relative ml-[16vw] ">
        <UserSearch />
      </div>

      {/* Profile Section */}
      <div className='flex justify-between items-center gap-3 h-auto w-auto'>
      <div className="flex items-center justify-between cursor-pointer border-2 text-[#0f0822] hover:text-[#f0f0ff] bg-[#f0f0ff] p-2 px-6 rounded-lg hover:border-[#9457eb] hover:bg-[#9457eb] h-[6vh] " onClick={handleProfileClick}>
        <img src={user.profileImg || img} alt="Profile" className="h-8 w-8 rounded-full mr-2 " />
        <span className=" font-bold">{user.name}</span>
      </div>
      <button
              onClick={() => handleClickMessage()}
              className="bg-[#f0f0ff] text-[#4a2574] hover:bg-[#9457eb] hover:text-white font-bold py-2 px-4 rounded h-[6vh] flex items-center gap-2 transition-all duration-300"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={isHovered ? messageimgwhite : messageimg}
                alt="Messages"
                className="h-6 w-6"
              />
              Message
            </button>
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
