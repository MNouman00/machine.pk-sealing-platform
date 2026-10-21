// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const { items, totalPrice, clear } = useCart();
  const { user } = useAuth(); // <-- 1. Extract the logged-in user
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 2. Auto-fill the name when the page loads
  useEffect(() => {
    if (user) {
      setForm(f => ({ ...f, customer_name: user.username }));
    }
  }, [user]);

  // 3. Protect the route: If not logged in, show a message
  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
        <p className="text-gray-600 mb-6">You must be logged in to place an order.</p>
        <Link to="/login" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition">
          Go to Login
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 text-center">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-blue-600 hover:underline">Browse products</Link>
      </div>
    );
  }

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
      };
      // The AuthContext automatically attaches the token to this request
      const order = await createOrder(payload);
      clear();
      navigate(`/order-success/${order.reference}`, { state: { order } });
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data ? JSON.stringify(err.response.data) : 'Could not place order. Are you logged in?'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={submit} className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full name *</label>
                <input required value={form.customer_name} onChange={update('customer_name')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                <input required type="email" value={form.customer_email} onChange={update('customer_email')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                <input value={form.customer_phone} onChange={update('customer_phone')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>

            <h2 className="font-semibold text-gray-900 pt-4">Shipping address</h2>
            <textarea rows="3" value={form.shipping_address} onChange={update('shipping_address')} placeholder="Street, city, country" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />

            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}

            <button type="submit" disabled={submitting} className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-full transition">
              {submitting ? 'Placing order...' : `Place order — $${totalPrice.toFixed(2)}`}
            </button>
          </form>

          <aside className="bg-white rounded-2xl border border-gray-200 p-6 h-fit">
            <h2 className="font-semibold text-gray-900 mb-4">Order summary</h2>
            <ul className="space-y-3 mb-4">
              {items.map((i) => (
                <li key={i.productId} className="flex items-center gap-3 text-sm">
                  <img 
                          src={
                                 i.imageUrl 
                                      ? (i.imageUrl.startsWith('http') ? i.imageUrl : `http://127.0.0.1:8000${i.imageUrl}`) 
                                    : 'https://picsum.photos/seed/aeco/60/60'
                                       } 
                                   alt={i.name} 
                                       className="w-12 h-12 rounded bg-gray-50 object-contain p-1" 
                                    />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-gray-900">{i.name}</p>
                    <p className="text-xs text-gray-500">×{i.quantity}</p>
                  </div>
                  <span className="font-medium text-gray-900">${(i.price * i.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
              <span>Total</span><span>${totalPrice.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}