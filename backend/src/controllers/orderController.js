import { Order } from '../models/index.js';

/**
 * Order Controller Class
 * 
 * Handles all order-related HTTP requests including creating, retrieving,
 * updating, and listing orders.
 */
class OrderController {
  /**
   * Create a new order
   * POST /api/orders
   */
  async createOrder(req, res, next) {
    try {
      const { customerEmail, items, totalAmount } = req.body;

      // Validate required fields
      if (!customerEmail || !items || totalAmount === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: customerEmail, items, and totalAmount are required',
        });
      }

      // Validate items is a non-empty array
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Items must be a non-empty array',
        });
      }

      // Create new order with pending status
      const order = await Order.create({
        customerEmail,
        items,
        totalAmount,
        paymentStatus: 'pending',
      });

      return res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single order by ID
   * GET /api/orders/:id
   */
  async getOrder(req, res, next) {
    try {
      const { id } = req.params;

      // Find order by ID
      const order = await Order.findById(id);

      // Return 404 if order not found
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update order payment status and transaction details
   * PATCH /api/orders/:id
   */
  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { paymentStatus, transactionId, stripePaymentIntentId } = req.body;

      // Find order by ID
      const order = await Order.findById(id);

      // Return 404 if order not found
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Update order fields (only if provided)
      if (paymentStatus) {
        order.paymentStatus = paymentStatus;
      }
      if (transactionId) {
        order.transactionId = transactionId;
      }
      if (stripePaymentIntentId) {
        order.stripePaymentIntentId = stripePaymentIntentId;
      }

      // Save updated order
      await order.save();

      return res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all orders with optional filtering
   * GET /api/orders?status=pending&email=user@example.com
   */
  async getAllOrders(req, res, next) {
    try {
      const { status, email } = req.query;

      // Build filter clause based on query parameters
      const filter = {};
      if (status) {
        filter.paymentStatus = status;
      }
      if (email) {
        filter.customerEmail = email;
      }

      // Find all orders with filters, sorted by most recent first
      const orders = await Order.find(filter).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance of OrderController
export default new OrderController();
