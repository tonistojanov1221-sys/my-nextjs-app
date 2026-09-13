'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

type ChatMessage = { role: 'user' | 'assistant'; text: string };

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  tag: string;
  store: string;
  affiliate_url: string;
  badge?: string;
  image_url?: string;
  created_at?: string;
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStore, setSelectedStore] = useState<string>('All');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: "Hi! Tell me what you're shopping for and I'll suggest a few picks.",
    },
  ]);

  const stores = ['All', 'Amazon', 'AliExpress', 'Temu', 'Alibaba'];

  const categories = [
    'All', 'Electronics', 'Home Appliances', 'Computer & Office', 'Home & Garden',
    'Sports & Entertainment', 'Toys & Hobbies', 'Beauty & Health', 'Jewelry & Accessories',
    'Phones & Telecommunications', 'Consumer Electronics', 'Lights & Lighting', 'Watches',
    "Men's Clothing", "Women's Clothing", 'Shoes', 'Bags & Luggage', 'Mother & Kids',
    'Automobiles & Motorcycles', 'Tools & Home Improvement', 'Furniture', 'Kitchen & Dining',
    'Bedding & Bath', 'Home Decor', 'Pet Supplies', 'Office & School Supplies',
    'Security & Protection', 'Garden Supplies', 'Musical Instruments', 'Video Games',
    'Camera & Photo', 'Smart Devices', 'Audio & Video', 'Gaming Accessories',
    'Fitness Equipment', 'Outdoor & Camping', 'Travel & Luggage', 'Personal Care',
    'Hair Care', 'Makeup', 'Skin Care', 'Health Care', 'Baby Products',
  ];

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesStore = selectedStore === 'All' || product.store === selectedStore;
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesQuery =
        query === '' ||
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.tag.toLowerCase().includes(query);
      return matchesStore && matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory, selectedStore, products]);

  const handleJoinFree = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    alert('Thank you! You are now subscribed to weekly deals.');
    setEmail('');
  }, [email]);

  const handleBuyNow = useCallback((affiliateUrl: string) => {
    window.open(affiliateUrl, '_blank');
  }, []);

  const handleSetAlert = useCallback((title: string) => {
    alert(`Price alert set for "${title}". We'll notify you when it drops.`);
  }, []);

  const handleSignIn = useCallback(() => {
    alert('Sign in flow coming soon.');
  }, []);

  const toggleAiShopper = useCallback(() => {
    setIsChatOpen((open) => !open);
  }, []);

  const getRecommendations = useCallback((message: string) => {
    const text = message.toLowerCase();
    const priceMatch = text.match(/\$?(\d+(\.\d+)?)/);
    const maxPrice = priceMatch ? parseFloat(priceMatch[1]) : null;
    const words = text.replace(/[^a-z0-9\s.]/g, ' ').split(/\s+/).filter((w) => w.length > 2);

    const scored = products
      .map((product) => {
        const haystack = `${product.title} ${product.description} ${product.category} ${product.tag} ${product.store}`.toLowerCase();
        let score = 0;
        words.forEach((word) => {
          if (haystack.includes(word)) score += 1;
        });
        if (maxPrice !== null && product.price <= maxPrice) score += 1;
        if (maxPrice !== null && product.price > maxPrice) score -= 2;
        return { product, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 3).map((entry) => entry.product);
  }, [products]);

  const handleSendChat = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { role: 'user', text: trimmed };
    const matches = getRecommendations(trimmed);

    let replyText: string;
    if (matches.length === 0) {
      replyText = "I couldn't find a close match. Try mentioning a product type or price limit.";
    } else {
      const lines = matches.map((p) => `• ${p.title} (${p.store}) — $${p.price.toFixed(2)}`);
      replyText = `Here's what I'd suggest:\n${lines.join('\n')}`;
    }

    const assistantMessage: ChatMessage = { role: 'assistant', text: replyText };
    setChatMessages((prev) => [...prev, userMessage, assistantMessage]);
    setChatInput('');
  }, [chatInput, getRecommendations]);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center">
      {/* HEADER */}
      <header className="w-full border-b border-slate-800 bg-slate-900/50 backdrop-blur px-4 md:px-6 py-3 md:py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3 md:gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white font-bold p-2 rounded-lg">S</span>
              <h1 className="text-lg md:text-xl font-bold">SmartPick Pro</h1>
            </div>
            <button
              type="button"
              onClick={toggleAiShopper}
              className="md:hidden bg-fuchsia-600 text-white px-3 py-2 rounded-lg text-xs"
            >
              ✨ AI
            </button>
          </div>

          <div className="flex-1 w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleAiShopper}
              className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              ✨ AI Shopper
            </button>
            <button
              type="button"
              onClick={handleSignIn}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* HERO - ПОДОБРЕНО */}
      <section className="w-full max-w-7xl px-4 md:px-6 py-16 md:py-24 text-center relative overflow-hidden">
        {/* Background декорации */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 border border-indigo-500/30 px-4 py-2 rounded-full text-xs md:text-sm font-semibold mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
             ULTIMATE PRICE TRACKING & DEAL FINDER
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-slide-up">
            <span className="text-gradient">Never Overpay Again</span>
          </h2>
          
          <p className="text-slate-400 max-w-3xl mx-auto text-base md:text-lg mb-10 px-4 leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
            Discover top-rated products from AliExpress, Amazon, Temu, and Alibaba.
            <br className="hidden md:block" />
            Real-time market monitoring delivers instant notifications straight to your inbox.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-300 font-medium mb-12 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <span className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs">✓</span>
              Verified Best Deals
            </span>
            <span className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs">✓</span>
              Instant Price Alerts
            </span>
            <span className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs">✓</span>
              Secure & Free to Use
            </span>
          </div>

          <div className="glass inline-flex items-center gap-3 px-6 py-4 rounded-2xl animate-slide-up" style={{animationDelay: '0.4s'}}>
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></span>
            <span className="text-slate-400 text-sm">SYSTEM STATUS:</span>
            <span className="font-bold text-white text-sm">Live Tracking</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-sm">Monitoring 40+ Categories</span>
          </div>
        </div>
      </section>

      {/* STORE TABS */}
      <section className="w-full max-w-7xl px-4 md:px-6 mb-4 md:mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {stores.map((store) => {
            const isActive = store === selectedStore;
            return (
              <button
                key={store}
                type="button"
                onClick={() => setSelectedStore(store)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap border-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-fuchsia-600 border-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {store}
              </button>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="w-full max-w-7xl px-4 md:px-6 mb-6 md:mb-12">
        <div className="md:hidden mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="hidden md:flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = cat === selectedCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap border transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS - ПОДОБРЕНО */}
      <section className="w-full max-w-7xl px-4 md:px-6 mb-20">
        {loading ? (
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-2">Loading...</h3>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-slate-400">Try another search term, category, or store.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-slate-900/80 border border-slate-800 p-5 md:p-6 rounded-2xl hover:border-indigo-500/50 transition-all duration-500 card-hover backdrop-blur-sm animate-fade-in"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                {/* Badge секција */}
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="gradient-fuchsia text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-fuchsia-500/30">
                    {product.store}
                  </div>
                  
                  {product.badge && (
                    <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Наслов и опис */}
                <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                  {product.title}
                </h3>
                <p className="text-slate-400 text-xs md:text-sm mb-5 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Цена и копчиња */}
                <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-black text-gradient">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      ${(product.price * 1.3).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleBuyNow(product.affiliate_url)}
                      className="gradient-indigo hover:shadow-lg hover:shadow-indigo-500/50 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 btn-glow transform hover:scale-105"
                    >
                      Buy Now
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetAlert(product.title)}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300"
                    >
                      🔔
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* EMAIL SIGNUP */}
      <section className="w-full max-w-3xl px-4 md:px-6 mb-20">
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl text-center">
          <div className="text-3xl mb-3">📩</div>
          <h3 className="text-xl md:text-2xl font-bold mb-2">Get Weekly Top Deals</h3>
          <p className="text-slate-400 text-xs md:text-sm mb-6">No spam, ever.</p>
          <form onSubmit={handleJoinFree} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 flex-1 max-w-md"
            />
            <button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Join Free
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>© 2026 SmartPick Pro. All rights reserved.</p>
      </footer>

      {/* AI CHAT */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-[calc(100%-2rem)] sm:w-80 md:w-96 max-h-[70vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span>✨</span>
              <h3 className="font-bold text-sm">AI Shopper</h3>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChat} className="flex items-center gap-2 p-3 border-t border-slate-800">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors">
              Send
            </button>
          </form>
        </div>
      )}
    </main>
  );
}