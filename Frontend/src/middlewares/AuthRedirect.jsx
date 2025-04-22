import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const AuthRedirect = ({ children }) => {
  const { auth } = useContext(AuthContext);
  if (auth?.user) {
    // Redirect logged-in users based on their role
    return auth.user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />;
  }
  return children;
};

export default AuthRedirect;
