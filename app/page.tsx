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
  is_sponsored?: boolean;
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
      text: "Hi! Tell me what you're shopping for (e.g. 'quiet earbuds' or 'something for my desk under $50') and I'll suggest a few picks.",
    },
  ]);

  const stores = ['All', 'Amazon', 'AliExpress', 'Temu', 'Alibaba'];

  // ✅ ТУКА Е ПРОМЕНАТА: 40+ КАТЕГОРИИ
  const categories = [
    'All',
    'Electronics',
    'Home Appliances',
    'Computer & Office',
    'Home & Garden',
    'Sports & Entertainment',
    'Toys & Hobbies',
    'Beauty & Health',
    'Jewelry & Accessories',
    'Phones & Telecommunications',
    'Consumer Electronics',
    'Lights & Lighting',
    'Watches',
    "Men's Clothing",
    "Women's Clothing",
    'Shoes',
    'Bags & Luggage',
    'Mother & Kids',
    'Automobiles & Motorcycles',
    'Tools & Home Improvement',
    'Furniture',
    'Kitchen & Dining',
    'Bedding & Bath',
    'Home Decor',
    'Pet Supplies',
    'Office & School Supplies',
    'Security & Protection',
    'Garden Supplies',
    'Musical Instruments',
    'Video Games',
    'Camera & Photo',
    'Smart Devices',
    'Audio & Video',
    'Gaming Accessories',
    'Fitness Equipment',
    'Outdoor & Camping',
    'Travel & Luggage',
    'Personal Care',
    'Hair Care',
    'Makeup',
    'Skin Care',
    'Health Care',
    'Baby Products',
  ];

  // Fetch products from Supabase API automatically
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
      replyText = "I couldn't find a close match for that in our current catalog. Try mentioning a product type, category, or a price limit.";
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
      <header className="w-full border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-600 text-white font-bold p-2 rounded-lg">S</span>
          <h1 className="text-xl font-bold tracking-tight">SmartPick Pro</h1>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <input
            type="text"
            aria-label="Search products"
            placeholder="Search premium products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleAiShopper}
            aria-expanded={isChatOpen}
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
      </header>

      {/* HERO */}
      <section className="w-full max-w-7xl px-6 py-16 text-center">
        <div className="inline-block bg-indigo-950/80 border border-indigo-800 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-4">
           ULTIMATE PRICE TRACKING & DEAL FINDER
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Never Overpay Again. Track Prices & Save Big.
        </h2>

        <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
          Discover top-rated tech, lifestyle, and home essentials from AliExpress, Alibaba, Temu, and Amazon. Real-time market monitoring delivers instant notifications straight to your inbox the moment prices drop.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-300 font-medium mb-12">
          <span>✓ Verified Best Deals</span>
          <span>✓ Instant Price Alerts</span>
          <span>✓ Secure & Free to Use</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl inline-flex items-center gap-3 text-sm">
          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-slate-400">SYSTEM STATUS:</span>
          <span className="font-semibold text-white">Live Tracking</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Monitoring 40+ Categories</span>
        </div>
      </section>

      {/* STORE TABS */}
      <section className="w-full max-w-7xl px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {stores.map((store) => {
            const isActive = store === selectedStore;
            return (
              <button
                key={store}
                type="button"
                onClick={() => setSelectedStore(store)}
                aria-pressed={isActive}
                className={`px-6 py-3 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border-2 ${
                  isActive
                    ? 'bg-fuchsia-600 border-fuchsia-500 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {store}
              </button>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="w-full max-w-7xl px-6 mb-12">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {categories.map((cat) => {
            const isActive = cat === selectedCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={isActive}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="w-full max-w-7xl px-6 mb-20">
        {loading ? (
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-2">Loading products...</h3>
            <p className="text-slate-400">Fetching from database.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-slate-400">Try another search term, category, or store.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    {/* Store Badge */}
                    <div className="text-xs font-bold text-fuchsia-400 bg-fuchsia-950/50 px-2 py-1 rounded">
                      {product.store}
                    </div>
                    
                    {/* Tag Badge */}
                    {product.tag && (
                      <div className="text-xs font-bold text-indigo-400 bg-indigo-950/50 px-2 py-1 rounded">
                        {product.tag}
                      </div>
                    )}

                    {/* Custom Badge (if exists) */}
                    {product.badge && (
                      <div className="text-xs font-bold text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded">
                        {product.badge}
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{product.description}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                  <span className="text-2xl font-black text-white">
                    ${product.price.toFixed(2)}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleBuyNow(product.affiliate_url)}
                      className="bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Buy Now
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetAlert(product.title)}
                      className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                    >
                      🔔 Alert
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* WEEKLY DEALS EMAIL SIGNUP */}
      <section className="w-full max-w-3xl px-6 mb-20">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl text-center">
          <div className="text-3xl mb-3">📩</div>
          <h3 className="text-2xl font-bold mb-2">
            Get Weekly Top Deals Directly in Your Inbox
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Never miss out on steep price drops, exclusive tech finds, and hand-picked product specials. No spam, ever.
          </p>

          <form onSubmit={handleJoinFree} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500 text-white flex-1 max-w-md"
            />
            <button
              type="submit"
              className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
            >
              Join Free
            </button>
          </form>

          <p className="text-xs text-slate-500 mt-4">
            Free weekly deals. No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>© 2026 SmartPick Pro. All rights reserved.</p>
      </footer>

      {/* AI SHOPPER CHAT PANEL */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 max-h-[70vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <h3 className="font-bold text-sm">AI Shopper</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              aria-label="Close AI Shopper"
              className="text-slate-400 hover:text-white text-sm px-2"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line px-3 py-2 rounded-xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
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
              aria-label="AI Shopper message"
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </main>
  );
}