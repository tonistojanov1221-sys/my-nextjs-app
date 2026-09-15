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
    'All',
    'Amazon',
    'AliExpress',
    'Temu',
    'Alibaba',
    'Banggood',
    'CJ Affiliate',
    'Awin',
  ];

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
      const matchesStore =
        selectedStore === 'All' || product.store === selectedStore;
      const matchesCategory =
        selectedCategory === 'All' ||
        product.category === selectedCategory;
      const matchesQuery =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.tag.toLowerCase().includes(query);
      return matchesStore && matchesCategory && matchesQuery;
    });
  }, [products, searchQuery, selectedCategory, selectedStore]);

  const handleSubscribe = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!email.trim()) return;
      alert('Thank you! You are now subscribed to SmartPick Pro deals.');
      setEmail('');
    },
    [email]
  );

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

  const getRecommendations = useCallback(
    (message: string) => {
      const text = message.toLowerCase();
      const priceMatch = text.match(/\$?(\d+(\.\d+)?)/);
      const maxPrice = priceMatch ? parseFloat(priceMatch[1]) : null;
      const words = text
        .replace(/[^a-z0-9\s.]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 2);
      return products
        .map((product) => {
          const haystack =
            `${product.title} ${product.description} ${product.category} ${product.tag} ${product.store}`.toLowerCase();
          let score = 0;
          words.forEach((word) => {
            if (haystack.includes(word)) score++;
          });
          if (maxPrice !== null && product.price <= maxPrice) {
            score++;
          }
          if (maxPrice !== null && product.price > maxPrice) {
            score -= 2;
          }
          return { product, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((item) => item.product);
    },
    [products]
  );

  const handleSendChat = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const text = chatInput.trim();
      if (!text) return;
      const matches = getRecommendations(text);
      const userMessage: ChatMessage = { role: 'user', text };
      let reply = '';
      if (matches.length === 0) {
        reply =
          "I couldn't find a close match. Try telling me the product type or your budget.";
      } else {
        reply =
          "Here are my recommendations:\n\n" +
          matches
            .map(
              (product) =>
                `• ${product.title} — $${product.price.toFixed(2)} (${product.store})`
            )
            .join('\n');
      }
      setChatMessages((prev) => [
        ...prev,
        userMessage,
        { role: 'assistant', text: reply },
      ]);
      setChatInput('');
    },
    [chatInput, getRecommendations]
  );

  const scrollStores = (direction: 'left' | 'right') => {
    const element = document.getElementById('stores-scroll');
    element?.scrollBy({
      left: direction === 'left' ? -350 : 350,
      behavior: 'smooth',
    });
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    const element = document.getElementById('categories-scroll');
    element?.scrollBy({
      left: direction === 'left' ? -350 : 350,
      behavior: 'smooth',
    });
  };

  const storeLogoUrl = (store: string) => {
    const domains: Record<string, string> = {
      Amazon: 'amazon.com',
      AliExpress: 'aliexpress.com',
      Temu: 'temu.com',
      Alibaba: 'alibaba.com',
      Banggood: 'banggood.com',
      'CJ Affiliate': 'cj.com',
      Awin: 'awin.com',
    };
    const domain = domains[store];
    return domain ? `https://logo.clearbit.com/${domain}` : null;
  };

  const categoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      All: '▦',
      Electronics: '◈',
      'Home Appliances': '⌂',
      'Computer & Office': '⌨',
      'Home & Garden': '⌂',
      'Sports & Entertainment': '⚽',
      'Toys & Hobbies': '♟',
      'Beauty & Health': '✦',
      'Jewelry & Accessories': '◇',
      'Phones & Telecommunications': '☎',
      'Consumer Electronics': '◉',
      'Lights & Lighting': '☼',
      Watches: '◷',
      "Men's Clothing": '♙',
      "Women's Clothing": '♕',
      Shoes: '◈',
      'Bags & Luggage': '▢',
      'Mother & Kids': '♧',
      'Automobiles & Motorcycles': '⚙',
      'Tools & Home Improvement': '⚒',
      Furniture: '▤',
      'Kitchen & Dining': '♨',
      'Bedding & Bath': '▱',
      'Home Decor': '✧',
      'Pet Supplies': '●',
      'Office & School Supplies': '▤',
      'Security & Protection': '⬟',
      'Garden Supplies': '❀',
      'Musical Instruments': '♫',
      'Video Games': '▰',
      'Camera & Photo': '◎',
      'Smart Devices': '◉',
      'Audio & Video': '▶',
      'Gaming Accessories': '⌘',
      'Fitness Equipment': '♧',
      'Outdoor & Camping': '△',
      'Travel & Luggage': '✈',
      'Personal Care': '✦',
      'Hair Care': '✦',
      Makeup: '✦',
      'Skin Care': '✦',
      'Health Care': '♥',
      'Baby Products': '●',
    };
    return icons[category] || '•';
  };

  return (
    <main className="min-h-screen bg-[#020817] text-white overflow-x-hidden">
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-indigo-700/20 blur-[150px]" />
        <div className="absolute top-[400px] -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-700/10 blur-[150px]" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020817]/90 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 h-[72px] flex items-center gap-5">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-fuchsia-600 flex items-center justify-center text-xl shadow-lg">
              🛍️
            </div>
            <h1 className="text-xl font-black">
              SmartPick <span className="bg-gradient-to-r from-blue-400 to-fuchsia-400 bg-clip-text text-transparent">Pro</span>
            </h1>
          </div>

          <div className="hidden md:block flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium products..."
                className="w-full h-11 rounded-full bg-slate-900 border border-slate-700 px-5 pr-12 text-sm outline-none focus:border-indigo-500"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                ⌕
              </span>
            </div>
          </div>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-600 text-sm font-bold shadow-lg"
            >
              ✨ AI Shopper
            </button>
            <button
              onClick={handleSignIn}
              className="hidden sm:block px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold"
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="md:hidden px-4 pb-3">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none"
          />
        </div>
      </header>

      <div className="relative z-10">
        {/* HERO */}
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
                ULTIMATE{' '}
                <span className="bg-gradient-to-r from-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                  PRICE TRACKING
                </span>{' '}
                &{' '}
                <span className="bg-gradient-to-r from-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                  DEAL FINDER
                </span>
              </h2>
              <p className="mt-7 text-xl text-slate-300 font-semibold">
                Never Overpay Again. Track Prices & Save Big.
              </p>
              <div className="flex flex-wrap gap-6 mt-8 text-sm text-slate-300">
                <span>⚡ Real-time Deals</span>
                <span>🛡️ Trusted Stores</span>
                <span>🌍 Global Shipping</span>
                <span>🤖 AI-Powered</span>
              </div>
            </div>

            {/* HERO CARD */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-full max-w-[570px]">
                <div className="absolute inset-10 rounded-full bg-blue-600/20 blur-[90px]" />
                <div className="relative rounded-3xl border border-blue-500/30 bg-slate-900 p-7 rotate-[-3deg] shadow-2xl">
                  <div className="flex gap-2 mb-5">
                    <span className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                  </div>
                  <div className="rounded-2xl bg-slate-800 p-6">
                    <div className="flex justify-between mb-5">
                      <span className="text-slate-400">Best Deal</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                        Save 42%
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="w-28 h-28 rounded-2xl bg-slate-700 flex items-center justify-center text-6xl">
                        🎧
                      </div>
                      <div>
                        <h3 className="text-xl font-black">Premium Headphones</h3>
                        <p className="line-through text-slate-500 mt-2">$149.99</p>
                        <p className="text-4xl font-black">$89.99</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STORE BAR */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollStores('left')}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition shrink-0"
              aria-label="Scroll stores left"
            >
              ←
            </button>
            <div
              id="stores-scroll"
              className="flex gap-3 overflow-x-auto py-2 flex-1 min-w-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {stores.map((store) => (
                <button
                  key={store}
                  onClick={() => setSelectedStore(store)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition shrink-0 ${
                    selectedStore === store
                      ? 'bg-gradient-to-r from-blue-600 to-fuchsia-600 border-transparent shadow-lg text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {storeLogoUrl(store) ? (
                      <img
                        src={storeLogoUrl(store) as string}
                        alt={store}
                        className="w-full h-full object-contain p-0.5"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-slate-900 text-xs font-bold">SP</span>
                    )}
                  </span>
                  <span className="font-bold text-sm">
                    {store === 'All' ? 'All Stores' : store}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollStores('right')}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition shrink-0"
              aria-label="Scroll stores right"
            >
              →
            </button>
          </div>
        </section>

        {/* CATEGORY BAR */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black">
              <span className="text-blue-400">▦</span> Shop by Category
            </h2>
            <span className="text-sm text-slate-400">
              {categories.length} Categories
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollCategories('left')}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition shrink-0"
              aria-label="Scroll categories left"
            >
              ←
            </button>
            
            <div
              id="categories-scroll"
              className="flex-1 min-w-0 overflow-x-auto py-2"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div className="flex gap-3" style={{ width: 'max-content' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition text-sm whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                    style={{ flexShrink: 0 }}
                  >
                    <span>{categoryIcon(cat)}</span>
                    <span className="font-semibold">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => scrollCategories('right')}
              className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition shrink-0"
              aria-label="Scroll categories right"
            >
              →
            </button>
          </div>
        </section>

        {/* PRODUCTS GRID */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 pb-20">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black">
              {selectedStore === 'All' ? 'All Stores' : selectedStore} Deals{' '}
              <span className="text-slate-500 text-base font-normal">
                ({filteredProducts.length} items)
              </span>
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading products from Supabase...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
              <p className="text-xl font-bold text-slate-300">No products found</p>
              <p className="text-slate-500 mt-2">Try changing your search or selected store/category filters.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition group"
                >
                  <div>
                    <div className="relative h-48 rounded-2xl bg-slate-800 mb-5 flex items-center justify-center overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <span className="text-5xl">📦</span>
                      )}
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-fuchsia-600 text-xs font-bold shadow-lg">
                          {product.badge}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-bold text-slate-300">
                        {product.store}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h4 className="text-lg font-bold mt-1 line-clamp-2">
                      {product.title}
                    </h4>
                    <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">Price</span>
                      <span className="text-2xl font-black">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSetAlert(product.title)}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Set Price Alert"
                      >
                        🔔
                      </button>
                      <button
                        onClick={() => handleBuyNow(product.affiliate_url)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 font-bold text-sm shadow-lg hover:opacity-95 transition"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* AI SHOPPER MODAL */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 flex flex-col h-[600px] shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-fuchsia-600 flex items-center justify-center text-sm">
                  ✨
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Shopper Assistant</h3>
                  <p className="text-xs text-slate-400">Ask me for recommendations</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendChat}
              className="p-4 border-t border-slate-800 bg-slate-950 flex gap-3"
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="e.g. Find headphones under $100..."
                className="flex-1 h-11 rounded-xl bg-slate-900 border border-slate-800 px-4 text-sm outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-5 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 font-bold text-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CSS FOR HIDING SCROLLBARS */}
      <style jsx global>{`
        #stores-scroll::-webkit-scrollbar,
        #categories-scroll::-webkit-scrollbar {
          display: none;
        }
        #stores-scroll,
        #categories-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </main>
  );
}