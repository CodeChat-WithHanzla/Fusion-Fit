import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EditProductForm from "./EditProductForm";
import { showSuccess, showError } from "../../common/Notify";

const EditProduct = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const token = localStorage.getItem("auth")
          ? JSON.parse(localStorage.getItem("auth")).token
          : null;

        if (!token) {
          console.error("No authentication token found.");
          showError("No authenticated")
          return;
        }

        const response = await axios.get(`http://localhost:7000/api/product/single/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductData(response.data.product);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dress data:", err);
        setError(err.message || "Failed to load dress data");
        showError(err?.message)
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <EditProductForm productData={productData} />
  )
}

export default EditProduct
