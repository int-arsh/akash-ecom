# Frontend - E-Commerce Checkout Application

React-based frontend application for browsing products and processing payments through Stripe.

## Overview

This is a modern e-commerce frontend built with React and Vite. It provides a complete user interface for product browsing, shopping cart management, and checkout flow with Stripe integration.

## Technology Stack

- React 19.2.0
- Vite 7.2.4
- React Router DOM 7.11.0
- Axios 1.13.2
- Stripe.js 8.6.0

## Prerequisites

- Node.js v14 or higher
- Backend API running on `http://localhost:5000`
- Stripe publishable key

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Create .env file in project root
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Running the Application

Development server with hot reload:
```bash
npm run dev
```

The application runs on `http://localhost:5173`

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ProductCard.jsx & ProductCard.css
│   │   - Individual product display
│   │   - Add to cart functionality
│   ├── CartIcon.jsx & CartIcon.css
│   │   - Floating cart button
│   │   - Item count badge
│   ├── CartModal.jsx & CartModal.css
│   │   - Shopping cart display
│   │   - Item management
│   └── CheckoutForm.jsx & CheckoutForm.css
│       - Email input
│       - Order summary
├── pages/
│   ├── ProductsPage.jsx & ProductsPage.css
│   │   - Product listing
│   │   - Shopping cart integration
│   ├── CheckoutPage.jsx & CheckoutPage.css
│   │   - Checkout form display
│   │   - Stripe session creation
│   ├── PaymentSuccess.jsx & PaymentSuccess.css
│   │   - Payment confirmation
│   │   - Order details display
│   └── PaymentFailed.jsx & PaymentFailed.css
│       - Payment failure handling
│       - Retry options
├── services/
│   └── api.js
│       - Axios configuration
│       - API client functions
├── utils/
│   └── mockData.js
│       - Sample product data
├── App.jsx & App.css
│   - Main app component
│   - Routing setup
├── index.css
│   - Global styles
└── main.jsx
    - React entry point
```

## Core Features

### Product Browsing
- Display 8 sample products with details
- Product cards with images and descriptions
- Responsive grid layout

### Shopping Cart
- Add products to cart
- Increment quantity for existing items
- Visual item count badge
- Remove items from cart
- Cart appears as modal overlay

### Checkout
- Email validation
- Order summary display
- Total amount calculation
- Form error handling

### Payment Integration
- Stripe Checkout integration
- Handles successful payments
- Manages failed payments
- Order confirmation

## API Integration

All API calls go through the axios instance in `src/services/api.js`:

```javascript
import { createCheckoutSession, verifyPayment } from '../services/api';

// Create checkout session
const response = await createCheckoutSession({
  items: cartItems,
  customerEmail: email
});

// Verify payment
const result = await verifyPayment(sessionId);
```

Available functions:
- `createOrder(orderData)` - Create new order
- `getOrder(orderId)` - Fetch order details
- `createCheckoutSession(checkoutData)` - Initiate Stripe session
- `verifyPayment(sessionId)` - Verify payment status
- `updateOrderStatus(orderId, status)` - Update order status

## Routing

The application uses React Router with these routes:

```
/ - ProductsPage (main shopping page)
/checkout - CheckoutPage (checkout form)
/payment-success - PaymentSuccess (success confirmation)
/payment-failed - PaymentFailed (failure recovery)
```

Navigation is handled with `useNavigate` hook for programmatic routing.

## State Management

Component-level state using React hooks:

- `ProductsPage`: cart state, cart visibility, item count
- `CheckoutForm`: email state, validation errors
- `CheckoutPage`: loading state, error state
- `PaymentSuccess`: loading state, verified state, order data
- `CartModal`: automatically handled by parent

## Error Handling

Axios interceptors handle all API errors:

```javascript
// Request logging
// Response data extraction
// Error formatting with user-friendly messages
// Promise rejection for error handling
```

Component-level error handling:
- Form validation with error display
- API error display
- Loading states during async operations
- Fallback messages for edge cases

## Styling Approach

- Component-level CSS files
- Global styles in `index.css`
- Responsive design without media queries (using CSS Grid)
- Consistent color scheme and spacing

## Key Components

### ProductCard
Displays single product with add to cart button.

Props: `product`, `onAddToCart`

### CartIcon
Floating cart button with item count badge.

Props: `itemCount`, `onClick`

### CartModal
Modal overlay showing cart contents.

Props: `isOpen`, `onClose`, `cartItems`, `onCheckout`, `onRemoveItem`

### CheckoutForm
Email validation and order summary.

Props: `cartItems`, `totalAmount`, `onSubmit`, `onCancel`

## Testing Payments

Use these test card numbers with Stripe:

**Successful Payment:**
- Card: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits

**Failed Payment:**
- Card: 4000 0000 0000 0002
- Expiry: Any future date
- CVC: Any 3 digits

## Environment Variables

Required environment variables in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Never commit `.env` file to version control.

## Build and Deployment

Vite optimizes the build for production:

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

Deploy to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Traditional web servers

## Development Workflow

1. Start backend API
2. Run `npm run dev`
3. Open browser to `http://localhost:5173`
4. Changes auto-refresh (HMR enabled)
5. Check browser console for errors

## Performance

- Vite provides fast development experience
- Code splitting for optimized bundle size
- Lazy loading of routes
- Optimized image loading

## Browser Support

Works on all modern browsers with ES6+ support:
- Chrome
- Firefox
- Safari
- Edge

## Dependencies

- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Client-side routing
- **axios** - HTTP client
- **@stripe/stripe-js** - Stripe integration

## ESLint Configuration

Basic ESLint configuration included for code quality. Run:

```bash
npm run lint
```

## Troubleshooting

### API Connection Error
- Verify backend is running on correct port
- Check VITE_API_URL in .env
- Restart dev server after env changes

### Stripe Not Loading
- Verify VITE_STRIPE_PUBLISHABLE_KEY
- Check Stripe key is valid and in test mode
- Restart dev server

### Cart Not Showing
- Verify modal CSS loaded (check CartModal.css)
- Check z-index conflicts with other elements
- Verify click handlers are wired correctly

## Support

For API-related issues, see the backend README.
For general React questions, refer to React documentation: https://react.dev
