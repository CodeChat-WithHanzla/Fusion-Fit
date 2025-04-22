import React, { useEffect, useState } from "react";
import axios from "axios";
import { showError, showSuccess } from "../../components/common/Notify";
import { formatPrice } from "../../functions/price";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")).token : null;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:7000/api/order/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      showError("Failed to fetch orders")
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    const specificRow = document.getElementById(`order-${orderId}`);
    if (specificRow) specificRow.classList.add('opacity-50'); // Add visual feedback

    try {
      const { data } = await axios.patch(
        `http://localhost:7000/api/order/status/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      showSuccess(data.message);
      await fetchOrders(); // Refresh orders after update
    } catch (error) {
      showError(error.response?.data?.message || "Failed to update order status");
    } finally {
      if (specificRow) specificRow.classList.remove('opacity-50');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Items</th>
              <th className="border px-4 py-2">Total Amount</th>
              <th className="border px-4 py-2">Payment Status</th>
              <th className="border px-4 py-2">Order Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} id={`order-${order._id}`}>
                <td className="border px-4 py-2">{order._id}</td>
                <td className="border px-4 py-2">
                  {order.user.name} <br /> {order?.customerContact} <br /> {order.user.email} <br /> {order.shippingAddress.postalCode} - {order.shippingAddress.house}, {order.shippingAddress.street}, {order.shippingAddress.state}, {order.shippingAddress.city}, {order.shippingAddress.country}
                </td>
                <td className="border px-4 py-2">
                  {order.items.map((item) => (
                    <div key={item.product._id}>
                      {item.product.name} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2">Rs. {formatPrice(order.totalAmount)}</td>
                <td className="border px-4 py-2">{order.paymentStatus}</td>
                <td className="border px-4 py-2">{order.orderStatus}</td>
                <td className="border px-4 py-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={order.orderStatus}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    disabled={order.orderStatus === "delivered"}
                  >
                    <option value="pending" disabled={order.orderStatus !== "pending"}>
                      Pending
                    </option>
                    <option value="processing" disabled={order.orderStatus !== "pending"}>
                      Processing
                    </option>
                    <option value="delivered" disabled={order.orderStatus !== "processing"}>
                      Delivered
                    </option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
