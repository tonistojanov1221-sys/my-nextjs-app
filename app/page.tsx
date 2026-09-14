'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
};

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

const StoreLogo = ({ name }: { name: string }) => {
  switch (name) {
    case 'Amazon':
      return (
        <svg className="h-6 w-auto" viewBox="0 0 500 150" fill="none">
          <path d="M309.2 116.3c-23.7 17.5-58.1 26.8-88 26.8-41.9 0-79.6-15.5-108.1-41.4-2.2-2-0.2-4.7 2.4-3.2 30.7 17.7 68.8 28.3 108 28.3 26.6 0 55.9-6.3 82.2-19.4 4-2 7.7 3.3 3.5 8.9z" fill="#FF9900"/>
          <path d="M320.8 103.8c-2.8-3.6-18.4-1.7-25.2-0.9-2.1 0.2-2.4-1.6-0.5-2.9 12.3-8.6 32.5-6.1 34.9-3.2 2.4 2.9-0.7 23.3-12.3 32.8-1.8 1.5-3.5 0.7-2.7-1.3 2.6-6.8 8.6-20.9 5.8-24.5z" fill="#FF9900"/>
          <path d="M108.4 68.3c0-8 6.5-14.5 14.5-14.5s14.5 6.5 14.5 14.5v28.8h17.2V68.3c0-17.5-14.2-31.7-31.7-31.7s-31.7 14.2-31.7 31.7v28.8h17.2V68.3z" fill="#FFFFFF"/>
          <text x="10" y="95" fill="#FFFFFF" fontSize="70" fontWeight="bold" fontFamily="sans-serif">amazon</text>
        </svg>
      );
    case 'AliExpress':
      return (
        <span className="font-black text-red-500 text-lg tracking-tight flex items-center gap-1">
          <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded font-black">Ali</span>
          <span className="text-red-500 font-extrabold italic">Express</span>
        </span>
      );
    case 'Temu':
      return (
        <div className="flex items-center gap-1.5">
          <span className="bg-orange-500 text-white font-black text-xs px-1.5 py-1 rounded-md">TEMU</span>
        </div>
      );
    case 'Alibaba':
      return (
        <span className="font-black text-orange-500 text-base tracking-tight italic flex items-center gap-1">
          <span className="text-xl font-extrabold">e</span>Alibaba.com
        </span>
      );
    case 'Banggood':
      return (
        <span className="font-black text-blue-400 text-base tracking-tight">
          Bang<span className="text-orange-500">good</span>
        </span>
      );
    case 'CJ Affiliate':
      return (
        <span className="font-black text-emerald-400 text-base tracking-tight flex items-center gap-1">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-black text-xs flex items-center justify-center font-bold">CJ</span>
          Affiliate
        </span>
      );
    case 'Awin':
      return (
        <span className="font-black text-pink-500 text-base tracking-tight flex items-center gap-1">
          <span className="text-pink-500 font-black text-lg">AWIN</span>
        </span>
      );
    default:
      return <span className="font-bold text-slate-200">{name}</span>;
  }
};

export default function Home() {
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStore, setSelectedStore] = useState('All');
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

  const stores = [
    'All', 'Amazon', 'AliExpress', 'Temu', 'Alibaba', 'Banggood', 'CJ Affiliate', 'Awin'
  ];

  const categories = [
    { name: 'All', icon: '▦' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Computers & Accessories', icon: '🖥️' },
    { name: 'Cell Phones', icon: '📱' },
    { name: 'Clothing', icon: '👕' },
    { name: 'Beauty', icon: '💅' },
    { name: 'Home & Kitchen', icon: '🏠' },
    { name: 'Tools', icon: '🔧' },
    { name: 'Automotive', icon: '🚗' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Toys', icon: '🧸' },
    { name: 'Baby', icon: '👶' },
    { name: 'Pet', icon: '🐾' },
    { name: 'Health', icon: '🩺' },
    { name: 'Groceries', icon: '🛒' },
    { name: 'Music', icon: '🎵' },
    { name: 'Video Games', icon: '🎮' },
  ];

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Products error:', error);
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesStore = selectedStore === 'All' || product.store === selectedStore;
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesQuery = !query || 
        product.title.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query) || 
        product.tag.toLowerCase().includes(query);
      return matchesStore && matchesCategory && matchesQuery;
    });
  }, [products, searchQuery, selectedCategory, selectedStore]);

  const handleSubscribe = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    alert('Thank you! You are now subscribed to SmartPick Pro deals.');
    setEmail('');
  }, [email]);

  const handleBuyNow = useCallback((url: string) => {
    if (!url) {
      alert('Affiliate link is not available yet.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleSetAlert = useCallback((title: string) => {
    alert(`Price alert set for "${title}".`);
  }, []);

  const handleSignIn = useCallback(() => {
    alert('Sign in is coming soon.');
  }, []);

  const getRecommendations = useCallback((message: string) => {
    const text = message.toLowerCase();
    const priceMatch = text.match(/\$?(\d+(\.\d+)?)/);
    const maxPrice = priceMatch ? parseFloat(priceMatch[1]) : null;
    const words = text.replace(/[^a-z0-9\s.]/g, ' ').split(/\s+/).filter((word) => word.length > 2);

    return products
      .map((product) => {
        const haystack = `${product.title} ${product.description} ${product.category} ${product.tag} ${product.store}`.toLowerCase();
        let score = 0;
        words.forEach((word) => {
          if (haystack.includes(word)) score++;
        });
        if (maxPrice !== null && product.price <= maxPrice) score++;
        if (maxPrice !== null && product.price > maxPrice) score -= 2;
        return { product, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.product);
  }, [products]);

  const handleSendChat = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    const matches = getRecommendations(text);
    const userMessage: ChatMessage = { role: 'user', text };
    let reply = '';
    if (matches.length === 0) {
      reply = "I couldn't find a close match. Try telling me the product type or your budget.";
    } else {
      reply = 'Here are my recommendations:\n\n' + matches.map((product) => `• ${product.title} — $${product.price.toFixed(2)} (${product.store})`).join('\n');
    }
    setChatMessages((prev) => [...prev, userMessage, { role: 'assistant', text: reply }]);
    setChatInput('');
  }, [chatInput, getRecommendations]);

  const scrollStores = (direction: 'left' | 'right') => {
    const element = document.getElementById('stores-scroll');
    element?.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    const element = document.getElementById('categories-scroll');
    element?.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#020817] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-indigo-700/20 blur-[150px]" />
        <div className="absolute top-[400px] -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-700/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020817]/90 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 h-[72px] flex items-center gap-5">
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => { setSelectedStore('All'); setSelectedCategory('All'); }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-fuchsia-600 flex items-center justify-center text-xl shadow-lg">🛍️</div>
            <h1 className="text-xl font-black">SmartPick <span className="gradient-text">Pro</span></h1>
          </div>
          <div className="hidden md:block flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search premium products..." className="w-full h-11 rounded-full bg-slate-900 border border-slate-700 px-5 pr-12 text-sm outline-none focus:border-indigo-500 transition-all" />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={() => setIsChatOpen(true)} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-600 text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">✨ AI Shopper</button>
            <button onClick={handleSignIn} className="hidden sm:block px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold hover:bg-slate-800 transition-all">Sign In</button>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 pt-12 md:pt-16 pb-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-indigo-500/40 bg-indigo-950/40 text-sm mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold">Live Tracking</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">Monitoring 40+ Categories</span>
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95]">
                ULTIMATE <span className="gradient-text">PRICE TRACKING</span> &amp; <span className="gradient-text">DEAL FINDER</span>
              </h2>
              <p className="mt-7 text-xl text-slate-300 font-semibold">Never Overpay Again. Track Prices &amp; Save Big.</p>
              <div className="flex flex-wrap gap-6 mt-8 text-sm text-slate-300">
                <span className="flex items-center gap-2"><span className="text-yellow-400">⚡</span> Real-time Deals</span>
                <span className="flex items-center gap-2"><span className="text-red-400">🛡️</span> Trusted Stores</span>
                <span className="flex items-center gap-2"><span className="text-blue-400">🌐</span> Global Shipping</span>
                <span className="flex items-center gap-2"><span className="text-purple-400">✦</span> AI-Powered</span>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="relative w-full max-w-[620px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-indigo-900/30 rounded-3xl blur-3xl" />
                <div className="relative rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl overflow-hidden">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl border-4 border-slate-900">
                        <div className="text-5xl">🤖</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-16 rounded-2xl bg-slate-800 p-6 border border-slate-700">
                    <div className="flex items-center gap-6">
                      <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-7xl shadow-inner">🎧</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400 text-sm">Best Deal</span>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">Save 42%</span>
                        </div>
                        <h3 className="text-2xl font-black text-white">Premium Headphones</h3>
                        <p className="line-through text-slate-500 mt-1">$149.99</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-500">$89.99</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-4 -right-4 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-fuchsia-600 shadow-2xl z-10">
                    <p className="font-black text-sm text-white">Better Deals</p>
                    <p className="font-black text-sm text-white">Smarter Shopping</p>
                    <p className="text-blue-100 text-xs">With AI ✨</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TOP STORES SECTION */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 mb-8">
          <div className="store-wrapper">
            <button type="button" onClick={() => scrollStores('left')} className="scroll-arrow" aria-label="Scroll stores left">←</button>
            <div id="stores-scroll" className="stores-scroll">
              <div className="stores-inner">
                {stores.map((store) => (
                  <button 
                    key={store} 
                    type="button" 
                    onClick={() => setSelectedStore(store)} 
                    className={`store-button ${selectedStore === store ? 'store-active' : ''}`}
                  >
                    {store === 'All' ? (
                      <span className="flex items-center gap-2">
                        <span>🏪</span>
                        <span>All Stores</span>
                      </span>
                    ) : (
                      <StoreLogo name={store} />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => scrollStores('right')} className="scroll-arrow" aria-label="Scroll stores right">→</button>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 mb-10">
          <div className="newsletter">
            <div className="newsletter-icon">✉</div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-black">Get Weekly Top Deals Directly in Your Inbox</h3>
              <p className="text-slate-400 text-sm mt-1">Never miss price drops, exclusive finds, and hand-picked product specials.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full lg:w-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="flex-1 lg:w-72 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 outline-none focus:border-indigo-500 transition-all" />
              <button type="submit" className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-600 font-bold hover:shadow-lg transition-all">Subscribe</button>
            </form>
          </div>
        </section>

        {/* SHOP BY CATEGORY */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black"><span className="text-blue-400">▦</span> Shop by Category</h2>
            <span className="text-sm text-slate-400">40+ Categories</span>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => scrollCategories('left')} className="scroll-arrow" aria-label="Scroll categories left">←</button>
            <div id="categories-scroll" className="categories-scroll">
              <div className="categories-inner">
                {categories.map((cat) => (
                  <button 
                    key={cat.name} 
                    type="button" 
                    onClick={() => setSelectedCategory(cat.name)} 
                    className={`category-button ${selectedCategory === cat.name ? 'category-active' : ''}`}
                  >
                    <span className="category-icon">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => scrollCategories('right')} className="scroll-arrow" aria-label="Scroll categories right">→</button>
          </div>
        </section>

        {/* FEATURED DEALS */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-black">🔥 Featured Deals</h2>
            <span className="text-blue-400 text-sm font-bold">{filteredProducts.length} Products</span>
          </div>
          {loading ? (
            <div className="empty-box"><div className="text-4xl animate-pulse">⚡</div><p className="mt-3 font-bold">Loading deals...</p></div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-box"><div className="text-4xl">🔎</div><p className="mt-3 text-xl font-bold">No products found</p><p className="text-slate-400 mt-2">Try another category, store or search.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <article key={product.id} className="product-card">
                  <div className="product-image">
                    {product.image_url ? (<img src={product.image_url} alt={product.title} className="w-full h-full object-contain" />) : (<span className="text-6xl">🛍️</span>)}
                    <span className="product-store">{product.store}</span>
                    {product.badge && (<span className="product-badge">{product.badge}</span>)}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-500 mb-2">{product.category}</p>
                    <h3 className="font-black text-lg line-clamp-2 min-h-[56px]">{product.title}</h3>
                    <p className="text-slate-400 text-sm mt-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-end justify-between mt-5">
                      <div>
                        <div className="text-3xl font-black gradient-text">${product.price.toFixed(2)}</div>
                        <div className="text-xs text-slate-500 line-through">${(product.price * 1.3).toFixed(2)}</div>
                      </div>
                      <span className="deal-badge">DEAL</span>
                    </div>
                    <div className="flex gap-2 mt-5">
                      <button type="button" onClick={() => handleBuyNow(product.affiliate_url)} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 font-bold text-sm hover:shadow-lg transition-all">Buy Now</button>
                      <button type="button" onClick={() => handleSetAlert(product.title)} className="w-12 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all">🔔</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="border-t border-white/10 py-10 bg-slate-950">
          <div className="max-w-[1440px] mx-auto px-5 md:px-8 flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="text-xl font-black">SmartPick <span className="gradient-text">Pro</span></div>
              <p className="text-slate-500 text-sm mt-1">AI-powered global deal discovery.</p>
            </div>
            <p className="text-slate-600 text-sm">© 2026 SmartPick Pro. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {isChatOpen && (
        <div className="fixed bottom-5 right-5 z-[100] w-[calc(100%-2.5rem)] sm:w-[390px] max-h-[70vh] rounded-2xl overflow-hidden border border-indigo-500/40 bg-slate-950 shadow-2xl">
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-950 to-fuchsia-950 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-600 flex items-center justify-center">🤖</div>
              <div><h3 className="font-black">AI Shopper</h3><p className="text-xs text-emerald-400">● Online</p></div>
            </div>
            <button type="button" onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
          </div>
          <div className="max-h-[50vh] overflow-y-auto p-4 space-y-3">
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${message.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800'}`}>{message.text}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 flex gap-2">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="What are you looking for?" className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none" />
            <button type="submit" className="px-4 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-600 font-bold">➤</button>
          </form>
        </div>
      )}

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #020817; }
        .gradient-text { background: linear-gradient(90deg, #38bdf8, #6366f1, #d946ef); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .store-wrapper { width: 100%; padding: 14px; border: 1px solid rgba(59,130,246,.35); background: linear-gradient(90deg, rgba(8,23,47,.95), rgba(10,25,55,.95), rgba(8,23,47,.95)); border-radius: 18px; display: flex; align-items: center; gap: 12px; }
        .stores-scroll { flex: 1; min-width: 0; overflow-x: auto; overflow-y: hidden; padding-bottom: 10px; scroll-behavior: smooth; scrollbar-width: auto; scrollbar-color: #6366f1 #0f172a; }
        .stores-scroll::-webkit-scrollbar { height: 12px; }
        .stores-scroll::-webkit-scrollbar-track { background: #0f172a; border-radius: 999px; border: 1px solid #1e293b; }
        .stores-scroll::-webkit-scrollbar-thumb { background: linear-gradient(90deg, #4f46e5, #a855f7); border-radius: 999px; border: 2px solid #0f172a; }
        .stores-scroll::-webkit-scrollbar-thumb:hover { background: #818cf8; }
        .stores-inner { display: flex; gap: 12px; width: max-content; }
        .store-button { min-width: 140px; height: 56px; padding: 0 20px; border-radius: 13px; border: 1px solid #1e293b; background: #08162d; color: #cbd5e1; display: flex; align-items: center; justify-content: center; white-space: nowrap; font-size: 15px; font-weight: 800; transition: all .25s ease; flex-shrink: 0; cursor: pointer; }
        .store-button:hover { border-color: #6366f1; transform: translateY(-2px); color: white; }
        .store-active { background: linear-gradient(135deg, #2563eb, #4f46e5); border-color: #60a5fa; color: white; box-shadow: 0 0 20px rgba(37,99,235,.4); }
        .scroll-arrow { flex-shrink: 0; width: 42px; height: 42px; border-radius: 50%; border: 1px solid #334155; background: #16243b; color: white; font-size: 19px; font-weight: 900; display: flex; align-items: center; justify-content: center; transition: all .2s ease; cursor: pointer; }
        .scroll-arrow:hover { background: #4f46e5; border-color: #818cf8; transform: scale(1.05); }
        .newsletter { display: flex; align-items: center; gap: 22px; padding: 24px; border: 1px solid rgba(59,130,246,.35); border-radius: 18px; background: linear-gradient(90deg, #091b45, #101a45); }
        .newsletter-icon { width: 56px; height: 56px; border-radius: 16px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #3b82f6, #d946ef); font-size: 24px; }
        .categories-scroll { flex: 1; min-width: 0; overflow-x: auto; overflow-y: hidden; padding-bottom: 10px; scroll-behavior: smooth; scrollbar-width: auto; scrollbar-color: #6366f1 #0f172a; }
        .categories-scroll::-webkit-scrollbar { height: 12px; }
        .categories-scroll::-webkit-scrollbar-track { background: #0f172a; border-radius: 999px; border: 1px solid #1e293b; }
        .categories-scroll::-webkit-scrollbar-thumb { background: linear-gradient(90deg, #4f46e5, #a855f7); border-radius: 999px; border: 3px solid #0f172a; }
        .categories-scroll::-webkit-scrollbar-thumb:hover { background: #818cf8; }
        .categories-inner { display: flex; gap: 12px; width: max-content; }
        .category-button { width: 100px; min-width: 100px; height: 100px; border-radius: 16px; border: 1px solid #1e293b; background: #08162d; color: #94a3b8; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; transition: all .25s ease; flex-shrink: 0; cursor: pointer; }
        .category-button:hover { color: white; border-color: #6366f1; transform: translateY(-2px); }
        .category-active { background: linear-gradient(145deg, #2563eb, #4f46e5); color: white; border-color: #60a5fa; box-shadow: 0 10px 25px rgba(37,99,235,.35); }
        .category-icon { width: 42px; height: 42px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: rgba(37,99,235,.2); color: #60a5fa; font-size: 20px; }
        .category-active .category-icon { color: white; background: rgba(255,255,255,.2); }
        .category-button > span:last-child { font-size: 11px; font-weight: 700; text-align: center; line-height: 1.2; padding: 0 4px; }
        .product-card { overflow: hidden; border-radius: 18px; border: 1px solid #172554; background: linear-gradient(145deg, rgba(15,31,60,.95), rgba(7,18,38,.98)); transition: all .3s ease; }
        .product-card:hover { transform: translateY(-5px); border-color: #6366f1; box-shadow: 0 20px 40px rgba(0,0,0,.35); }
        .product-image { height: 210px; position: relative; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, rgba(59,130,246,.14), transparent 65%); }
        .product-store { position: absolute; top: 12px; left: 12px; padding: 5px 9px; border-radius: 999px; background: #7c3aed; color: white; font-size: 10px; font-weight: 800; }
        .product-badge { position: absolute; top: 12px; right: 12px; padding: 5px 9px; border-radius: 999px; background: rgba(16,185,129,.2); color: #34d399; font-size: 10px; font-weight: 800; }
        .deal-badge { padding: 5px 9px; border-radius: 999px; background: rgba(16,185,129,.15); color: #34d399; font-size: 10px; font-weight: 900; }
        .empty-box { padding: 70px 20px; border-radius: 18px; border: 1px solid #1e293b; background: #08111f; text-align: center; }
        @media (max-width: 900px) { .newsletter { flex-direction: column; align-items: stretch; } }
        @media (max-width: 640px) { .store-wrapper { padding: 10px; } .store-button { min-width: 120px; height: 50px; } .scroll-arrow { width: 36px; height: 36px; } }
      `}</style>
    </main>
  );
}