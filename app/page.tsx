'use client';

import React, { useState } from 'react';

const products = [
  {
    id: "klein-tools-mm325",
    title: "Klein Tools MM325 Digital Multimeter",
    category: "Specialized Tools & Parts",
    price: 34.99,
    description: "Manual-ranging 600V AC/DC voltage tester for batteries, current, resistance, diodes, and continuity.",
    image: "https://m.media-amazon.com/images/I/61m1hD4tQdL._AC_SL1500_.jpg",
    amazonUrl: "https://www.amazon.com/Klein-Tools-MM325-Multimeter-Manual-Ranging/dp/B0B57L9FNL/",
    score: 9.8
  },
  {
    id: "garmin-forerunner-265",
    title: "Garmin Forerunner 265",
    category: "Sports",
    price: 449.99,
    description: "Advanced GPS running smartwatch with a vibrant AMOLED display.",
    image: "https://m.media-amazon.com/images/I/71X8g0z5Y1L._AC_SL1500_.jpg",
    amazonUrl: "https://www.amazon.com/",
    score: 9.6
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">SmartPick Recommendations</h1>
        
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 mb-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col justify-between border border-gray-100">
              <div>
                {product.image ? (
                  <img src={product.image} alt={product.title} className="w-full h-48 object-contain p-4 bg-white" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="p-5">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">{product.category}</span>
                  <div className="flex justify-between items-start mt-3">
                    <h2 className="text-lg font-bold text-gray-800">{product.title}</h2>
                    <span className="text-lg font-bold text-blue-600">${product.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                </div>
              </div>
              <div className="p-5 pt-0 flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-gray-500">Score: {product.score}</span>
                <a
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Buy on Amazon (Affiliate)
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}