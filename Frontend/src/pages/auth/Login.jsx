import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext'; // Assuming AuthContext is correctly set up
import { showSuccess, showError } from "../../components/common/Notify";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const Login = () => {
  const { login, loading, error } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const validateForm = () => {
    let errors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData); // Calls AuthContext login function
    } catch (err) {
      showError('Could not log in. Please check your email and password.');
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-400 flex items-center justify-center px-4">
      <div className="bg-[#FFFFF0] shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#333333] text-center mb-6">
          Welcome Back to <span className="text-[#FFD700]">Fusion Fit</span>
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-[#333333] font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] ${formErrors.email ? 'border-red-500' : 'border-[#CCCCCC]'} truncate`}
            />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-[#333333] font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] pr-10 ${formErrors.password ? 'border-red-500' : 'border-[#CCCCCC]'} truncate`}
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#0A1128]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
              </span>
            </div>
            {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right mb-6">
            <a
              href="/forgot-password"
              className="text-[#FFD700] text-sm font-medium hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-[#FFD700] text-[#0A1128] py-2 rounded-md font-medium ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0A1128] hover:text-[#FFD700]'} transition`}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        {/* Footer Text */}
        <p className="text-center text-sm text-[#666666] mt-4">
          Don’t have an account?{' '}
          <a href="/signup" className="text-[#FFD700] font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
