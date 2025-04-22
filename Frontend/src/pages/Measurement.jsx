import React, { useState } from "react";
import { getBodyShape } from "../functions/measurement";

const MeasurementPage = () => {
    const [formData, setFormData] = useState({
        shoulders: "",
        bust: "",
        waist: "",
        hips: "",
    });

    const [result, setResult] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: parseFloat(e.target.value),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const shape = getBodyShape(formData);
        setResult(shape);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Find Your Body Shape</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {["shoulders", "bust", "waist", "hips"].map((field) => (
                        <div key={field}>
                            <label className="block mb-1 capitalize text-gray-700">
                                {field} (in cm or inches)
                            </label>
                            <input
                                type="number"
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Calculate Shape
                    </button>
                </form>

                {result && (
                    <div className="mt-6 text-center">
                        <h3 className="text-xl font-semibold text-green-600">
                            Your Body Shape: {result}
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeasurementPage;
