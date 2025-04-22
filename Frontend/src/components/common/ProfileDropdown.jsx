// ProfileDropdown.jsx
import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { IoBagCheckOutline } from "react-icons/io5";

const ProfileDropdown = ({ user, logout, showSuccess }) => {
  const { auth, loading, sendVerificationEmail } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    showSuccess('Logged out successfully');
    setIsOpen(false);
  };

  const handleOrdersClick = () => {
    navigate('/my-orders');
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-yellow-300"
      >
        <span className="h-8 w-8 rounded-full bg-yellow-300 flex items-center justify-center text-[#0A1128]">
          {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute lg:left-[-150px] md:left-[-100px] left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            {user.name || user.email}
          </div>
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            {user.email}
          </div>

          {/* Orders Link - visible only on larger screens */}
          {auth.user && auth.user.role === "customer" && (
            <button
              onClick={handleOrdersClick}
              className="hidden lg:flex w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b items-center"
            >
              <IoBagCheckOutline className="mr-2" />
              My Orders
            </button>
          )}


          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
