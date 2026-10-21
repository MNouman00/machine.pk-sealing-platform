// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const CATEGORY_MAP = {
  'heat-sealers': { title: 'Heat Sealers', desc: 'Precision impulse and constant heat sealing machines.' },
  'vacuum-sealers': { title: 'Vacuum Sealers', desc: 'Chamber and external vacuum sealing for extended shelf life.' },
  'band-sealers': { title: 'Band Sealers', desc: 'Continuous band sealing for high-volume production lines.' },
  'induction-sealers': { title: 'Induction Sealers', desc: 'Tamper-evident induction sealing for secure packaging.' },
  'smart-technology': { title: 'Smart Sealers', desc: 'AI-powered sealing systems with real-time monitoring.' },
};

export default function CategoryPage() {
  const { slug } = useParams();
  const { products, loading, error } = useProducts();
  const [filtered, setFiltered] = useState([]);
  
  const categoryInfo = CATEGORY_MAP[slug] || { 
    title: slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()), 
    desc: 'Browse our selection of industrial sealing equipment.' 
  };

  useEffect(() => {
    if (products.length > 0) {
      // Filter products where the category name matches the URL
      const catProducts = products.filter(
        p => p.category?.slug === slug || 
             p.category?.name.toLowerCase().replace(/ /g, '-') === slug ||
             p.category?.name.toLowerCase().includes(categoryInfo.title.toLowerCase())
      );
      setFiltered(catProducts);
    }
  }, [products, slug, categoryInfo.title]);

  if (loading) return <div className="pt-24"><Loading /></div>;
  if (error) return <div className="pt-24 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link> 
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{categoryInfo.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{categoryInfo.title}</h1>
          <p className="text-gray-500 mt-2 max-w-2xl">{categoryInfo.desc}</p>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-lg mb-4">No products found in this category yet.</p>
            <Link to="/products" className="text-blue-600 hover:underline">View All Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}