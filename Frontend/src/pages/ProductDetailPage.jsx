// src/pages/ProductDetailPage.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, ShoppingCart, Minus, Plus, Truck, Shield, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProduct } from '../lib/api';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';


export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setLoading(true); setError(null);
    fetchProduct(slug)
      .then(setProduct)
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [slug]);
const addToCart = () => {
    if (!product) return;
    addItem(product, qty);
    setAdded(true);
    
    // Change the button text to "Added!" for 800ms, THEN redirect
    setTimeout(() => {
      setAdded(false);
      navigate('/cart');
    }, 800);
  };
  if (loading) return <div className="pt-24"><Loading /></div>;
  if (error || !product) return (
    <div className="pt-24 text-center py-20">
      <p className="text-red-600 mb-4">{error}</p>
      <Link to="/products" className="text-blue-600 hover:underline">← Back to products</Link>
    </div>
  );

  // 1. Helper function to ensure image URLs point to the Django backend
   const getFullImageUrl = (url) => {
    if (!url) return 'https://picsum.photos/seed/aeco/800/800';
    if (url.startsWith('http')) return url; // If it's a URL, return it as is
    return `http://127.0.0.1:8000${url}`;   // If it's a local file, add backend URL
  };

  // 2. Build the gallery array
  const galleryImages = [];
  if (product.images && product.images.length > 0) {
    const featureImage = product.images.find(img => img.is_feature);
    if (featureImage) galleryImages.push(getFullImageUrl(featureImage.image));
    
    product.images.forEach(img => {
      if (!img.is_feature || !featureImage) {
        galleryImages.push(getFullImageUrl(img.image));
      }
    });
  } else if (product.image_url) {
    galleryImages.push(getFullImageUrl(product.image_url));
  } else {
    galleryImages.push('https://picsum.photos/seed/aeco/800/800'); 
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6">
          <ArrowLeft size={14} /> Back to products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Image Gallery */}
          <div>
            <div className="bg-gray-50 rounded-3xl overflow-hidden aspect-square relative group">
             <img
                 src={getFullImageUrl(galleryImages[activeImageIndex])}
                alt={product.name}
                 className="w-full h-full object-contain p-8"
                  onError={(e) => { 
                   // If image fails to load, show a placeholder
                     e.target.src = 'https://picsum.photos/seed/aeco/800/800'; 
                  }}
              />
              
              {galleryImages.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImageIndex(prev => prev > 0 ? prev - 1 : galleryImages.length - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-opacity"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setActiveImageIndex(prev => prev < galleryImages.length - 1 ? prev + 1 : 0)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-opacity"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${
                      activeImageIndex === idx ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              {product.category?.name}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">{product.name}</h1>
            <p className="text-gray-600 mt-3">{product.short_description}</p>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {product.specs?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Specifications</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {product.specs.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle size={14} className="text-blue-600 flex-shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.features?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {product.features.map((f) => (
                  <span key={f} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">{f}</span>
                ))}
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              <div className="inline-flex items-center border border-gray-300 rounded-full">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-gray-100 rounded-l-full" aria-label="Decrease"><Minus size={14} /></button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-2.5 hover:bg-gray-100 rounded-r-full" aria-label="Increase"><Plus size={14} /></button>
              </div>
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-full transition"
              >
                <ShoppingCart size={18} /> {added ? 'Added to cart!' : 'Add to cart'}
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl"><Truck size={16} className="text-blue-600" /> fast shipping</div>
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl"><Shield size={16} className="text-blue-600" /> 1-year warranty</div>
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl"><Award size={16} className="text-blue-600" /> ISO certified</div>
            </div>

            {product.description && (
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}