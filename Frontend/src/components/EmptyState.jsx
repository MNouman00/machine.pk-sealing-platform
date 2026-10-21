// src/components/EmptyState.jsx
import React from 'react';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'Nothing here',
  description = '',
  actionLabel = 'Browse products',
  actionTo = '/products',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <Package className="w-7 h-7 text-blue-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {description && (
        <p className="text-gray-500 text-sm mt-2 max-w-md">{description}</p>
      )}
      {actionLabel && (
        <Link
          to={actionTo}
          className="mt-6 inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-all shadow-sm"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}