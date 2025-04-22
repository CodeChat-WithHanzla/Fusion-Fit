import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ user: null, token: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiURL = "http://localhost:7000/api/auth";

    // Load user from localStorage (if logged in)
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('auth'));
        if (userData) {
            setAuth(userData);
        }
    }, []);

    const signup = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${apiURL}/signup`, formData);
            setAuth({ user: response.data.user, token: response.data.token });
            localStorage.setItem('auth', JSON.stringify({ user: response.data.user, token: response.data.token }));
            return true; // Indicate success
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
            return false; // Indicate failure
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${apiURL}/login`, formData);
            setAuth({ user: response.data.user, token: response.data.token });
            localStorage.setItem('auth', JSON.stringify({ user: response.data.user, token: response.data.token }));
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    // Forgot Password
    const forgotPassword = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${apiURL}/forgot-password`, formData);
            return response.data; // Success response (message)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
            throw new Error(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put(`${apiURL}/reset-password/${formData.token}`, formData);
            return response.data; // Success response (message)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
            throw new Error(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const sendVerificationEmail = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${apiURL}/send-verification-email`, { email: auth.user.email });
            return response.data.message; // Return success message
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
            throw new Error(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };


    // Logout function
    const logout = () => {
        setAuth({ user: null, token: null });
        localStorage.removeItem('auth');
    };

    return (
        <AuthContext.Provider value={{ auth, signup, login, logout, forgotPassword, resetPassword, sendVerificationEmail, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
