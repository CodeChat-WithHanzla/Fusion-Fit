import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ImagePreview from "./ImagePreviewer";
import { showSuccess, showError } from "../../common/Notify";

const EditProductForm = ({ productData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ...productData,
    deletedImages: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shapeOptions = ["hourglass", "pear", "apple", "rectangle", "inverted triangle"];
  const typeOptions = ["dress", "top", "bottom", "accessory", "outerwear"];

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === 'select-multiple' && name === 'targetShapes') {
      const selectedValues = Array.from(selectedOptions).map(option => option.value);
      setFormData((prev) => ({
        ...prev,
        [name]: selectedValues,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };



  const handleDeleteImage = (publicId) => {
    setFormData((prev) => ({
      ...prev,
      imageGallery: prev.imageGallery.filter((_, index) => prev.imageGalleryIds[index] !== publicId),
      imageGalleryIds: prev.imageGalleryIds.filter((id) => id !== publicId),
      deletedImages: [...prev.deletedImages, publicId],
    }));
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - (formData.imageGallery.length + newImages.length);

    if (files.length > remainingSlots) {
      showError(`You can only add ${remainingSlots} more image${remainingSlots !== 1 ? "s" : ""}`);
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("auth")
        ? JSON.parse(localStorage.getItem("auth")).token
        : null;

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((value) => {
            formDataToSend.append(key, value);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      newImages.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const response = await axios.put(
        `http://localhost:7000/api/product/update/${productData._id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        showSuccess("Product updated successfully!");
        navigate("/admin/products");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      showError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      {error && <div className="bg-red-100 p-4 rounded text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Target Shapes */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Target Shape</label>
          <select
            name="targetShapes"
            value={formData.targetShapes}
            onChange={handleChange}
            multiple
            className="w-full px-3 py-2 border rounded"
          >
            {shapeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Product Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Image Handling */}
        <ImagePreview
          images={formData.imageGallery}
          imageIds={formData.imageGalleryIds}
          onDeleteImage={handleDeleteImage}
          onAddImages={handleAddImages}
          newImages={newImages}
        />

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductForm;
