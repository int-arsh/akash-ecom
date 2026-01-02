# Backend API - Stripe Checkout Integration

Express.js API server handling payment processing, order management, and Stripe integration for the e-commerce application.

## Overview

This backend service provides REST API endpoints for order creation, payment session management, and Stripe webhook handling. It integrates with MongoDB for persistent data storage and Stripe for payment processing.

## Prerequisites

- Node.js v14 or higher
- MongoDB (local or remote)
- Stripe account with API keys

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Copy template
cp .env.example .env

# Edit with your actual values
```

## Configuration

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/stripe_checkout

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
FRONTEND_URL=http://localhost:5173
```

## Running the Server

Development with hot reload:
```bash
npm run dev
```

Production:
```bash
node src/server.js
```

Server runs on `http://localhost:5000`

## API Endpoints

### Orders

#### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "customerEmail": "user@example.com",
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 99.99,
      "quantity": 2,
      "description": "Product description",
      "image": "https://..."
    }
  ],
  "totalAmount": 199.98
}
```

Response:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "...",
    "customerEmail": "user@example.com",
    "items": [...],
    "totalAmount": 199.98,
    "paymentStatus": "pending",
    "createdAt": "2026-01-02T..."
  }
}
```

#### Get All Orders
```
GET /api/orders?status=success&email=user@example.com
```

Response:
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

#### Get Single Order
```
GET /api/orders/:id
```

#### Update Order Status
```
PUT /api/orders/:id
Content-Type: application/json

{
  "paymentStatus": "success",
  "transactionId": "pi_..."
}
```

### Payments

#### Create Checkout Session
```
POST /api/payments/create-checkout-session
Content-Type: application/json

{
  "items": [...],
  "customerEmail": "user@example.com"
}
```

Response:
```json
{
  "success": true,
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/...",
  "orderId": "..."
}
```

#### Verify Payment
```
POST /api/payments/verify
Content-Type: application/json

{
  "sessionId": "cs_..."
}
```

Response:
```json
{
  "success": true,
  "status": "paid",
  "orderId": "...",
  "email": "user@example.com",
  "amount": 19998
}
```

### Webhooks

#### Stripe Webhooks
```
POST /api/webhooks/stripe
```

Handles events:
- `checkout.session.completed` - Payment successful
- `payment_intent.succeeded` - Payment confirmed
- `payment_intent.payment_failed` - Payment failed

## Project Structure

```
src/
├── config/
│   ├── database.js         # MongoDB connection
│   └── stripe.js           # Stripe client initialization
├── controllers/
│   ├── orderController.js  # Order request handlers
│   └── paymentController.js # Payment request handlers
├── middleware/
│   ├── errorHandler.js     # Global error handling
│   └── validation.js       # Request validation
├── models/
│   ├── order.js            # MongoDB Order schema
│   └── index.js            # Model exports
├── routes/
│   ├── orders.js           # Order endpoints
│   └── payments.js         # Payment endpoints
├── services/
│   └── stripeService.js    # Stripe API wrapper
├── webhooks/
│   └── stripeWebhook.js    # Webhook handling
└── server.js               # Express app setup
```

## Key Components

### Database Connection
Mongoose handles MongoDB connection with error handling and connection pooling.

### Stripe Service
Encapsulates all Stripe API interactions including:
- Payment intent creation
- Checkout session creation
- Session retrieval
- Webhook verification

### Error Handling
Global middleware catches all errors and returns standardized responses with appropriate HTTP status codes.

### Validation Middleware
Validates incoming requests before processing with detailed error messages.

## Order Workflow

1. **Create Order** - Initial order with pending status
2. **Create Checkout Session** - Generate Stripe session
3. **Process Payment** - User pays via Stripe
4. **Verify Payment** - Check payment status
5. **Update Order** - Set final status (success/failed)

## Webhook Handling

Stripe webhooks verify payment events server-to-server:

1. Webhook received at `/api/webhooks/stripe`
2. Signature verified using webhook secret
3. Event processed based on type
4. Order status updated in database
5. Response sent to Stripe

## Security Features

- Webhook signature verification
- Environment variable protection
- CORS configuration
- Request validation
- Error message sanitization
- MongoDB injection prevention via Mongoose

## Testing

Use Stripe CLI for webhook testing:
```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

## Troubleshooting

### MongoDB Connection Error
- Verify MongoDB is running
- Check connection string in .env
- Ensure correct port (default 27017)

### Stripe API Errors
- Verify API keys are correct
- Check Stripe account has test mode enabled
- Ensure webhook secret is accurate

### CORS Issues
- Verify FRONTEND_URL in .env
- Check frontend is making requests to correct API URL
- Ensure credentials are enabled if needed

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **stripe** - Payment processing
- **cors** - Cross-origin requests
- **dotenv** - Environment variables
- **nodemon** - Development auto-reload

## Performance Considerations

- Connection pooling enabled
- Request body size limits set
- Timeout values configured
- Webhook retries handled
- Error logging implemented

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use production Stripe keys
3. Configure MongoDB for remote access
4. Set up proper HTTPS
5. Enable security headers
6. Configure rate limiting
7. Set up monitoring and logging

## Support

Refer to Stripe documentation for API details:
- https://docs.stripe.com/api
- https://docs.stripe.com/webhooks
npm start
```

The server will start on http://localhost:5000

## Before Starting

Make sure MongoDB is running:
```bash
mongod
```

Or if using MongoDB as a service, ensure it's started.

## API Endpoints

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (with optional filters)
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id` - Update order status

### Payments
- `POST /api/payments/create-checkout-session` - Create Stripe checkout session
- `POST /api/payments/create-payment-intent` - Create payment intent
- `GET /api/payments/session/:sessionId` - Get checkout session details
- `POST /api/payments/verify` - Verify payment completion

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook endpoint

### Health Check
- `GET /api/health` - Server health status

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| NODE_ENV | Environment (development/production) |
| MONGODB_URI | MongoDB connection string |
| STRIPE_SECRET_KEY | Stripe secret API key |
| STRIPE_PUBLISHABLE_KEY | Stripe publishable key |
| STRIPE_WEBHOOK_SECRET | Stripe webhook signing secret |
| FRONTEND_URL | Frontend application URL for CORS |

## Project Structure

```
backend/
├── src/
│   ├── server.js           # Main server entry point
│   ├── config/
│   │   ├── database.js     # MongoDB connection
│   │   └── stripe.js       # Stripe client setup
│   ├── controllers/
│   │   ├── orderController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── index.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── orders.js
│   │   └── payments.js
│   ├── services/
│   │   └── stripeService.js
│   └── webhooks/
│       └── stripeWebhook.js
├── .env
├── .env.example
└── package.json
```

## Testing with Stripe

1. Use Stripe test mode keys (starting with `sk_test_` and `pk_test_`)
2. Use Stripe test cards: https://stripe.com/docs/testing
3. Set up webhook endpoint in Stripe Dashboard
4. Use Stripe CLI for local webhook testing:
   ```bash
   stripe listen --forward-to localhost:5000/api/webhooks/stripe
   ```

## Notes

- This backend uses MongoDB with Mongoose (not PostgreSQL)
- All payments are processed through Stripe
- CORS is configured to accept requests from the frontend URL
- Error handling is centralized in the errorHandler middleware
