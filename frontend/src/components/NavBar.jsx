import React, { useEffect, useState } from 'react';
import img from "../assets/profile.png"; // Adjust the path if necessary
// import img from "../assets/profile.png"; // Adjust the path if necessary
import UserSearch from '../components/UserSearch'; // Adjust the path if necessary
import { getUserData} from '../services/api';
import { useNavigate } from 'react-router-dom';



const Navbar = () => {
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
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-white text-2xl font-bold">
        <img src={img} alt="Logo" className="h-8 inline" /> {/* Replace with your logo path */}
      </div>

      {/* Search Bar */}
      <div className="flex-1 mx-4">
        <UserSearch />
      </div>

      {/* Profile Section */}
      <div className="flex items-center cursor-pointer" onClick={handleProfileClick}>
        <img src={user.profileImg || img} alt="Profile" className="h-8 w-8 rounded-full mr-2" />
        <span className="text-white font-bold">{user.name}</span>
      </div>
    </nav>
  );
};

export default Navbar;
