// src/pages/QuotePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import { useProducts } from '../context/ProductContext';

export default function QuotePage() {
  const { products } = useProducts();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    machine_interest: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/quotes/', form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', company: '', machine_interest: '', message: '' });
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Could not send request. Is the backend running?');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg text-center">
          <div className="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your interest. Our sales team will review your request and get back to you within 24 hours.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Request a Quote</h1>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Tell us about your needs and we'll provide a customized proposal for your sealing operations.
          </p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-10 space-y-5">
            
            {/* Contact Info */}
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">Your Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                <input required value={form.name} onChange={update('name')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                <input required type="email" value={form.email} onChange={update('email')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                <input value={form.phone} onChange={update('phone')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
                <input value={form.company} onChange={update('company')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>

            {/* Machine Interest */}
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4 mt-8">What are you looking for?</h2>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Machine Interest *</label>
              <select required value={form.machine_interest} onChange={update('machine_interest')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 outline-none">
                <option value="">Select a machine...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
                <option value="Custom / Other">Custom / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Project Details *</label>
              <textarea required rows="4" value={form.message} onChange={update('message')} placeholder="Tell us about your production volume, material specifications, or any specific requirements..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 outline-none" />
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

            <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-full transition shadow-lg shadow-blue-600/20">
              {submitting ? 'Sending Request...' : 'Submit Quote Request'}
              {!submitting && <Send size={16} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}