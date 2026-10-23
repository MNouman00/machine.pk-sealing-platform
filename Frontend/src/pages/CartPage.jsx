// src/pages/CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalItems, totalPrice, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <ShoppingBag className="w-9 h-9 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-500 mt-2 mb-6">Browse our sealing machines to get started.</p>
          <Link to="/products" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.productId} className="p-4 sm:p-5 flex items-start gap-4">
                <img
                  src={
                    item.imageUrl 
                      ? (item.imageUrl.startsWith('http') ? item.imageUrl : `https://machine-pk-sealing-platform.onrender.com${item.imageUrl}`) 
                      : 'https://picsum.photos/seed/aeco/120/120'
                  }
                  alt={item.name}
                  className="w-20 h-20 object-contain bg-gray-50 rounded-lg p-2 flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://picsum.photos/seed/aeco/120/120'; }}
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.slug}`} className="font-medium text-gray-900 hover:text-blue-700 truncate block">{item.name}</Link>
                  <p className="text-sm text-gray-500 mt-0.5">${item.price.toFixed(2)} each</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="inline-flex items-center border border-gray-200 rounded-full">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1.5 hover:bg-gray-100 rounded-l-full"><Minus size={12} /></button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1.5 hover:bg-gray-100 rounded-r-full"><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeItem(item.productId)} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="p-4 flex justify-end">
              <button onClick={clear} className="text-sm text-gray-500 hover:text-red-600">Clear cart</button>
            </div>
          </div>

          <aside className="bg-white rounded-2xl border border-gray-200 p-6 h-fit sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Order summary</h2>
            <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Subtotal ({totalItems} items)</span><span>${totalPrice.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Shipping</span><span className="text-green-600">Free</span></div>
            <div className="border-t border-gray-100 my-3" />
            <div className="flex justify-between font-bold text-lg text-gray-900"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
            <Link to="/checkout" className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition">
              Checkout <ArrowRight size={16} />
            </Link>
            <Link to="/products" className="mt-3 w-full inline-flex items-center justify-center text-sm text-gray-600 hover:text-blue-600">Continue shopping</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}