# Stripe Checkout Backend API

Backend API for Stripe payment processing with MongoDB.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally on port 27017)
- Stripe account with API keys

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update with your actual Stripe API keys

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
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
