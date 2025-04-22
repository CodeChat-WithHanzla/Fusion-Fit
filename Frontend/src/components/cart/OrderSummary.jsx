import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({ cart }) => {
    const navigate = useNavigate();
    const shippingFee = 300;
    const subtotal = cart.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );
    const total = subtotal + (subtotal > 0 ? shippingFee : 0);

    const handleProceedToCheckout = () => {
        // Store selected cart items in localStorage before proceeding to checkout
        localStorage.setItem("selectedCartItems", JSON.stringify(cart));
        navigate("/checkout");
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>Rs. {subtotal}</span>
            </div>
            {subtotal > 0 && (
                <div className="flex justify-between mb-2">
                    <span>Shipping:</span>
                    <span>Rs. {shippingFee}</span>
                </div>
            )}
            <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total:</span>
                <span>Rs. {total}</span>
            </div>
            <button
                disabled={subtotal === 0}
                onClick={handleProceedToCheckout}
                className={`w-full py-2 ${subtotal > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    } rounded`}
            >
                Proceed to Checkout
            </button>
        </div>
    );
};


export default OrderSummary;
