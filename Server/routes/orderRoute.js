const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAdmin, isAuthenticated } = require('../middlewares/authMiddleware'); // Your authentication middleware

// Order routes
router.post('/create', isAuthenticated, orderController.createOrder);
router.get('/user-orders', isAuthenticated, orderController.getCustomerOrders);
router.get('/:id', isAuthenticated, orderController.getOrderById);
router.get('/admin/orders', isAuthenticated, isAdmin, orderController.getAdminOrders);
router.patch('/status/:orderId', isAdmin, orderController.updateOrderStatus);

module.exports = router;