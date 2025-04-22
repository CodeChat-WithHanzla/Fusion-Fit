import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatPrice } from "../functions/price";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")).token : null;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:7000/api/order/user-orders",{
            headers: {
              Authorization: `Bearer ${token}`
            }
        });
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p>Loading...</p>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold mb-2">
                Order ID: <span className="text-blue-500">{order._id}</span>
              </h2>
              <p className="text-sm text-gray-600">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Total:</span> Rs. {formatPrice(order.totalAmount.toFixed(2))}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`${
                    order.orderStatus === "delivered"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </p>
              <p>
                <span className="font-semibold">Payment:</span>{" "}
                <span className="text-orange-400">
                  {order.paymentMethod === "cash" ? "COD" : "Card"} 
                </span>
              </p>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Products:</h3>
                <ul className="text-sm text-gray-700">
                  {order.items.map((item) => (
                    <li key={item.product} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.product.name}
                      </span>
                      <span>Rs. {formatPrice(item.price.toFixed(2))}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">Shipping Address:</h3>
                <p className="text-sm text-gray-700">
                {order.shippingAddress.postalCode} - {order.shippingAddress.house}, {order.shippingAddress.street}, {order.shippingAddress.state}, {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
