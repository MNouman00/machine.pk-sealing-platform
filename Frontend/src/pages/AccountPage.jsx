// src/pages/AccountPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Clock, LogOut, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import Loading from '../components/Loading';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // 1. Function to fetch orders
    const fetchOrders = () => {
      api.get('/orders/')
        .then(res => setOrders(res.data))
        .catch(() => {});
    };

    // 2. Fetch profile (only once) and initial orders
    Promise.all([
      api.get('/auth/users/me/').then(res => setProfile(res.data)).catch(() => {}),
      api.get('/orders/').then(res => setOrders(res.data)).catch(() => setOrders([]))
    ]).finally(() => setLoading(false));

    // 3. Set up the 3-hour auto-refresh timer
    // 3 hours = 3 * 60 * 60 * 1000 = 10,800,000 ms
    const interval = setInterval(fetchOrders, 10800000);

    // 4. Cleanup timer when user leaves the page
    return () => clearInterval(interval);
  }, [user]);

  // Helper to calculate the truck's position and progress percentage
  const getTrackerState = (status) => {
    const s = status.toLowerCase();
    if (s === 'pending') return { percent: 10, color: 'text-gray-400', label: 'Order Placed' };
    if (s === 'paid') return { percent: 40, color: 'text-blue-600', label: 'Payment Received' };
    if (s === 'shipped') return { percent: 75, color: 'text-orange-500', label: 'On the Way' };
    if (s === 'delivered') return { percent: 100, color: 'text-green-600', label: 'Delivered' };
    return { percent: 0, color: 'text-gray-300', label: 'Unknown' };
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Please log in</h1>
        <Link to="/login" className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700">Go to Login</Link>
      </div>
    );
  }

  if (loading) return <div className="pt-24"><Loading label="Loading account details..." /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{profile?.username || user.username}</h1>
              <p className="text-sm text-gray-500">{profile?.email || 'No email set'}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">My Orders</h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
              <Link to="/products" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const tracker = getTrackerState(order.status);
                
                return (
                  <div key={order.id} className="border border-gray-100 rounded-2xl p-5 hover:border-blue-100 transition shadow-sm">
                    
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                      <div>
                        <p className="font-mono text-sm font-semibold text-blue-700">{order.reference}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Clock size={12} /> {new Date(order.created_at).toLocaleDateString()} 
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">${Number(order.total).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* ─── VISUAL SHIPPING TRACKER ─── */}
                    <div className="relative pt-6 pb-2 mb-6 px-2">
                      {/* Background Line */}
                      <div className="absolute top-10 left-4 right-4 h-1 bg-gray-200 rounded-full" />
                      
                      {/* Progress Line */}
                      <div 
                        className="absolute top-10 left-4 h-1 bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `calc(${tracker.percent}% - 16px)` }}
                      />

                      {/* Moving Truck Icon */}
                      <div 
                        className={`absolute top-4 transition-all duration-1000 ease-out z-10 ${tracker.color}`}
                        style={{ left: `calc(${tracker.percent}% - 12px)` }}
                      >
                        <div className="bg-white rounded-full p-1 shadow-md border border-gray-100">
                          <Truck size={20} />
                        </div>
                      </div>

                      {/* Status Labels under the line */}
                      <div className="flex justify-between items-start text-[10px] font-medium text-gray-400 mt-2 relative z-0">
                        <div className={`flex flex-col items-center ${tracker.percent >= 10 ? 'text-blue-600' : ''}`}>
                          <span className="w-2 h-2 rounded-full bg-current mb-1" />
                          Placed
                        </div>
                        <div className={`flex flex-col items-center ${tracker.percent >= 40 ? 'text-blue-600' : ''}`}>
                          <span className="w-2 h-2 rounded-full bg-current mb-1" />
                          Paid
                        </div>
                        <div className={`flex flex-col items-center ${tracker.percent >= 75 ? 'text-orange-500' : ''}`}>
                          <span className="w-2 h-2 rounded-full bg-current mb-1" />
                          Shipped
                        </div>
                        <div className={`flex flex-col items-center ${tracker.percent >= 100 ? 'text-green-600' : ''}`}>
                          <span className="w-2 h-2 rounded-full bg-current mb-1" />
                          Delivered
                        </div>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2 border-t border-gray-100 pt-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items</p>
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                          <span>{item.product_name} <span className="text-gray-400 font-medium ml-1">×{item.quantity}</span></span>
                          <span className="font-medium">${Number(item.line_total).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}