import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import './App.css';

/**
 * Main App Component
 * Sets up routing for the entire application
 */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Products listing page */}
        <Route path="/" element={<ProductsPage />} />

        {/* Checkout form page */}
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Payment success page (after Stripe redirect) */}
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Payment failed page (if payment is cancelled or fails) */}
        <Route path="/payment-failed" element={<PaymentFailed />} />
      </Routes>
    </BrowserRouter>
  );
}
