import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderNumber = Math.floor(Math.random() * 1000000), products = [] } = location.state || {};

  if (!products.length) {
    return <div>Invalid Order. Please check again.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="flex justify-center items-center text-green-500 mx-auto mb-4">
          <FaCheckCircle size={70} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Thank You for Your Order!</h1>
        <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
        <div className="mt-6 bg-gray-100 rounded-md p-4">
          <h2 className="text-lg font-semibold text-gray-700">Order Number: #{orderNumber}</h2>
          <p className="text-sm text-gray-600">Estimated Delivery: 3-7 Working Days</p>
        </div>
        {products.map((product, index) => (
          <div key={index} className="mt-6 flex items-center border-t pt-4">
            <div className="ml-4 text-left">
              <h3 className="text-md font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600">Qty: {product.quantity}</p>
              <p className="text-gray-600">Price: Rs. {product.price}</p>
            </div>
          </div>
        ))}
        <button
          className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition duration-200"
          onClick={() => window.location.href = '/my-orders'}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
