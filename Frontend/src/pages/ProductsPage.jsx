// src/pages/ProductsPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

export default function ProductsPage() {
  const { products, categories, loading, error } = useProducts();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [maxPrice, setMaxPrice] = useState(params.get('max_price') || '');
  const [sort, setSort] = useState(params.get('sort') || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    if (category) next.set('category', category);
    if (maxPrice) next.set('max_price', maxPrice);
    if (sort) next.set('sort', sort);
    setParams(next, { replace: true });
  }, [q, category, maxPrice, sort, setParams]);

  const filtered = useMemo(() => {
    let list = products.slice();
    if (q) {
      const lower = q.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.short_description || '').toLowerCase().includes(lower) ||
        (p.category?.name || '').toLowerCase().includes(lower)
      );
    }
    if (category) list = list.filter((p) => p.category?.name === category);
    if (maxPrice) list = list.filter((p) => Number(p.price) <= Number(maxPrice));
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, q, category, maxPrice, sort]);

  const clearAll = () => { setQ(''); setCategory(''); setMaxPrice(''); setSort(''); };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-500 mt-2">Browse MACHINES.PK sealing machines and accessories</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className={`lg:w-64 lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={16} /> Filters
                </h2>
                <button onClick={clearAll} className="text-xs text-blue-600 hover:underline">Clear</button>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">All categories</option>
                  {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Max price: {maxPrice ? `$${maxPrice}` : 'Any'}
                </label>
                <input
                  type="range" min="0" max="2000" step="50" value={maxPrice || 2000}
                  onChange={(e) => setMaxPrice(e.target.value === '2000' ? '' : e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Sort by</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option value="">Default</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none"
                />
              </div>
              <button onClick={() => setShowFilters((s) => !s)} className="lg:hidden px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm flex items-center justify-center gap-2">
                <SlidersHorizontal size={16} /> Filters
              </button>
            </div>

            {loading ? <Loading /> : error ? (
              <p className="text-red-600 text-center py-12">{error}</p>
            ) : filtered.length === 0 ? (
              <EmptyState title="No products found" description="Try adjusting your filters or search terms." actionLabel="Clear filters" actionTo="/products" />
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}