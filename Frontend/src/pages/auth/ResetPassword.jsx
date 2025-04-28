import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate and useParams
import { AuthContext } from '../../context/authContext'; // Assuming AuthContext is used for managing state
import { showSuccess, showError } from "../../components/common/Notify";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const ResetPassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();
  const { loading, resetPassword } = useContext(AuthContext); // Access resetPassword function from AuthContext

  // Handle password input change
  const handleChange = (e) => {
    if (e.target.name === 'newPassword') {
      setNewPassword(e.target.value);
    } else {
      setConfirmPassword(e.target.value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for password
    if (!newPassword || !confirmPassword) {
      setError('Both fields are required');
      showError("Both fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      showError("Passwords do not match");
      return;
    }

    try {
      const result = await resetPassword({ token, password: newPassword, confirmPassword });
      setMessage(result.message); // Show success message
      showSuccess("Password reset successful");
      setTimeout(() => {
        navigate('/login'); // Redirect to login after successful reset
      }, 3000);
    } catch (err) {
      setError(err.message || 'An error occurred');
      showError("err.message || 'An error occurred");
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-400 flex items-center justify-center px-4">
      <div className="bg-[#FFFFF0] shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#333333] text-center mb-6">
          Reset Your <span className="text-[#FFD700]">Fusion Fit</span> Password
        </h2>

        {/* Error or Success Message */}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        {message && <div className="text-green-600 text-center mb-4">{message}</div>}

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="mb-4">
            <label className="block text-[#333333] font-medium mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                className="w-full px-4 py-2 border border-[#CCCCCC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] pr-10 truncate"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#0A1128]"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <IoIosEye /> : <IoIosEyeOff />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-[#333333] font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className="w-full px-4 py-2 border border-[#CCCCCC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] pr-10 truncate"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#0A1128]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <IoIosEye /> : <IoIosEyeOff />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#FFD700] text-[#0A1128] py-2 rounded-md font-medium hover:bg-[#0A1128] hover:text-[#FFD700] transition"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-[#666666] mt-4">
          Remember your password?{' '}
          <a href="/login" className="text-[#FFD700] font-medium hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
