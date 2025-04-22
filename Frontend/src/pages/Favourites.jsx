import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccess } from "../components/common/Notify";
import { formatPrice } from "../functions/price";

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const favoriteIds = JSON.parse(localStorage.getItem("favorites")) || [];

                // Map through the favorite IDs and fetch all products concurrently
                const fetchedProducts = await Promise.all(
                    favoriteIds.map(id => axios.get(`http://localhost:7000/api/product/single/${id}`).then(response => response.data.product))
                );

                setFavorites(fetchedProducts);
            } catch (error) {
                console.error("Error fetching favorite products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);


    const handleRemoveFromFavorites = (productId) => {
        const updatedFavorites = favorites.filter((product) => product._id !== productId);
        setFavorites(updatedFavorites);
        const favoriteIds = JSON.parse(localStorage.getItem("favorites")) || [];
        const updatedIds = favoriteIds.filter((id) => id !== productId);
        localStorage.setItem("favorites", JSON.stringify(updatedIds));
        showSuccess("Product removed from favorites");
    };

    const handleAddToCart = (product) => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = storedCart.find((item) => item._id === product._id);

        if (existingProduct) {
            const updatedCart = storedCart.map((item) =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            showSuccess(`${product.name} quantity increased in cart`);
        } else {
            const updatedCart = [...storedCart, { ...product, quantity: 1 }];
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            showSuccess(`${product.name} added to cart`);
        }
    };

    const handleBuyNow = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return <div className="text-center p-8">Loading your favorite products...</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4 bg-gray-50">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Favorites</h1>
            {favorites.length === 0 ? (
                <div className="text-center text-gray-600">No favorite products found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {favorites.map((product) => (
                        <div key={product._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                            <div onClick={() => handleBuyNow(product._id)} className="flex flex-col items-center cursor-pointer">
                                <img
                                    src={product.imageGallery[0]}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                                <p className="text-lg text-gray-600">Rs. {formatPrice(product.price)}</p>
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
                                    onClick={() => handleBuyNow(product._id)}
                                >
                                    Buy Now
                                </button>
                                <button
                                    className="text-red-600 hover:text-red-700 transition-all"
                                    onClick={() => handleRemoveFromFavorites(product._id)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.42 3.42 5 5.5 5c1.74 0 3.41 1.01 4.13 2.44h1.74C14.09 6.01 15.76 5 17.5 5 19.58 5 21 6.42 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
