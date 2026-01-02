import axios from 'axios';

/**
 * Create axios instance with base configuration
 * Uses environment variable for API base URL
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Logs all outgoing requests for debugging
 */
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles successful responses and formats errors
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Return only the data portion of the response
    return response.data;
  },
  (error) => {
    // Extract and format error message
    let errorMessage = 'An error occurred. Please try again.';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('[API Error]', errorMessage);
    return Promise.reject({ message: errorMessage });
  }
);

/**
 * Create a new order
 * @param {Object} orderData - Order information
 * @param {string} orderData.customerEmail - Customer email address
 * @param {Array} orderData.items - Array of items in the order
 * @param {number} orderData.totalAmount - Total order amount in cents
 * @returns {Promise} Order response with orderId
 */
export const createOrder = async (orderData) => {
  return axiosInstance.post('/orders', orderData);
};

/**
 * Get order details by ID
 * @param {string} orderId - The ID of the order to retrieve
 * @returns {Promise} Order details including status and items
 */
export const getOrder = async (orderId) => {
  return axiosInstance.get(`/orders/${orderId}`);
};

/**
 * Create a Stripe checkout session
 * @param {Object} checkoutData - Checkout session data
 * @param {Array} checkoutData.items - Array of items for checkout
 * @param {string} checkoutData.customerEmail - Customer email address
 * @returns {Promise} Checkout session with sessionId and redirectUrl
 */
export const createCheckoutSession = async (checkoutData) => {
  return axiosInstance.post('/payments/create-checkout-session', checkoutData);
};

/**
 * Verify payment after Stripe checkout completion
 * @param {string} sessionId - Stripe checkout session ID
 * @returns {Promise} Payment verification status and order confirmation
 */
export const verifyPayment = async (sessionId) => {
  return axiosInstance.post('/payments/verify', { sessionId });
};

/**
 * Update order payment status
 * @param {string} orderId - The ID of the order to update
 * @param {string} paymentStatus - New payment status (e.g., 'failed', 'success')
 * @returns {Promise} Updated order data
 */
export const updateOrderStatus = async (orderId, paymentStatus) => {
  return axiosInstance.put(`/orders/${orderId}`, { paymentStatus });
};

export default axiosInstance;
