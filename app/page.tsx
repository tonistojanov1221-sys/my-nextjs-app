"use client";

import { useState } from "react";

interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  score: number;
  description: string;
  image: string;
  query: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Sony WH-1000XM5 Wireless Headphones",
    category: "Tech",
    price: "$398.00",
    score: 9.8,
    description: "Врвно поништување на бучава и исклучителен аудио квалитет.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    query: "Sony WH-1000XM5",
  },
  {
    id: "2",
    title: "Apple MacBook Air M3",
    category: "Tech",
    price: "$1,099.00",
    score: 9.7,
    description: "Ултра брз лаптоп со целодневен век на батеријата.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    query: "MacBook Air M3",
  },
  {
    id: "3",
    title: "Breville Barista Touch Espresso Machine",
    category: "Kitchen",
    price: "$799.95",
    score: 9.5,
    description: "Совршено еспресо со автоматски екран на допир.",
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&q=80",
    query: "Breville Barista Espresso",
  },
  {
    id: "4",
    title: "Keychron K2 Wireless Keyboard",
    category: "Workspace",
    price: "$79.99",
    score: 9.3,
    description: "Механичка тастатура со идеално искуство за пишување.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
    query: "Keychron K2 Keyboard",
  },
  {
    id: "5",
    title: "Kindle Paperwhite (16 GB)",
    category: "Tech",
    price: "$149.99",
    score: 9.6,
    description: "Водоотпорен е-читач со екран без отсјај.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80",
    query: "Kindle Paperwhite",
  },
  {
    id: "6",
    title: "Ergonomic Desk Chair",
    category: "Workspace",
    price: "$249.00",
    score: 9.2,
    description: "Максимална поддршка за грбот за долги часови работа.",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500&q=80",
    query: "Ergonomic Desk Chair",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const STORE_ID = "tonistojanov2-20";

  // Автоматско генерирање на Amazon Affiliate URL за кој било производ
  const createAmazonUrl = (query: string) => {
    return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${STORE_ID}`;
  };

  const categories = ["All", "Tech", "Kitchen", "Workspace"];

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-indigo-600">SmartPick</span>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-semibold">AI Engine</span>
          </div>
          <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            Store ID: <strong className="text-slate-800">{STORE_ID}</strong>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          Паметни препораки за производи во живо
        </h1>
        <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
          Пребарај било кој производ — системот автоматски генерира директни Amazon препораки со твојата партнерска заштита.
        </p>

        {/* Dynamic Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <input
            type="text"
            placeholder="Напиши било кој производ (на пр. Laptop, Smartwatch, Blender)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-96 px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {searchTerm && (
            <a
              href={createAmazonUrl(searchTerm)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition text-center shadow"
            >
              Барај &quot;{searchTerm}&quot; на Amazon →
            </a>
          )}
        </div>

        {/* Categories */}
        <div className="flex justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200">
                    {product.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xl font-bold text-slate-900">{product.price}</span>
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                      Score: {product.score}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{product.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{product.description}</p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-0">
                <a
                  href={createAmazonUrl(product.query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-lg transition shadow-sm"
                >
                  Купи на Amazon (Affiliate)
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 mt-16 text-center text-xs text-slate-500 border-t border-slate-200 pt-8">
        <p className="mb-2">
          SmartPick AI е учесник во Amazon Services LLC Associates Program. Сите купувања одат директно преку Amazon со заштитен Affiliate ID ({STORE_ID}).
        </p>
        <p>© 2026 SmartPick AI. Сите права се задржани.</p>
      </footer>
    </main>
  );
}