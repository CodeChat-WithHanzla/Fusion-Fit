import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState({ loading: true, success: null, message: "" });
    useEffect(() => {
        const verifyEmailToken = async () => {
            try {
                const response = await axios.get(`http://localhost:7000/api/auth/verify-email/${token}`);
                setStatus({ loading: false, success: true, message: response.data.message });

                // Redirect after a short delay
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } catch (error) {
                setStatus({
                    loading: false,
                    success: false,
                    message: error.response?.data?.error || "Verification failed. Please try again.",
                });
            }
        };

        verifyEmailToken();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-400">
            <div className="bg-white p-6 rounded shadow-md max-w-md text-center">
                {status.loading ? (
                    <div className="text-gray-600">Verifying your email...</div>
                ) : status.success ? (
                    <div className="text-green-500">
                        <h1 className="text-2xl font-bold">Success!</h1>
                        <p>{status.message}</p>
                        <p>You will be redirected shortly...</p>
                    </div>
                ) : (
                    <div className="text-red-500">
                        <h1 className="text-2xl font-bold">Error</h1>
                        <p>{status.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
