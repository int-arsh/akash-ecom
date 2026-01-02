import mongoose from 'mongoose';

/**
 * Order Model
 * Stores customer orders with payment tracking
 */

const orderSchema = new mongoose.Schema(
  {
    customerEmail: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
    items: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
      default: [],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      required: false,
    },
    stripePaymentIntentId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save validation middleware
orderSchema.pre('save', function (next) {
  // Validate items array is not empty
  if (!this.items || this.items.length === 0) {
    return next(new Error('Items array cannot be empty'));
  }

  // Validate each item has required fields
  for (const item of this.items) {
    if (!item.name || !item.price || !item.quantity) {
      return next(new Error('Each item must have name, price, and quantity'));
    }
  }

  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
