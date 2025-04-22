import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext'; // Assuming AuthContext is used for managing state
import { showSuccess, showError } from "../../components/common/Notify";

const ForgotPassword = () => {
  const { loading, error, forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const handleChange = (e) => {
    setEmail(e.target.value);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email) {
      setFormError('Please provide an email address');
      showError("Please provide an email address");
      return;
    }

    // Reset any previous messages
    setMessage('');
    setFormError('');

    try {
      await forgotPassword({ email });
      setMessage('A password reset link has been sent to your email.');
      setTimeout(() => {
        navigate('/login'); // Use navigate() to redirect after successful reset link request
      }, 3000);
    } catch (err) {
      setFormError(err.message || 'An error occurred, please try again later.');
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-400 flex items-center justify-center px-4">
      <div className="bg-[#FFFFF0] shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#333333] text-center mb-6">
          Reset Your <span className="text-[#FFD700]">Watchtery</span> Password
        </h2>

        {/* Success or Error Message */}
        {message && <div className="text-green-600 text-center mb-4">{message}</div>}
        {formError && <div className="text-red-600 text-center mb-4">{formError}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-[#333333] font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your registered email"
              className="w-full px-4 py-2 border border-[#CCCCCC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] truncate"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FFD700] text-[#0A1128] py-2 rounded-md font-medium hover:bg-[#0A1128] hover:text-[#FFD700] transition"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Back to Login */}
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

export default ForgotPassword;
