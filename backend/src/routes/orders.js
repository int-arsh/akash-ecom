import express from 'express';
import orderController from '../controllers/orderController.js';
import { validateOrder } from '../middleware/validation.js';

const router = express.Router();

// Create a new order
router.post('/', validateOrder, orderController.createOrder);

// Get all orders with optional filtering
router.get('/', orderController.getAllOrders);

// Get a specific order by ID
router.get('/:id', orderController.getOrder);

// Update order status
router.put('/:id', orderController.updateOrderStatus);

export default router;
