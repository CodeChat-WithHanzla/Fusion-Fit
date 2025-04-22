import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../common/Notify";
import { formatPrice } from "../../functions/price";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsFavorite(favorites.includes(product._id));
    }, [product._id]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const handleAddToCart = () => {
        const existingProduct = cart.find(item => item._id === product._id);

        if (existingProduct) {
            const updatedCart = cart.map(item =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            showSuccess(`${product.name} quantity increased`);
        } else {
            const updatedCart = [...cart, { ...product, quantity: 1 }];
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            showSuccess(`${product.name} added to cart`);
        }
    };

    const handleBuyNow = () => {
        navigate(`/product/${product._id}`);
    };

    const handleAddToFavorites = () => {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        let updatedFavorites;

        if (isFavorite) {
            updatedFavorites = favorites.filter((id) => id !== product._id);
            showSuccess(`${product.name} removed from favorites`)
        } else {
            updatedFavorites = [...favorites, product._id];
            showSuccess(`${product.name} added to favorites`);
        }

        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        setIsFavorite(!isFavorite);
    };

    const getStockLabel = () => {
        if (product.stock === 0) return <span className="text-red-500">Out of Stock</span>;
        if (product.stock <= 10) return <span className="text-yellow-500">Low Stock</span>;
        return <span className="text-green-500">In Stock</span>;
    };

    const isOutOfStock = product.stock === 0;

    return (
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] mx-auto bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3]">
                <a onClick={() => navigate(`/product/${product._id}`)}>
                    <img
                        className="w-full h-full object-cover cursor-pointer rounded-t-lg"
                        title="Open Details"
                        src={product.imageGallery[0]}
                        alt={product.name}
                    />
                </a>

                {/* Favorite Button */}
                <button
                    onClick={handleAddToFavorites}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isFavorite ? "red" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke={isFavorite ? "red" : "red"}
                        className="w-5 h-5 sm:w-6 sm:h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 016.364 0l.318.318.318-.318a4.5 4.5 0 116.364 6.364l-6.682 6.682a.75.75 0 01-1.06 0L4.318 12.682a4.5 4.5 0 010-6.364z"
                        />
                    </svg>
                </button>

                {/* Stock Label */}
                <div className="absolute top-0 left-0 w-24 sm:w-28 -translate-x-7 translate-y-4 -rotate-45 bg-black/80 backdrop-blur-sm py-1">
                    <span className="text-center text-xs sm:text-sm text-white block">
                        {getStockLabel()}
                    </span>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-4 sm:p-5">
                {/* Product Details */}
                <div className="space-y-2 mb-4">
                    <h5
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="text-lg sm:text-xl font-semibold text-slate-900 cursor-pointer hover:text-blue-600 line-clamp-2"
                    >
                        {product.name}
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-600">
                        Target body shape: {product.targetShapes[0].toUpperCase()}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-orange-600">
                        Rs. {formatPrice(product.price)}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                    <button
                        className={`flex-1 px-1 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 ${isOutOfStock
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300"
                            }`}
                        onClick={handleBuyNow}
                        disabled={isOutOfStock}
                    >
                        View Details
                    </button>
                    <button
                        className={`flex-1 px-3 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 ${isOutOfStock
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-slate-900 hover:bg-gray-800 focus:ring-gray-300"
                            }`}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                    >
                        <span className="flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            Add to Cart
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;