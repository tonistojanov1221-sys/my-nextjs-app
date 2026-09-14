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
      .catch((err) => {
        console.error('Failed to fetch products:', err);
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
        query === '' ||
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.tag.toLowerCase().includes(query);

      return matchesStore && matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory, selectedStore, products]);

  const handleJoinFree = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email.trim()) return;

      alert('Thank you! You are now subscribed to weekly deals.');
      setEmail('');
    },
    [email]
  );

  const handleBuyNow = useCallback((affiliateUrl: string) => {
    if (!affiliateUrl) {
      alert('Affiliate link is not available yet.');
      return;
    }

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

  const getRecommendations = useCallback(
    (message: string) => {
      const text = message.toLowerCase();

      const priceMatch = text.match(/\$?(\d+(\.\d+)?)/);
      const maxPrice = priceMatch ? parseFloat(priceMatch[1]) : null;

      const words = text
        .replace(/[^a-z0-9\s.]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 2);

      const scored = products
        .map((product) => {
          const haystack = `
            ${product.title}
            ${product.description}
            ${product.category}
            ${product.tag}
            ${product.store}
          `.toLowerCase();

          let score = 0;

          words.forEach((word) => {
            if (haystack.includes(word)) {
              score += 1;
            }
          });

          if (maxPrice !== null && product.price <= maxPrice) {
            score += 1;
          }

          if (maxPrice !== null && product.price > maxPrice) {
            score -= 2;
          }

          return { product, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score);

      return scored.slice(0, 3).map((entry) => entry.product);
    },
    [products]
  );

  const handleSendChat = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const trimmed = chatInput.trim();

      if (!trimmed) return;

      const userMessage: ChatMessage = {
        role: 'user',
        text: trimmed,
      };

      const matches = getRecommendations(trimmed);

      let replyText: string;

      if (matches.length === 0) {
        replyText =
          "I couldn't find a close match. Try mentioning a product type or price limit.";
      } else {
        const lines = matches.map(
          (p) => `• ${p.title} (${p.store}) — $${p.price.toFixed(2)}`
        );

        replyText = `Here's what I'd suggest:\n${lines.join('\n')}`;
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        text: replyText,
      };

      setChatMessages((prev) => [
        ...prev,
        userMessage,
        assistantMessage,
      ]);

      setChatInput('');
    },
    [chatInput, getRecommendations]
  );

  const scrollStores = useCallback((direction: 'left' | 'right') => {
    const container = document.getElementById('stores-scroll');

    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -280 : 280,
        behavior: 'smooth',
      });
    }
  }, []);

  const scrollCategories = useCallback(
    (direction: 'left' | 'right') => {
      const container = document.getElementById('categories-scroll');

      if (container) {
        container.scrollBy({
          left: direction === 'left' ? -350 : 350,
          behavior: 'smooth',
        });
      }
    },
    []
  );

  const getStoreIcon = (store: string) => {
    if (store === 'Amazon') return 'amazon';
    if (store === 'AliExpress') return 'AliExpress';
    if (store === 'Temu') return 'TEMU';
    if (store === 'Alibaba') return 'Alibaba';
    if (store === 'Banggood') return 'Banggood';
    if (store === 'CJ Affiliate') return 'CJ';
    if (store === 'Awin') return 'AWIN';

    return 'SP';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      All: '▦',
      Electronics: '▣',
      'Home Appliances': '⌂',
      'Computer & Office': '▱',
      'Home & Garden': '⌂',
      'Sports & Entertainment': '⚽',
      'Toys & Hobbies': '♟',
      'Beauty & Health': '✦',
      'Jewelry & Accessories': '◇',
      'Phones & Telecommunications': '▯',
      'Consumer Electronics': '◉',
      'Lights & Lighting': '☼',
      Watches: '◷',
      "Men's Clothing": '♙',
      "Women's Clothing": '♕',
      Shoes: '◈',
      'Bags & Luggage': '▢',
      'Mother & Kids': '♧',
      'Automobiles & Motorcycles': '▰',
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
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-700/20 rounded-full blur-[140px]" />
        <div className="absolute top-[500px] -right-40 w-[500px] h-[500px] bg-fuchsia-700/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#020817]/90 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-fuchsia-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
                🛍️
              </div>

              <h1 className="text-xl md:text-2xl font-black tracking-tight">
                SmartPick
                <span className="text-gradient"> Pro</span>
              </h1>
            </div>

            <div className="flex-1 max-w-2xl mx-auto hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search premium products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-5 pr-12 rounded-full bg-slate-900/80 border border-slate-700/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                />

                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  ⌕
                </span>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={toggleAiShopper}
                className="bg-gradient-to-r from-blue-500 to-fuchsia-600 hover:opacity-90 px-4 md:px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-fuchsia-500/20 transition"
              >
                ✨ <span className="hidden sm:inline">AI Shopper</span>
                <span className="sm:hidden">AI</span>
              </button>

              <button
                type="button"
                onClick={handleSignIn}
                className="hidden sm:block px-5 py-2.5 rounded-xl border border-slate-600 hover:border-indigo-500 bg-slate-900/60 text-sm font-bold transition"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH */}
          <div className="md:hidden mt-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {/* HERO */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700 text-sm mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                <span className="text-emerald-400 font-bold">
                  Live Tracking
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">
                  Monitoring 40+ Categories
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
                <span className="text-white">ULTIMATE </span>
                <span className="text-gradient">
                  PRICE TRACKING
                </span>
                <span className="text-white"> &amp;</span>
                <br />
                <span className="text-gradient">DEAL FINDER</span>
              </h2>

              <p className="mt-6 text-xl md:text-2xl text-slate-300 font-semibold">
                Never Overpay Again. Track Prices &amp; Save Big.
              </p>

              <div className="flex flex-wrap gap-6 mt-8 text-sm text-slate-300">
                <span>⚡ Real-time Deals</span>
                <span>🛡️ Trusted Stores</span>
                <span>🌐 Global Shipping</span>
                <span>☆ AI-Powered</span>
              </div>
            </div>

            {/* HERO VISUAL */}
            <div className="relative min-h-[300px] hidden md:flex items-center justify-center">
              <div className="absolute w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />

              <div className="relative w-full max-w-lg">
                <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl shadow-blue-900/30 transform rotate-[-3deg]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                  </div>

                  <div className="bg-slate-800/80 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-slate-400 text-sm">
                        Best Deal
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                        Save 42%
                      </span>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="w-28 h-28 rounded-2xl bg-slate-700 flex items-center justify-center text-6xl">
                        🎧
                      </div>

                      <div>
                        <h3 className="font-bold text-lg">
                          Premium Headphones
                        </h3>
                        <p className="text-slate-500 line-through text-sm mt-1">
                          $149.99
                        </p>
                        <p className="text-3xl font-black text-white">
                          $89.99
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-8 right-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl px-6 py-4 shadow-xl">
                  <p className="font-bold">
                    Better Deals
                  </p>
                  <p className="font-bold">
                    Smarter Shopping
                  </p>
                  <p className="text-blue-200 text-sm">
                    With AI ✨
                  </p>
                </div>

                <div className="absolute -bottom-6 -left-5 w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-fuchsia-600 flex items-center justify-center text-4xl shadow-2xl">
                  🤖
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STORE BAR */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-8">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-slate-900/95 via-[#08162f] to-slate-900/95 p-3 md:p-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollStores('left')}
                className="shrink-0 w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 border border-slate-700 flex items-center justify-center text-lg transition"
              >
                ←
              </button>

              <div
                id="stores-scroll"
                className="flex-1 overflow-x-auto store-scroll"
              >
                <div className="flex gap-3 min-w-max">
                  {stores.map((store) => {
                    const isActive = selectedStore === store;

                    return (
                      <button
                        key={store}
                        type="button"
                        onClick={() => setSelectedStore(store)}
                        className={`store-card ${
                          isActive
                            ? 'active-store'
                            : ''
                        }`}
                      >
                        <span className="store-logo">
                          {getStoreIcon(store)}
                        </span>

                        <span>{store}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => scrollStores('right')}
                className="shrink-0 w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 border border-slate-700 flex items-center justify-center text-lg transition"
              >
                →
              </button>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-10">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-[#091b45] to-[#101a45] p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-fuchsia-600 flex items-center justify-center text-2xl shadow-lg">
                ✉
              </div>

              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-xl md:text-2xl font-black">
                  Get Weekly Top Deals Directly in Your Inbox
                </h3>
                <p className="text-slate-400 mt-1 text-sm">
                  Never miss steep price drops, exclusive tech finds,
                  and hand-picked product specials. No spam, ever.
                </p>
              </div>

              <form
                onSubmit={handleJoinFree}
                className="flex w-full lg:w-auto gap-3"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-0 flex-1 lg:w-80 px-5 py-3.5 rounded-xl bg-slate-950/70 border border-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                />

                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-600 font-bold text-sm hover:opacity-90 transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-black flex items-center gap-3">
              <span className="text-blue-400">▦</span>
              Shop by Category
            </h2>

            <span className="text-sm text-slate-400">
              ▦ 40+ Categories
            </span>
          </div>

          {/* MOBILE */}
          <div className="md:hidden">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="shrink-0 w-11 h-11 rounded-full bg-slate-800 border border-slate-700 hover:bg-indigo-600 hover:border-indigo-500 flex items-center justify-center text-xl transition"
            >
              ←
            </button>

            <div
              id="categories-scroll"
              className="flex-1 overflow-x-auto categories-scroll"
            >
              <div className="flex gap-3 min-w-max pb-3">
                {categories.map((cat) => {
                  const isActive = cat === selectedCategory;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`category-card ${
                        isActive ? 'active-category' : ''
                      }`}
                    >
                      <span className="category-icon">
                        {getCategoryIcon(cat)}
                      </span>

                      <span className="category-name">
                        {cat}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="shrink-0 w-11 h-11 rounded-full bg-slate-800 border border-slate-700 hover:bg-indigo-600 hover:border-indigo-500 flex items-center justify-center text-xl transition"
            >
              →
            </button>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3">
              <span>🔥</span>
              Featured Deals
            </h2>

            <span className="text-blue-400 font-semibold text-sm">
              View All →
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
              <div className="text-3xl animate-pulse">⚡</div>
              <h3 className="mt-3 font-bold text-xl">
                Loading deals...
              </h3>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
              <div className="text-4xl">🔎</div>
              <h3 className="text-xl font-bold mt-3">
                No products found
              </h3>
              <p className="text-slate-400 mt-2">
                Try another search, category, or store.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <div className="product-image">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-6xl">🛍️</span>
                    )}

                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full bg-fuchsia-600">
                      {product.store}
                    </span>

                    {product.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500 text-white">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-slate-500 mb-1">
                      {product.category}
                    </p>

                    <h3 className="font-bold text-sm line-clamp-2 min-h-[40px] group-hover:text-blue-400">
                      {product.title}
                    </h3>

                    <div className="mt-3 flex items-end justify-between gap-2">
                      <div>
                        <span className="text-xl font-black text-gradient">
                          ${product.price.toFixed(2)}
                        </span>

                        <div className="text-xs text-slate-500 line-through">
                          ${(product.price * 1.3).toFixed(2)}
                        </div>
                      </div>

                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-bold">
                        DEAL
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleBuyNow(product.affiliate_url)
                        }
                        className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-xs font-bold hover:opacity-90 transition"
                      >
                        Buy Now
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleSetAlert(product.title)
                        }
                        className="w-10 rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500 transition"
                        title="Set price alert"
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

        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-slate-950/80">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-black text-xl">
                  SmartPick<span className="text-gradient"> Pro</span>
                </div>

                <p className="text-slate-500 text-sm mt-1">
                  AI-powered global deal discovery.
                </p>
              </div>

              <p className="text-slate-600 text-sm">
                © 2026 SmartPick Pro. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* AI CHAT */}
      {isChatOpen && (
        <div className="fixed bottom-5 right-5 w-[calc(100%-2.5rem)] sm:w-96 max-h-[70vh] bg-slate-950 border border-indigo-500/40 rounded-2xl shadow-2xl shadow-indigo-900/40 flex flex-col z-50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-gradient-to-r from-indigo-950 to-fuchsia-950">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-600 flex items-center justify-center">
                🤖
              </div>

              <div>
                <h3 className="font-black">
                  AI Shopper
                </h3>

                <p className="text-xs text-emerald-400">
                  ● Online
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-indigo-600'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSendChat}
            className="flex gap-2 p-3 border-t border-slate-800"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />

            <button
              type="submit"
              className="px-4 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-600 font-bold"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* GLOBAL DESIGN CSS */}
      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(
            90deg,
            #38bdf8 0%,
            #6366f1 45%,
            #d946ef 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .store-scroll,
        .categories-scroll {
          scrollbar-width: auto;
          scrollbar-color: #6366f1 #0f172a;
          scroll-behavior: smooth;
        }

        .store-scroll::-webkit-scrollbar,
        .categories-scroll::-webkit-scrollbar {
          height: 10px;
        }

        .store-scroll::-webkit-scrollbar-track,
        .categories-scroll::-webkit-scrollbar-track {
          background: #0f172a;
          border-radius: 999px;
        }

        .store-scroll::-webkit-scrollbar-thumb,
        .categories-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(
            90deg,
            #3b82f6,
            #6366f1,
            #d946ef
          );
          border-radius: 999px;
          border: 2px solid #0f172a;
        }

        .store-scroll::-webkit-scrollbar-thumb:hover,
        .categories-scroll::-webkit-scrollbar-thumb:hover {
          background: #818cf8;
        }

        .store-card {
          height: 68px;
          min-width: 150px;
          padding: 0 24px;
          border-radius: 14px;
          border: 1px solid #1e3a5f;
          background: rgba(8, 23, 47, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #cbd5e1;
          font-weight: 800;
          font-size: 14px;
          white-space: nowrap;
          transition: all 0.25s ease;
        }

        .store-card:hover {
          border-color: #6366f1;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(79, 70, 229, 0.15);
        }

        .active-store {
          border-color: #8b5cf6 !important;
          background: linear-gradient(
            135deg,
            rgba(79, 70, 229, 0.4),
            rgba(192, 38, 211, 0.25)
          ) !important;
          color: white !important;
          box-shadow: 0 0 25px rgba(139, 92, 246, 0.2);
        }

        .store-logo {
          font-weight: 900;
          font-size: 16px;
          color: #fff;
        }

        .category-card {
          width: 108px;
          min-width: 108px;
          height: 112px;
          border-radius: 18px;
          border: 1px solid #1e293b;
          background: rgba(8, 23, 47, 0.75);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #94a3b8;
          transition: all 0.25s ease;
        }

        .category-card:hover {
          border-color: #4f46e5;
          color: white;
          transform: translateY(-3px);
          background: rgba(15, 31, 60, 0.9);
        }

        .active-category {
          border-color: #6366f1 !important;
          background: linear-gradient(
            145deg,
            #4f46e5,
            #7c3aed
          ) !important;
          color: white !important;
          box-shadow: 0 10px 35px rgba(79, 70, 229, 0.3);
        }

        .category-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(30, 64, 175, 0.18);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          font-size: 24px;
        }

        .active-category .category-icon {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .category-name {
          font-size: 11px;
          font-weight: 700;
          text-align: center;
          line-height: 1.15;
          max-width: 95px;
        }

        .product-card {
          overflow: hidden;
          border: 1px solid #172554;
          background: linear-gradient(
            145deg,
            rgba(15, 31, 60, 0.9),
            rgba(7, 18, 38, 0.95)
          );
          border-radius: 18px;
          transition: all 0.3s ease;
          animation: fadeUp 0.5s ease both;
        }

        .product-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99, 102, 241, 0.65);
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.8),
            0 0 30px rgba(79, 70, 229, 0.12);
        }

        .product-image {
          height: 190px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
            circle at center,
            rgba(30, 64, 175, 0.16),
            rgba(2, 8, 23, 0)
          );
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .store-card {
            min-width: 135px;
            height: 58px;
            padding: 0 18px;
          }
        }
      `}</style>
    </main>
  );
}