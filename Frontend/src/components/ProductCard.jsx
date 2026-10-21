// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Combined imports
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const tag = product.tags?.[0];
  
  // 1. Logic to pick the best image
  const [imgSrc, setImgSrc] = useState(() => {
    let img = 'https://picsum.photos/seed/aeco/600/600';
    
    if (product.images && product.images.length > 0) {
      const featureImg = product.images.find(img => img.is_feature) || product.images[0];
      img = featureImg.image;
    } else if (product.image_url) {
      img = product.image_url;
    }
    
    if (img && !img.startsWith('http')) {
      img = `http://127.0.0.1:8000${img}`;
    }
    return img;
  });

  const handleImageError = () => {
    if (imgSrc !== 'https://picsum.photos/seed/aeco/600/600') {
      setImgSrc('https://picsum.photos/seed/aeco/600/600');
    }
  };

  // 2. Add to cart logic
  const handleAddToCart = () => {
    addItem(product);
    navigate('/cart');
  };

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col">
      <Link to={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {tag && (
          <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded-full font-medium shadow z-10">
            {tag}
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] uppercase tracking-wider text-blue-600 font-semibold">
          {product.category?.name || 'Sealing'}
        </span>
        <h3 className="text-gray-900 font-semibold text-sm mt-1 line-clamp-2 min-h-[2.5rem]">
          <Link to={`/products/${product.slug}`} className="hover:text-blue-700">
            {product.name}
          </Link>
        </h3>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
          {product.short_description}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </span>
            <span className="ml-1 text-[10px] text-gray-500">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to={`/products/${product.slug}`}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              aria-label={`View ${product.name}`}
            >
              <Eye size={16} />
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white transition shadow-sm"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}