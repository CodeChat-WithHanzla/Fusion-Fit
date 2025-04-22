import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "./Card";
import { showSuccess, showError } from "../../common/Notify";
import { MdDeleteSweep } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  // Fetch all Products on component load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")).token : null;
        if (!token) {
          showError("must be logged in.")
          return;
        }
        const response = await axios.get("http://localhost:7000/api/product/listed-products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data.products);
      } catch (error) {
        showError("Error fetching Products:", error)
        console.error("Error fetching Products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle delete product
  const handleDelete = async () => {
    const token = localStorage.getItem("auth")
      ? JSON.parse(localStorage.getItem("auth")).token
      : null;
    if (!token) {
      showError("must be logged in.")
      console.error("No authentication token found.");
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:7000/api/product/delete/${selectedProductId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccess("Product deleted successfully.");
      setProducts(products.filter((product) => product._id !== selectedProductId));
      setShowModal(false);
    } catch (error) {
      console.error("Error during delete:", error.response?.data || error.message);
      showError("Failed to delete product.");
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Manage Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product._id} className="relative">
            <ProductCard product={product} />
            <div className="absolute top-4 right-4 space-y-2">
              <button
                onClick={() => navigate(`/admin/product/edit/${product._id}`)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => {
                  setSelectedProductId(product._id);
                  setShowModal(true);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md"
              >
                <MdDeleteSweep />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this Product? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageProducts
