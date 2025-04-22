import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = ({ shippingFee = 300 }) => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const [address, setAddress] = useState({
        house: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    });
    const [contact, setContact] = useState('');
    const [contactError, setContactError] = useState(''); // Error state for contact
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const token = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")).token : null;
    const randomOrderNumber = Math.floor(Math.random() * 1000000);

    useEffect(() => {
        // Get items from different sources
        const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem")) || [];
        const selectedCartItems = JSON.parse(localStorage.getItem("selectedCartItems")) || [];

        // Combine items based on the source
        const checkoutItems = buyNowItem.length > 0 ? buyNowItem : selectedCartItems;
        setCart(checkoutItems);

        // Cleanup function
        return () => {
            localStorage.removeItem('buyNowItem');
        };
    }, []);

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalAmount = subtotal + shippingFee;

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value,
        });
    };

    const handleContactChange = (e) => {
        const value = e.target.value;

        // Allow only numbers and limit to 11 characters
        if (/^\d*$/.test(value) && value.length <= 11) {
            setContact(value);

            // Validate length
            if (value.length === 11) {
                setContactError('');
            } else {
                setContactError('Contact number must be exactly 11 digits.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (contact.length !== 11) {
            setContactError('Contact number must be exactly 11 digits.');
            setLoading(false);
            return;
        }

        if (!token) {
            console.error("No authentication token found.");
            showError("No authenticated")
            setError("No Authentication")
            return;
        }

        if (cart.length === 0) {
            setError("No items selected for checkout.");
            setLoading(false);
            return;
        }

        try {
            const orderData = {
                items: cart.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                shippingAddress: { ...address },
                customerContact: contact, // Include contact
                paymentMethod,
                shippingFee,
                subtotal,
                totalAmount
            };

            const { data: order } = await axios.post(
                'http://localhost:7000/api/order/create',
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Clear buy now item if it exists
            localStorage.removeItem('buyNowItem');

            // Update main cart by removing purchased items
            const mainCart = JSON.parse(localStorage.getItem("cart")) || [];
            const updatedMainCart = mainCart.filter(
                (item) => !cart.some((checkoutItem) => checkoutItem._id === item._id)
            );
            localStorage.setItem('cart', JSON.stringify(updatedMainCart));

            // Clear selected items
            localStorage.removeItem('selectedCartItems');

            if (paymentMethod === 'card') {
                alert("Card Payment")
            }
            else {
                navigate(`/order-confirmation/${order._id}`, {
                    state: {
                        orderNumber: randomOrderNumber,
                        products: cart, // Include the cart items here
                    },
                });
            }

        } catch (err) {
            console.error('Error details:', err);
            setError(err.response?.message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 mb-6 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Shipping Address</h2>
                        <input
                            type="text"
                            name="house"
                            placeholder="House Number"
                            value={address.house}
                            onChange={(e) => setAddress({ ...address, house: e.target.value })}
                            required
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="street"
                            placeholder="Street Address"
                            value={address.street}
                            onChange={handleAddressChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={address.city}
                                onChange={handleAddressChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={address.state}
                                onChange={handleAddressChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="postalCode"
                                placeholder="Postal Code"
                                value={address.postalCode}
                                onChange={handleAddressChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={address.country}
                                onChange={handleAddressChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Contact Information</h2>
                            <input
                                type="text"
                                name="contact"
                                placeholder="Contact Number"
                                value={contact}
                                onChange={handleContactChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                            {contactError && (
                                <p className="text-red-600 text-sm">{contactError}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Payment Method</h2>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="cash"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={paymentMethod === 'cash'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="cash">Cash on Delivery</label>
                            </div>
                            {/* <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="card"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="card">Card Payment</label>
                            </div> */}
                        </div>

                        <div className="bg-gray-50 p-4 rounded">
                            <h3 className="font-semibold mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-4">
                                {cart.map((item) => (
                                    <div key={item._id} className="flex justify-between items-start border-b pb-2">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.name}</h4>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                Rs. {item.price * item.quantity}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                (Rs. {item.price} × {item.quantity})
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal:</span>
                                    <span>Rs. {subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping Fee:</span>
                                    <span>Rs. {shippingFee}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total:</span>
                                    <span>Rs. {totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || cart.length === 0}
                    className={`mt-6 w-full py-3 ${loading || cart.length === 0
                        ? 'bg-gray-400'
                        : 'bg-blue-600 hover:bg-blue-700'
                        } text-white rounded`}
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
};

export default CheckoutPage;