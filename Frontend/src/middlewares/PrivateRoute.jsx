import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { auth } = useContext(AuthContext);

    if (!auth?.user) {
        // Redirect to login if user is not authenticated
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(auth.user.role)) {
        // Redirect if user does not have the required role
        return auth.user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
