// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // <-- Add this import

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">MACHINES.PK</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Precision sealing solutions for industrial manufacturing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Products
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Sealing Machines
                </Link>
              </li>
              <li>
                <Link to="/category/vacuum-sealers" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Vacuum Sealers
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Replacement Parts
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Technical Support
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Product Manuals
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>123 Industrial Park Blvd</li>
              <li>Manufacturing City, MC 12345</li>
              <li>
                <a href="tel:+18005551234" className="hover:text-blue-400 transition-colors">
                  +1 (800) 555-1234
                </a>
              </li>
              <li>
                <a href="mailto:info@aeco.com" className="hover:text-blue-400 transition-colors">
                  info@aeco.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} MACHINES.PK Sealing Solutions. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link to="/privacy" className="text-gray-500 hover:text-blue-400 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-blue-400 transition-colors">
                Terms
              </Link>
              <Link to="/sitemap" className="text-gray-500 hover:text-blue-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;