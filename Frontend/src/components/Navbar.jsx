// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, User, ShoppingCart, LogOut, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const MACHINES = [
  { name: 'Heat Sealers', path: '/category/heat-sealers' },
  { name: 'Vacuum Sealers', path: '/category/vacuum-sealers' },
  { name: 'Band Sealers', path: '/category/band-sealers' },
  { name: 'Induction Sealers', path: '/category/induction-sealers' },
  { name: 'Smart Sealers', path: '/category/smart-technology' },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [machinesOpen, setMachinesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dropdownRef = useRef(null);
  const cartRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setMachinesOpen(false);
      if (cartRef.current && !cartRef.current.contains(e.target)) setCartOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    navigate('/');
  };

  const textColor = isScrolled ? 'text-gray-800' : 'text-white';

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-slate-900/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button
              className={`lg:hidden p-2 rounded-md ${textColor}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-blue-700' : 'text-white'}`}>
              MACHINES.PK
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className={`text-sm font-medium hover:text-blue-500 transition-colors ${textColor}`}>
              Home
            </Link>
            
            {/* Machines Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onMouseEnter={() => setMachinesOpen(true)}
                onMouseLeave={() => setMachinesOpen(false)}
                className={`flex items-center gap-1 text-sm font-medium hover:text-blue-500 transition-colors ${textColor}`}
              >
                Sealing Machines <ChevronDown size={16} />
              </button>
              
              {machinesOpen && (
                <div 
                  onMouseEnter={() => setMachinesOpen(true)}
                  onMouseLeave={() => setMachinesOpen(false)}
                  className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-2"
                >
                  {MACHINES.map((machine) => (
                    <Link
                      key={machine.name}
                      to={machine.path}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {machine.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/products" className={`text-sm font-medium hover:text-blue-500 transition-colors ${textColor}`}>
              All Products
            </Link>
            <Link to="/support" className={`text-sm font-medium hover:text-blue-500 transition-colors ${textColor}`}>
              Support
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Search */}
            <div className="relative">
              <button onClick={() => setSearchOpen(!searchOpen)} className={`p-2 rounded-full hover:bg-gray-100/20 ${textColor}`}>
                <Search size={20} />
              </button>
              {searchOpen && (
                <form onSubmit={submitSearch} className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl p-2 border border-gray-100">
                  <input
                    type="search"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search machines..."
                    className="w-full bg-gray-50 text-sm text-gray-900 border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                  />
                </form>
              )}
            </div>

            {/* Cart */}
            <div className="relative" ref={cartRef}>
              <button onClick={() => setCartOpen(!cartOpen)} className={`p-2 rounded-full hover:bg-gray-100/20 relative ${textColor}`}>
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              {cartOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4">
                  <p className="text-sm font-bold text-gray-900 mb-3">Cart ({totalItems} items)</p>
                  <div className="flex gap-2">
                    <Link to="/cart" onClick={() => setCartOpen(false)} className="flex-1 text-center py-2 bg-gray-100 text-sm rounded-lg hover:bg-gray-200">View Cart</Link>
                    <Link to="/checkout" onClick={() => setCartOpen(false)} className="flex-1 text-center py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Checkout</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Account */}
            <div className="relative" ref={userRef}>
              {user ? (
                <button onClick={() => setUserOpen(!userOpen)} className={`flex items-center gap-2 p-2 rounded-full hover:bg-gray-100/20 ${textColor}`}>
                  <User size={20} />
                  <span className="hidden sm:inline text-sm font-medium">{user.username}</span>
                </button>
              ) : (
                <Link to="/login" className={`flex items-center gap-1 p-2 text-sm font-medium ${textColor} hover:text-blue-500`}>
                  <User size={20} /> <span className="hidden sm:inline">Login</span>
                </Link>
              )}
              
              {user && userOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                  <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Account</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Contact Button */}
            <Link to="/quote" className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
              <Phone size={16} /> Get Quote
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bg-white border-t border-gray-100 shadow-xl h-screen overflow-y-auto pb-20">
            <div className="p-4 space-y-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-gray-800 font-medium border-b border-gray-100">Home</Link>
              <div className="py-3 border-b border-gray-100">
                <p className="font-medium text-gray-800 mb-2">Sealing Machines</p>
                <div className="pl-4 space-y-2">
                  {MACHINES.map((m) => (
                    <Link key={m.name} to={m.path} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm text-gray-600">
                      {m.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-gray-800 font-medium border-b border-gray-100">All Products</Link>
              <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-gray-800 font-medium border-b border-gray-100">Support</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}