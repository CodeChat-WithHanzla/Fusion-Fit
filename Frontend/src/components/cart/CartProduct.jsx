import React from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../functions/price";

const CartProduct = ({ product, stock, isSelected, onSelectProduct, onUpdateCart }) => {
    const navigate = useNavigate();
    const isOutOfStock = stock === 0;
    const exceedsStock = product.quantity >= stock;

    const handleQuantityChange = (change) => {
        const updatedCart = JSON.parse(localStorage.getItem("cart")).map((item) => {
            if (item._id === product._id) {
                const newQuantity = item.quantity + change;
                return {
                    ...item,
                    quantity: Math.min(stock, Math.max(1, newQuantity)), // Prevent exceeding stock
                };
            }
            return item;
        });
        onUpdateCart(updatedCart);
    };

    const handleRemoveProduct = () => {
        const updatedCart = JSON.parse(localStorage.getItem("cart")).filter(
            (item) => item._id !== product._id
        );
        onUpdateCart(updatedCart);
    };

    const handleDetail = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center bg-white shadow-lg p-4 rounded-lg mb-4">
            <input
                type="checkbox"
                checked={isSelected}
                disabled={isOutOfStock}
                onChange={(e) => onSelectProduct(product._id, e.target.checked)}
                className={`mr-4 ${isOutOfStock ? "cursor-not-allowed" : ""}`}
            />
            <img
                src={product.imageGallery[0]}
                alt={product.name}
                className="h-24 w-24 object-cover rounded cursor-pointer"
                onClick={() => handleDetail(product._id)}
            />
            <div onClick={() => handleDetail(product._id)} className="flex-1 ml-4 cursor-pointer">
                <h4 className="text-lg font-medium">{product.name}</h4>
                <p className="text-gray-500">Rs. {formatPrice(product.price)}</p>
                {isOutOfStock && <p className="text-red-500">Out of stock</p>}
                {exceedsStock && (
                    <p className="text-yellow-500">
                        Quantity cannot exceed available stock ({stock} left).
                    </p>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={isOutOfStock || product.quantity <= 1}
                    className={`px-2 py-1 border rounded ${isOutOfStock ? "bg-gray-300" : "bg-gray-100"}`}
                >
                    -
                </button>
                <span className="px-2">{product.quantity}</span>
                <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={isOutOfStock || exceedsStock}
                    className={`px-2 py-1 border rounded ${exceedsStock || isOutOfStock ? "bg-gray-300" : "bg-gray-100"}`}
                >
                    +
                </button>
            </div>
            <button
                onClick={handleRemoveProduct}
                className="ml-4 text-red-500 hover:text-red-700"
            >
                Remove
            </button>
        </div>
    );
};

export default CartProduct;
