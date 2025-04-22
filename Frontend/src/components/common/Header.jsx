import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { Menu, X, ShoppingCart, Heart } from "lucide-react";
import { showSuccess, showError } from "./Notify";
import SearchBar from './SearchBar';
import ProfileDropdown from './ProfileDropdown';
import { IoBagCheckOutline } from "react-icons/io5";
import { LayoutDashboard, Package } from "lucide-react";

const Header = () => {
    const { auth, logout, loading, sendVerificationEmail, refetchUser } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleSendVerificationEmail = async () => {
        try {
            const message = await sendVerificationEmail();
            showSuccess(message);
        } catch (err) {
            showError(err.message);
        }
    };

    return (
        <>
            {/* Email verification banner */}
            {/* {auth.user && !auth.user.isVerified && (
                <div className="bg-yellow-400 text-gray-900">
                    <div className="container mx-auto px-4">
                        <p className="text-sm md:text-base py-2 text-center">
                            Your account is not verified. Please verify your email.
                            <button
                                onClick={handleSendVerificationEmail}
                                className="ml-2 md:ml-4 bg-white text-yellow-600 px-3 py-1 rounded-md hover:bg-gray-100 font-medium text-sm"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Verification Email'}
                            </button>
                        </p>
                    </div>
                </div>
            )} */}

            <header className="bg-[#0A1128] text-[#FFD700] sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        {auth.user && auth.user.role === "admin" ? (
                            <>
                                <Link to="/" className="text-xl md:text-2xl font-bold hover:text-yellow-300 shrink-0">
                                    <span className="text-[#FFD700]">Admin Panel</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/" className="text-xl md:text-2xl font-bold hover:text-yellow-300 shrink-0">
                                    <span className="text-[#FFD700]">Fusion Fit</span>
                                </Link>
                            </>
                        )}

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center justify-end flex-1 space-x-4 lg:space-x-8">
                            {auth.user && auth.user.role === "admin" && (
                                <>
                                    <NavLink
                                        to="/admin"
                                        end
                                        className={({ isActive }) =>
                                            `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${isActive
                                                ? 'bg-[#FFD700] text-[#0A1128]'
                                                : 'text-[#FFD700] hover:text-yellow-300'
                                            }`
                                        }
                                    >
                                        <LayoutDashboard size={20} />
                                        <span>Dashboard</span>
                                    </NavLink>
                                    <NavLink
                                        to="/admin/products"
                                        className={({ isActive }) =>
                                            `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${isActive
                                                ? 'bg-[#FFD700] text-[#0A1128]'
                                                : 'text-[#FFD700] hover:text-yellow-300'
                                            }`
                                        }
                                    >
                                        <Package size={20} />
                                        <span>Products</span>
                                    </NavLink>
                                    <NavLink
                                        to="/admin/orders"
                                        className={({ isActive }) =>
                                            `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${isActive
                                                ? 'bg-[#FFD700] text-[#0A1128]'
                                                : 'text-[#FFD700] hover:text-yellow-300'
                                            }`
                                        }
                                    >
                                        <ShoppingCart size={20} />
                                        <span>Orders</span>
                                    </NavLink>
                                </>
                            )}

                            {auth.user && auth.user.role !== 'admin' && (
                                <>
                                    {/* Search Bar */}
                                    <div className="flex-1 max-w-xl mx-8">
                                        <SearchBar />
                                    </div>

                                    {/* Cart Button */}
                                    <Link
                                        to="/cart"
                                        className="text-white hover:text-yellow-300 p-2"
                                    >
                                        <ShoppingCart size={24} />
                                    </Link>
                                    <Link
                                        to="/favourites"
                                        className="text-white hover:text-yellow-300 p-2"
                                    >
                                        <Heart size={24} />
                                    </Link>
                                </>
                            )}

                            {/* Profile Dropdown or Auth Buttons */}
                            {auth.user ? (
                                <ProfileDropdown
                                    user={auth.user}
                                    logout={logout}
                                    showSuccess={showSuccess}
                                />
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            `px-4 py-2 rounded-md font-medium transition-colors ${isActive
                                                ? 'bg-[#FFD700] text-[#0A1128]'
                                                : 'text-[#FFD700] hover:text-yellow-300'
                                            }`
                                        }
                                    >
                                        Login
                                    </NavLink>
                                    <NavLink
                                        to="/signup"
                                        className={({ isActive }) =>
                                            `px-4 py-2 rounded-md font-medium transition-colors ${isActive
                                                ? 'bg-[#FFD700] text-[#0A1128]'
                                                : 'text-[#FFD700] hover:text-yellow-300'
                                            }`
                                        }
                                    >
                                        Sign Up
                                    </NavLink>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-white hover:text-yellow-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden py-4 space-y-4 border-t border-gray-700">
                            {auth.user && auth.user.role === 'customer' && (
                                <div className="space-y-4">
                                    <SearchBar />
                                    <Link
                                        to="/cart"
                                        className="flex items-center space-x-2 text-white hover:text-yellow-300 p-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <ShoppingCart size={24} />
                                        <span>Cart</span>
                                    </Link>
                                    <Link
                                        to="/favourites"
                                        className="flex items-center space-x-2 text-white hover:text-yellow-300 p-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Heart size={24} />
                                        <span>Favourites</span>
                                    </Link>
                                    {auth.user && auth.user.role === "customer" && (
                                        <Link
                                            to="/my-orders"
                                            className="flex items-center space-x-2 text-white hover:text-yellow-300 p-2"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <IoBagCheckOutline size={24} />
                                            <span>My Orders</span>
                                        </Link>
                                    )}
                                </div>
                            )}

                            {auth.user && auth.user.role === "admin" && (
                                <>
                                    <NavLink
                                        to="/admin"
                                        end
                                        className={({ isActive }) =>
                                            `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${isActive
                                                ? 'bg-[#FFD700] text-[#0A1128]'
                                                : 'text-[#FFD700] hover:text-yellow-300'
                                            }`
                                        }
                                    >
                                        <LayoutDashboard size={20} />
                                        <span>Dashboard</span>
                                    </NavLink>
                                    <NavLink
                                        to="/admin/products"
                                        className={({ isActive }) =>
                                            `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${isActive
                                                ? 'bg-[#FFD700] text-[#0A1128]'
                                                : 'text-[#FFD700] hover:text-yellow-300'
                                            }`
                                        }
                                    >
                                        <Package size={20} />
                                        <span>Products</span>
                                    </NavLink>
                                    <NavLink
                                        to="/admin/orders"
                                        className={({ isActive }) =>
                                            `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${isActive
                                                ? 'bg-[#FFD700] text-[#0A1128]'
                                                : 'text-[#FFD700] hover:text-yellow-300'
                                            }`
                                        }
                                    >
                                        <ShoppingCart size={20} />
                                        <span>Orders</span>
                                    </NavLink>
                                </>
                            )}

                            {auth.user ? (
                                <div className="px-2 flex items-center gap-3">
                                    <ProfileDropdown
                                        user={auth.user}
                                        logout={logout}
                                        showSuccess={showSuccess}
                                    />
                                    {auth.user.name}
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-2 px-2">
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            `px-4 py-2 rounded-md font-medium text-center ${isActive
                                                ? 'bg-[#FFD700] text-[#0A1128]'
                                                : 'text-[#FFD700] hover:text-yellow-300'
                                            }`
                                        }
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </NavLink>
                                    <NavLink
                                        to="/signup"
                                        className={({ isActive }) =>
                                            `px-4 py-2 rounded-md font-medium text-center ${isActive
                                                ? 'bg-[#FFD700] text-[#0A1128]'
                                                : 'text-[#FFD700] hover:text-yellow-300'
                                            }`
                                        }
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;