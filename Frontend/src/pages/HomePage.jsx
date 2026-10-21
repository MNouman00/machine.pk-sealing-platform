// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Star, CheckCircle, Shield, Zap, Settings, Trophy,
  Factory, Users, Clock, Award, ChevronRight
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const stats = [
  { icon: Factory, value: '10,000+', label: 'Machines Sold' },
  { icon: Users, value: '500+', label: 'Global Partners' },
  { icon: Award, value: '25+', label: 'Industry Awards' },
  { icon: Clock, value: '15+', label: 'Years Excellence' },
];

const features = [
  { icon: Shield, title: 'Industrial Grade', desc: 'Built for 24/7 continuous operation.' },
  { icon: Zap, title: 'Energy Efficient', desc: '40% less power consumption.' },
  { icon: Settings, title: 'Precision Control', desc: 'Advanced temperature regulation.' },
  { icon: Trophy, title: 'ISO Certified', desc: 'International quality standards.' },
];

export default function HomePage() {
  // Added 'categories' to the destructuring
  const { products, categories, loading, error } = useProducts();
  const [activeProduct, setActiveProduct] = useState(0);

  // Auto-rotate featured product
  useEffect(() => {
    if (products.length < 2) return;
    const t = setInterval(() => setActiveProduct((p) => (p + 1) % products.length), 6000);
    return () => clearInterval(t);
  }, [products.length]);

  const featured = products[activeProduct];

  // Helper for the featured image
  const getFeaturedImage = () => {
    if (!featured) return 'https://picsum.photos/seed/aeco/800/800';
    if (featured.images && featured.images.length > 0) {
      const img = featured.images.find(i => i.is_feature)?.image || featured.images[0].image;
      return img.startsWith('http') ? img : `http://127.0.0.1:8000${img}`;
    }
    return featured.image_url || 'https://picsum.photos/seed/aeco/800/800';
  };

  // Helper to get products for a specific category
  const getProductsByCategory = (catName) => {
    return products.filter(p => p.category?.name === catName).slice(0, 4);
  };

  // Helper to generate the URL slug for a category
  const getCategorySlug = (categoryName) => {
    if (!categoryName) return 'all';
    return categoryName.toLowerCase().replace(/ /g, '-');
  };

  return (
    <div className="bg-gray-50">
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-blue-600/30 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-indigo-500/30 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        </div>
        
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '6s' }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium text-white border border-white/20 mb-8 shadow-2xl">
              <Sparkles size={16} className="text-blue-300" />
              <span>Next-Generation Sealing Technology</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Precision in Every <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Seal.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl font-light leading-relaxed">
              MACHINES.PK builds industrial-grade sealing machines engineered for maximum efficiency, zero downtime, and absolute reliability.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/products" className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all duration-300 shadow-[0_0_40px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_rgba(37,99,235,0.7)] flex items-center gap-2">
                Explore Products
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/quote" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-full font-semibold transition-all duration-300 border border-white/10">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED SHOWCASE ─── */}
      <section className="relative -mt-20 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative bg-slate-50 p-8 sm:p-12 flex items-center justify-center overflow-hidden min-h-[400px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#f8fafc_0%,#e2e8f0_100%)]" />
              {featured && (
                <img
                  src={getFeaturedImage()}
                  alt={featured.name}
                  className="relative z-10 w-full max-w-md object-contain transition-transform duration-700 hover:scale-105 drop-shadow-2xl"
                  onError={(e) => { e.target.src = 'https://picsum.photos/seed/aeco/800/800'; }}
                />
              )}
              {featured?.tags?.[0] && (
                <span className="absolute top-6 left-6 z-20 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                  {featured.tags[0]}
                </span>
              )}
            </div>

            <div className="p-8 sm:p-12 flex flex-col justify-center">
              {loading || !featured ? <Loading /> : (
                <>
                  <span className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">
                    {featured.category?.name}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                    {featured.name}
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed line-clamp-3">
                    {featured.short_description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {(featured.specs || []).slice(0, 4).map((spec) => (
                      <div key={spec} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                        <CheckCircle size={18} className="text-blue-600 flex-shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <Link to={`/products/${featured.slug}`} className="px-8 py-3 bg-gray-900 hover:bg-black text-white rounded-full font-semibold transition">
                      View Machine
                    </Link>
                    <span className="text-2xl font-bold text-gray-900 ml-auto">
                      ${Number(featured.price).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex justify-center gap-2 pb-6 bg-white">
            {products.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveProduct(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${activeProduct === idx ? 'w-10 bg-blue-600' : 'w-2 bg-gray-200 hover:bg-gray-300'}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── DYNAMIC CATEGORY SECTIONS ─── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Loop through all categories that actually have products */}
          {categories.map((category) => {
            const categoryProducts = getProductsByCategory(category.name);
            
            // Skip this category if it has no products
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category.id}>
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
                    <p className="text-gray-500 mt-1">
                      Explore our range of {category.name.toLowerCase()}.
                    </p>
                  </div>
                  <Link to={`/category/${getCategorySlug(category.name)}`} className="hidden sm:flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 transition">
                    View All <ChevronRight size={18} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {categoryProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* ─── STATS & FEATURES ─── */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-4xl font-extrabold text-gray-900">{s.value}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-gray-50 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-gray-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/20 blur-[100px]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Ready to Upgrade Your Operations?</h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Contact MACHINES.PK today for expert consultation and customized sealing solutions tailored to your business.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/quote" className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-500 transition shadow-lg shadow-blue-600/30">
              Get a Free Quote
            </Link>
            <Link to="/products" className="px-8 py-4 bg-white/10 text-white backdrop-blur-md font-semibold rounded-full hover:bg-white/20 transition border border-white/10">
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}