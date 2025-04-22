const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User')

exports.getDashboardStats = async (req, res, next) => {
    try {
        // **Orders Aggregations**
        const totalOrders = await Order.countDocuments();
        const ordersThisMonth = await Order.countDocuments({
            createdAt: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
            },
        });
        const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
        const completedOrders = await Order.countDocuments({ orderStatus: 'delivered' });
        const revenueThisMonth = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
                    },
                    paymentStatus: 'completed',
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                },
            },
        ]);

        // **Product Aggregations**
        const totalProducts = await Product.countDocuments();
        const outOfStockProducts = await Product.countDocuments({ stock: 0 });
        const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5, $gt: 0 } });
        
        // **Response**
        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                ordersThisMonth,
                pendingOrders,
                completedOrders,
                revenueThisMonth: revenueThisMonth[0]?.totalRevenue || 0,
                totalProducts,
                outOfStockProducts,
                lowStockProducts,
            },
        });
    } catch (error) {
        next(error);
    }
};
