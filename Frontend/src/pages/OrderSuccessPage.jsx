// src/pages/OrderSuccessPage.jsx
import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  const { reference } = useParams();
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Order received!</h1>
        <p className="text-gray-600 mt-2">Thank you for your purchase.</p>
        <p className="mt-4 inline-block px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm">
          Order reference: <span className="font-mono font-semibold text-blue-700">{reference}</span>
        </p>

        {order && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-3">Order summary</h2>
            <ul className="space-y-2 text-sm">
              {(order.items || []).map((it, idx) => (
                <li key={idx} className="flex justify-between">
                  <span className="text-gray-700">{it.product_name} × {it.quantity}</span>
                  <span className="font-medium">${Number(it.line_total).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold text-gray-900">
              <span>Total</span><span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/products" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium">Continue shopping</Link>
          <Link to="/" className="px-6 py-2.5 border border-gray-300 hover:border-blue-600 text-gray-700 rounded-full font-medium">Back home</Link>
        </div>
      </div>
    </div>
  );
}