const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User')
const mongoose = require('mongoose');
const ErrorHandler = require('../helpers/errorHandler')

const orderController = {
    // Create a new order
    createOrder: async (req, res) => {
        console.log(req.body)
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const {
                items,
                shippingAddress,
                paymentMethod,
                shippingFee,
                subtotal,
                totalAmount,
                customerContact // Add this
            } = req.body;

            const order = new Order({
                user: req.user._id,
                items,
                shippingAddress,
                paymentMethod,
                shippingFee,
                subtotal,
                totalAmount,
                customerContact, // Save contact number
                orderStatus: 'pending',
            });

            await order.save({ session });

            // Update product stock
            await Promise.all(items.map(item =>
                Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: -item.quantity } },
                    { session, new: true }
                )
            ));

            await session.commitTransaction();

            const populatedOrder = await Order.findById(order._id)
                .populate('items.product', 'name price')
                .exec();

            session.endSession();

            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                order: populatedOrder
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Order creation error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create order'
            });
        }
    },



    // Fetch all orders for a logged-in user
    getCustomerOrders: async (req, res, next) => {
        try {
            const userId = req.user._id; // Ensure `req.user` is populated
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User not authenticated' });
            }

            const orders = await Order.find({ user: userId })
                .sort({ createdAt: -1 })
                .populate({
                    path: 'items.product',
                    select: 'name price category imageGallery', // Ensure these fields exist in Product schema
                });

            res.status(200).json({
                success: true,
                orders,
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get single order by ID
    getOrderById: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id)
                .populate('items.product')
                .populate('user', 'name email');

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            // Check if the order belongs to the current user
            if (order.user._id.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized access to order'
                });
            }

            res.status(200).json({
                success: true,
                order
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    getAdminOrders: async (req, res) => {
        try {
            const adminProducts = await Product.find({ listedBy: req.user._id });
            console.log('Admin Products:', adminProducts); // Log admin products

            if (!adminProducts.length) {
                return res.status(404).json({ success: false, message: "No products found for this admin." });
            }

            const adminProductIds = adminProducts.map(product => product._id);

            const orders = await Order.find({ 'items.product': { $in: adminProductIds } })
                .sort({ createdAt: -1 })
                .populate('user', 'name email')
                .populate('items.product', 'name price');

            res.status(200).json({ success: true, orders });
        } catch (error) {
            console.error('Error:', error.message); // Log error details
            res.status(500).json({ success: false, message: error.message });
        }
    },



    updateOrderStatus: async (req, res, next) => {
        const { orderId } = req.params;
        const { status } = req.body;

        try {
            // Find the order first
            const order = await Order.findById(orderId);
            if (!order) {
                return next(new ErrorHandler('Order not found', 404));
            }

            // Validate status change
            const validStatusChanges = {
                pending: ['processing'],
                processing: ['delivered'],
                delivered: [] // Final state
            };

            if (!validStatusChanges[order.orderStatus].includes(status)) {
                return next(
                    new ErrorHandler(
                        `Invalid status change from ${order.orderStatus} to ${status}`,
                        400
                    )
                );
            }

            // Use findByIdAndUpdate instead of save() to avoid validation of all fields
            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                {
                    $set: {
                        orderStatus: status,
                        // Update payment status if order is delivered
                        ...(status === 'delivered' ? { paymentStatus: 'completed' } : {})
                    }
                },
                { new: true } // Return the updated document
            );

            res.status(200).json({
                success: true,
                message: 'Order status updated successfully',
                order: updatedOrder
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = orderController;