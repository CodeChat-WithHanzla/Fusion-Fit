import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { showSuccess, showError } from "../../components/common/Notify";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const SignUp = () => {
  const { signup, loading, error } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize navigate hook

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) {
      showError("All fields are required.");
      return "All fields are required.";
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return "Passwords do not match.";
    }
    if (password.length < 8) {
      showError("Password must be at least 8 characters long.");
      return "Password must be at least 8 characters long.";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showError("Please enter a valid email address.");
      return "Please enter a valid email address.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showError(validateError);
      return;
    }

    const success = await signup(formData); // Capture success flag
    if (success) {
      showSuccess("Signup successful. You can now log in.");
      navigate('/login'); // Navigate to login page on success
    } else {
      showError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-400 flex items-center justify-center px-4">
      <div className="bg-[#FFFFF0] shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#333333] text-center mb-6">
          Create Your <span className="text-[#FFD700]">Fusion Fit</span> Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#333333] font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-[#CCCCCC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#333333] font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-[#CCCCCC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#333333] font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-[#CCCCCC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] pr-10"
                required
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#0A1128]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[#333333] font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 border border-[#CCCCCC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] pr-10"
                required
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#0A1128]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <IoIosEye /> : <IoIosEyeOff />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-[#FFD700] text-[#0A1128] py-2 rounded-md font-medium transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0A1128] hover:text-[#FFD700]'
              }`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-[#666666] mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-[#FFD700] font-medium hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
