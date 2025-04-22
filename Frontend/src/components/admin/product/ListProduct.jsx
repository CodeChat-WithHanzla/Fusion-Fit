import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ImagePreview from "./ImagePreviewer";
import { showSuccess, showError } from "../../common/Notify";
import axios from "axios";

const ListProductForm = () => {
    const [newImages, setNewImages] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploadedImageIds, setUploadedImageIds] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")).token : null;
    if (!token) {
        showError("You must be an admin to list a product");
    }

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            description: "",
            price: "",
            targetShapes: [],
            type: "",
            stock: "",
        },
    });

    const handleAddImages = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + uploadedImages.length > 5) {
            showError("You can upload a maximum of 5 images.");
            return;
        }
        setNewImages([...newImages, ...files]);
    };

    const handleDeleteImage = (id) => {
        setUploadedImages(uploadedImages.filter((_, index) => uploadedImageIds[index] !== id));
        setUploadedImageIds(uploadedImageIds.filter((imageId) => imageId !== id));
    };

    const onSubmit = async (formData) => {
        setLoading(true);

        if (formData.targetShapes && typeof formData.targetShapes === 'string') {
            formData.targetShapes = [formData.targetShapes];
        }

        if (!formData.targetShapes || formData.targetShapes.length === 0) {
            showError("Target Shapes is required.");
            setLoading(false);
            return;
        }

        if (!formData.type) {
            showError("Product type is required.");
            setLoading(false);
            return;
        }

        try {
            // Convert plain object to FormData
            const dataToSend = new FormData();

            // Append all basic fields
            Object.entries(formData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((v) => dataToSend.append(`${key}[]`, v));
                } else {
                    dataToSend.append(key, value);
                }
            });

            // Append new images
            newImages.forEach((image) => dataToSend.append("images", image));

            console.log('FormData being sent:', [...dataToSend.entries()]);

            const { data } = await axios.post("http://localhost:7000/api/product/list", dataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            showSuccess("Product listed successfully!");
            reset();
            setNewImages([]);
            setUploadedImages([]);
            setUploadedImageIds([]);
        } catch (error) {
            showError(error.response?.data?.message || "Failed to list product.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto">
            <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Product Name</label>
                        <input
                            {...field}
                            placeholder="Enter product name"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                    </div>
                )}
            />

            <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Description</label>
                        <textarea
                            {...field}
                            placeholder="Enter product description"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                    </div>
                )}
            />

            <Controller
                name="price"
                control={control}
                render={({ field, fieldState }) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Price</label>
                        <input
                            {...field}
                            type="number"
                            placeholder="Enter product price"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                    </div>
                )}
            />

            <Controller
                name="targetShapes"
                control={control}
                rules={{ required: "At least one body shape must be selected" }}
                render={({ field, fieldState }) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Body Shape Type</label>
                        <select
                            multiple
                            value={field.value}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                                field.onChange(selected);
                            }}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="hourglass">Hourglass</option>
                            <option value="Pear">Pear</option>
                            <option value="apple">Apple</option>
                            <option value="rectangle">Rectangle</option>
                            <option value="inverted triangle">Inverted Triangle</option>
                        </select>
                        {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                    </div>
                )}
            />


            <Controller
                name="type"
                control={control}
                render={({ field, fieldState }) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Product Type</label>
                        <select
                            {...field}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select a product type</option>
                            <option value="dress">Dress</option>
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="accessory">Accessory</option>
                            <option value="outerwear">Outerwear</option>
                        </select>
                        {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                    </div>
                )}
            />

            <Controller
                name="stock"
                control={control}
                render={({ field, fieldState }) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Stock</label>
                        <input
                            {...field}
                            type="number"
                            placeholder="Enter stock quantity"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                    </div>
                )}
            />

            <ImagePreview
                images={uploadedImages}
                imageIds={uploadedImageIds}
                newImages={newImages}
                onDeleteImage={handleDeleteImage}
                onAddImages={handleAddImages}
            />

            <button
                type="submit"
                className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
            >
                {loading ? "Listing..." : "List Product"}
            </button>
        </form>
    );
};

export default ListProductForm;
