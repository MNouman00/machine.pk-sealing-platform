// src/pages/SupportPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, FileText, ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How do I choose the right sealing machine?',
    a: 'It depends on your material, production volume, and packaging type. Use our AI Assistant to get a personalized recommendation, or contact our sales team for a free consultation.'
  },
  {
    q: 'What is the warranty period?',
    a: 'All AECO machines come with a 2-year limited warranty covering manufacturing defects. Consumable parts (like sealing tape) have a 90-day warranty.'
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping is 5–7 business days within the country. Express options are available at checkout. International shipping is available — contact us for a quote.'
  },
  {
    q: 'Do you offer training?',
    a: 'Yes! We offer on-site operator training, video tutorials, and certification programs. Contact support@aeco.com to schedule a session.'
  },
  {
    q: 'What if my machine breaks down?',
    a: 'Our support team is available Monday–Friday, 9AM–5PM. We offer remote troubleshooting, replacement parts, and on-site repair services.'
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">How can we help?</h1>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Our support team is ready to help with any question about your MACHINES.PK machine.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <a href="tel:+18005551234" className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition text-center group">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100">
              <Phone size={20} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Call Us</h3>
            <p className="text-sm text-gray-500 mt-1">+1 (800) 555-1234</p>
          </a>
          <a href="mailto:support@aeco.com" className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition text-center group">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100">
              <Mail size={20} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Email Us</h3>
            <p className="text-sm text-gray-500 mt-1">support@machines.pk</p>
          </a>
          <a href="https://wa.me/18005551234" target="_blank" rel="noreferrer" className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition text-center group">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-100">
              <MessageCircle size={20} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">WhatsApp</h3>
            <p className="text-sm text-gray-500 mt-1">Chat with us</p>
          </a>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle size={24} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant CTA */}
        <div className="mt-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Need instant help?</h2>
          <p className="text-white/80 text-sm mb-4">Our AI Assistant is available 24/7 to answer questions and find the perfect machine.</p>
          <p className="text-white text-sm font-medium">💬 Click the chat bubble in the bottom-right corner</p>
        </div>

      </div>
    </div>
  );
}