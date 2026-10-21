// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatWidget from './components/AIChatWidget';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import SupportPage from './pages/SupportPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import CategoryPage from './pages/CategoryPage';
import QuotePage from './pages/QuotePage';
import AccountPage from './pages/AccountPage';
import './App.css';

function App() {
  return (
    <Router>
       <AuthProvider> 
      <CartProvider>
        <ProductProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success/:reference" element={<OrderSuccessPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/quote" element={<QuotePage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/login" element={<AuthPage />} /> 
              </Routes>
            </main>
            <Footer />
              <AIChatWidget />
          </div>
        </ProductProvider>
      </CartProvider>
        </AuthProvider>
    </Router>
  );
}

export default App;