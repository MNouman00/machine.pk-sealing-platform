// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-gray-700 mt-4 text-xl">Page not found</p>
      <p className="text-gray-500 mt-1 text-sm">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium">Back home</Link>
    </div>
  );
}