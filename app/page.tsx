'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

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

function useWheelHorizontalScroll(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [ref]);
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
  const [loadError, setLoadError] = useState(false);

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

  const storesScrollRef = useRef<HTMLDivElement>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Products error:', error);
        setLoadError(true);
        setLoading(false);
      });
  }, []);

  useWheelHorizontalScroll(storesScrollRef);
  useWheelHorizontalScroll(categoriesScrollRef);

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
          if (maxPrice !== null && product.price <= maxPrice) score++;
          if (maxPrice !== null && product.price > maxPrice) score -= 2;
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
          'Here are my recommendations:\n\n' +
          matches
            .map(
              (product) =>
                `• ${product.title} — $${product.price.toFixed(
                  2
                )} (${product.store})`
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
    storesScrollRef.current?.scrollBy({
      left: direction === 'left' ? -400 : 400,
      behavior: 'smooth',
    });
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    categoriesScrollRef.current?.scrollBy({
      left: direction === 'left' ? -500 : 500,
      behavior: 'smooth',
    });
  };

  const renderStoreLogo = (store: string) => {
    switch (store) {
      case 'Amazon':
        return (
          <span className="logo-amazon">
            amazon<span className="logo-amazon-arc">⌣</span>
          </span>
        );
      case 'AliExpress':
        return (
          <span className="logo-aliexpress">
            Ali<span className="logo-aliexpress-accent">Express</span>
          </span>
        );
      case 'Temu':
        return <span className="logo-temu">Temu</span>;
      case 'Alibaba':
        return (
          <span className="logo-alibaba">
            <span className="logo-alibaba-dot" />
            Alibaba
          </span>
        );
      case 'Banggood':
        return <span className="logo-banggood">Banggood</span>;
      case 'CJ Affiliate':
        return (
          <span className="logo-cj">
            <span className="logo-cj-mark">CJ</span>
            <span className="logo-cj-text">affiliate</span>
          </span>
        );
      case 'Awin':
        return <span className="logo-awin">awin</span>;
      default:
        return <span className="logo-default">SP</span>;
    }
  };

  const categoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      All: '▦',
      Electronics: '◈',
      'Home Appliances': '⌂',
      'Computer & Office': '▣',
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
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-700/20 blur-[160px]" />
        <div className="absolute top-[450px] -right-40 w-[550px] h-[550px] rounded-full bg-fuchsia-700/10 blur-[160px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] rounded-full bg-blue-700/10 blur-[160px]" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020817]/95 backdrop-blur-xl">
          <div className="max-w-[1500px] mx-auto px-5 md:px-8 h-[78px] flex items-center gap-5">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-fuchsia-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
                🛍️
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight">
                SmartPick <span className="gradient-text">Pro</span>
              </h1>
            </div>

            <div className="hidden md:block flex-1 max-w-2xl mx-auto">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search premium products..."
                  className="w-full h-12 rounded-full bg-slate-900/90 border border-slate-700 px-6 pr-14 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                  🔍
                </span>
              </div>
            </div>

            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="px-4 md:px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-600 text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition"
              >
                ✨ AI Shopper
              </button>
              <button
                type="button"
                onClick={handleSignIn}
                className="hidden sm:block px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold hover:border-indigo-500 transition"
              >
                Sign In
              </button>
            </div>
          </div>

          <div className="md:hidden px-4 pb-4">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none"
            />
          </div>
        </header>

        {/* HERO SECTION - EXACTLY LIKE MAQUETTE */}
        <section className="max-w-[1500px] mx-auto px-5 md:px-8 pt-8 md:pt-12 pb-8">
          <div className="relative w-full max-w-6xl mx-auto p-6 md:p-12 rounded-3xl bg-gradient-to-br from-[#070e24] via-[#040816] to-[#02050f] border border-blue-900/30 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
            
            {/* Left side text */}
            <div className="flex-1 space-y-5 text-left z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Tracking & Monitoring 40+ Categories
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                ULTIMATE PRICE TRACKING & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-500">
                  DEAL FINDER
                </span>
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-md font-normal leading-relaxed">
                Never Overpay Again. Track Prices & Save Big.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-2">⚡ Real-time Deals</span>
                <span className="flex items-center gap-2">🛡️ Trusted Stores</span>
                <span className="flex items-center gap-2">🌐 Global Shipping</span>
                <span className="flex items-center gap-2">🤖 AI-Powered</span>
              </div>
            </div>

            {/* Right side: Laptop, Robot & Phone Graphic */}
            <div className="relative w-full md:w-[540px] h-[320px] flex items-center justify-center">
              
              {/* Floating AI Robot Head */}
              <div className="absolute -top-6 left-12 z-20 flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-blue-400 via-indigo-600 to-blue-900 p-0.5 shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center animate-bounce">
                  <div className="w-full h-full rounded-full bg-[#0a1128] flex items-center justify-center relative">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg border border-blue-400/30 whitespace-nowrap">
                  Better Deals Smarter Shopping With AI ✨
                </div>
              </div>

              {/* Laptop Mockup */}
              <div className="absolute left-0 bottom-0 w-[340px] h-[210px] bg-[#0b1329] rounded-t-2xl border border-blue-500/40 p-3 shadow-2xl z-10">
                <div className="w-full h-full bg-[#040816] rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Best Deal</span>
                    <span className="text-[10px] text-slate-400">Save 42%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-xl">🎧</div>
                    <div>
                      <p className="text-white text-xs font-bold">Premium Headphones</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-cyan-400 text-sm font-extrabold">$89.99</span>
                        <span className="text-slate-500 text-[11px] line-through">$149.99</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Phone Mockup */}
              <div className="absolute right-2 bottom-0 w-[140px] h-[240px] bg-[#0a1128] rounded-2xl border border-blue-500/40 p-2 shadow-2xl z-20 flex flex-col gap-2">
                <div className="w-full flex justify-center py-1">
                  <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
                </div>
                <div className="flex-1 space-y-1.5 flex flex-col justify-center">
                  <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-500/30 text-[10px] text-white font-semibold flex items-center gap-1.5">
                    <span>🔔</span> Price Alerts
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-300 font-semibold flex items-center gap-1.5">
                    <span>📊</span> Track Prices
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-300 font-semibold flex items-center gap-1.5">
                    <span>🔍</span> Find Deals
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-300 font-semibold flex items-center gap-1.5">
                    <span>💾</span> Save Money
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* STORE BAR */}
        <section className="max-w-[1500px] mx-auto px-5 md:px-8 mb-10">
          <div className="store-wrapper">
            <button
              type="button"
              onClick={() => scrollStores('left')}
              className="scroll-arrow"
              aria-label="Scroll stores left"
            >
              ←
            </button>
            <div ref={storesScrollRef} className="stores-scroll">
              <div className="stores-inner">
                {stores.map((store) => (
                  <button
                    type="button"
                    key={store}
                    onClick={() => setSelectedStore(store)}
                    className={`store-button ${
                      selectedStore === store ? 'store-active' : ''
                    }`}
                  >
                    {store === 'All' ? (
                      <>
                        <span className="store-logo">SP</span>
                        <span className="store-name">All Stores</span>
                      </>
                    ) : (
                      renderStoreLogo(store)
                    )}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => scrollStores('right')}
              className="scroll-arrow"
              aria-label="Scroll stores right"
            >
              →
            </button>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="max-w-[1500px] mx-auto px-5 md:px-8 mb-12">
          <div className="newsletter">
            <div className="newsletter-icon">✉</div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-black">
                Get Weekly Top Deals Directly in Your Inbox
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                Never miss price drops, exclusive finds, and hand-picked product specials.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 lg:w-80 px-5 py-3.5 rounded-xl bg-slate-950 border border-slate-700 outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-600 font-bold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* CATEGories */}
        <section className="max-w-[1500px] mx-auto px-5 md:px-8 mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-black">
              <span className="text-blue-400">▦</span> Shop by Category
            </h2>
            <span className="text-sm text-slate-400">40+ Categories</span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="scroll-arrow"
              aria-label="Scroll categories left"
            >
              ←
            </button>
            <div ref={categoriesScrollRef} className="categories-scroll">
              <div className="categories-inner">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`category-button ${
                      selectedCategory === category ? 'category-active' : ''
                    }`}
                  >
                    <span className="category-icon">{categoryIcon(category)}</span>
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="scroll-arrow"
              aria-label="Scroll categories right"
            >
              →
            </button>
          </div>

          <div className="md:hidden">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="max-w-[1500px] mx-auto px-5 md:px-8 pb-24">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-2xl md:text-3xl font-black">🔥 Featured Deals</h2>
            <span className="text-blue-400 text-sm font-bold">
              {filteredProducts.length} Products
            </span>
          </div>

          {loading ? (
            <div className="empty-box">
              <div className="text-5xl animate-pulse">⚡</div>
              <p className="mt-4 font-bold">Loading deals...</p>
            </div>
          ) : loadError ? (
            <div className="empty-box">
              <div className="text-5xl">⚠️</div>
              <p className="mt-4 text-xl font-bold">Couldn't load deals</p>
              <p className="text-slate-400 mt-2">
                Something went wrong reaching the product feed. Please try refreshing the page.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-box">
              <div className="text-5xl">🔎</div>
              <p className="mt-4 text-xl font-bold">No products found</p>
              <p className="text-slate-400 mt-2">Try another category, store or search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <article key={product.id} className="product-card">
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
                    <span className="product-store">{product.store}</span>
                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-slate-500 mb-2">{product.category}</p>
                    <h3 className="font-black text-lg line-clamp-2 min-h-[56px]">
                      {product.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-end justify-between mt-6">
                      <div>
                        <div className="text-3xl font-black gradient-text">
                          ${product.price.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500 line-through">
                          ${(product.price * 1.3).toFixed(2)}
                        </div>
                      </div>
                      <span className="deal-badge">DEAL</span>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <button
                        type="button"
                        onClick={() => handleBuyNow(product.affiliate_url)}
                        className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 font-bold text-sm hover:opacity-90 transition"
                      >
                        Buy Now
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetAlert(product.title)}
                        className="w-14 px-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500 transition"
                        aria-label="Set price alert"
                      >
                        🔔
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-12 bg-slate-950">
          <div className="max-w-[1500px] mx-auto px-5 md:px-8 flex flex-col md:flex-row justify-between gap-5">
            <div>
              <div className="text-2xl font-black">
                SmartPick <span className="gradient-text">Pro</span>
              </div>
              <p className="text-slate-500 text-sm mt-2">
                AI-powered global deal discovery.
              </p>
            </div>
            <p className="text-slate-600 text-sm">
              © 2026 SmartPick Pro. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* AI SHOPPER */}
      {isChatOpen && (
        <div className="fixed bottom-5 right-5 z-[100] w-[calc(100%-2.5rem)] sm:w-[420px] max-h-[72vh] rounded-3xl overflow-hidden border border-indigo-500/40 bg-slate-950 shadow-2xl shadow-black/50">
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-950 to-fuchsia-950 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-600 flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <h3 className="font-black">AI Shopper</h3>
                <p className="text-xs text-emerald-400">● Online</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="text-slate-400 hover:text-white text-xl"
              aria-label="Close AI Shopper"
            >
              ✕
            </button>
          </div>

          <div className="max-h-[50vh] overflow-y-auto p-4 space-y-3">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                    message.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:border-indigo-500"
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

      {/* DESIGN */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #020817;
          color: white;
          font-family: Arial, Helvetica, sans-serif;
        }

        button,
        input,
        select {
          font-family: inherit;
        }

        .gradient-text {
          background: linear-gradient(90deg, #38bdf8, #6366f1, #d946ef);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .store-wrapper {
          width: 100%;
          padding: 14px;
          border: 1px solid rgba(59, 130, 246, 0.35);
          background: linear-gradient(
            90deg,
            rgba(8, 23, 47, 0.98),
            rgba(10, 25, 55, 0.98),
            rgba(8, 23, 47, 0.98)
          );
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2);
        }

        .stores-scroll {
          flex: 1;
          min-width: 0;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 2px 2px 12px;
          scroll-behavior: smooth;
          scrollbar-width: auto;
          scrollbar-color: #6366f1 #0f172a;
        }

        .stores-scroll::-webkit-scrollbar {
          height: 14px;
        }

        .stores-scroll::-webkit-scrollbar-track {
          background: #0f172a;
          border-radius: 999px;
          border: 1px solid #1e293b;
        }

        .stores-scroll::-webkit-scrollbar-thumb {
          background: #6366f1;
          border-radius: 999px;
          border: 3px solid #0f172a;
        }

        .stores-inner {
          display: flex;
          gap: 12px;
          width: max-content;
        }

        .store-button {
          min-width: 155px;
          height: 66px;
          padding: 0 22px;
          border-radius: 15px;
          border: 1px solid #274060;
          background: #08162d;
          color: #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          white-space: nowrap;
          font-weight: 800;
          transition: 0.25s;
          cursor: pointer;
        }

        .store-button:hover {
          border-color: #6366f1;
          transform: translateY(-2px);
        }

        .store-active {
          background: linear-gradient(135deg, #4f46e5, #c026d3);
          border-color: #a855f7;
          color: white;
          box-shadow: 0 0 25px rgba(139, 92, 246, 0.3);
        }

        .store-logo {
          font-weight: 900;
          color: white;
          font-size: 15px;
        }

        .store-name {
          font-size: 13px;
        }

        .logo-amazon {
          position: relative;
          font-family: Georgia, 'Times New Roman', serif;
          font-weight: 700;
          font-size: 17px;
          letter-spacing: -0.5px;
          color: #ffffff;
          padding-bottom: 6px;
        }

        .logo-amazon-arc {
          position: absolute;
          left: 2px;
          bottom: -4px;
          color: #ff9900;
          font-size: 15px;
          transform: scaleX(1.6);
        }

        .logo-aliexpress {
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 800;
          font-size: 15px;
          color: #ff4747;
          letter-spacing: -0.3px;
        }

        .logo-aliexpress-accent {
          color: #ff9d00;
        }

        .logo-temu {
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 900;
          font-style: italic;
          font-size: 17px;
          background: linear-gradient(90deg, #fc6a03, #f9414a);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .logo-alibaba {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 800;
          font-size: 15px;
          color: #ff6a00;
        }

        .logo-alibaba-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ff6a00;
          display: inline-block;
        }

        .logo-banggood {
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 800;
          font-size: 15px;
          color: #4caf50;
        }

        .logo-cj {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .logo-cj-mark {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: linear-gradient(135deg, #ff5f00, #ff8c1a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 11px;
          color: white;
        }

        .logo-cj-text {
          font-size: 13px;
          font-weight: 700;
          color: #cbd5e1;
        }

        .logo-awin {
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 900;
          font-size: 17px;
          background: linear-gradient(90deg, #0057ff, #ff2e93);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .logo-default {
          font-weight: 900;
          color: white;
          font-size: 15px;
        }

        .scroll-arrow {
          flex-shrink: 0;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 1px solid #334155;
          background: #16243b;
          color: white;
          font-size: 21px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
          cursor: pointer;
        }

        .scroll-arrow:hover {
          background: #4f46e5;
          border-color: #818cf8;
          transform: scale(1.05);
        }

        .newsletter {
          display: flex;
          align-items: center;
          gap: 22px;
          padding: 27px;
          border: 1px solid rgba(59, 130, 246, 0.35);
          border-radius: 20px;
          background: linear-gradient(90deg, #091b45, #101a45);
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15);
        }

        .newsletter-icon {
          width: 60px;
          height: 60px;
          border-radius: 17px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #3b82f6, #d946ef);
          font-size: 25px;
        }

        .categories-scroll {
          flex: 1;
          min-width: 0;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 3px 3px 14px;
          scroll-behavior: smooth;
          scrollbar-width: auto;
          scrollbar-color: #6366f1 #0f172a;
        }

        .categories-scroll::-webkit-scrollbar {
          height: 16px;
        }

        .categories-scroll::-webkit-scrollbar-track {
          background: #0f172a;
          border-radius: 999px;
          border: 1px solid #1e293b;
        }

        .categories-scroll::-webkit-scrollbar-thumb {
          background: #6366f1;
          border-radius: 999px;
          border: 3px solid #0f172a;
        }

        .categories-inner {
          display: flex;
          gap: 12px;
          width: max-content;
        }

        .category-button {
          width: 125px;
          min-width: 125px;
          height: 118px;
          border-radius: 18px;
          border: 1px solid #1e293b;
          background: #08162d;
          color: #94a3b8;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 9px;
          transition: 0.25s;
          cursor: pointer;
        }

        .category-button:hover {
          color: white;
          border-color: #6366f1;
          transform: translateY(-3px);
        }

        .category-active {
          background: linear-gradient(145deg, #4f46e5, #7c3aed);
          color: white;
          border-color: #818cf8;
          box-shadow: 0 10px 30px rgba(79, 70, 229, 0.3);
        }

        .category-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59, 130, 246, 0.12);
          color: #60a5fa;
          font-size: 22px;
        }

        .category-active .category-icon {
          color: white;
          background: rgba(255, 255, 255, 0.15);
        }

        .category-button > span:last-child {
          font-size: 10px;
          font-weight: 800;
          text-align: center;
          line-height: 1.15;
          padding: 0 6px;
        }

        .product-card {
          overflow: hidden;
          border-radius: 20px;
          border: 1px solid #172554;
          background: linear-gradient(
            145deg,
            rgba(15, 31, 60, 0.95),
            rgba(7, 18, 38, 0.98)
          );
          transition: 0.3s;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        }

        .product-card:hover {
          transform: translateY(-6px);
          border-color: #6366f1;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
        }

        .product-image {
          height: 230px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.14),
            transparent 65%
          );
        }

        .product-store {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 6px 10px;
          border-radius: 999px;
          background: #7c3aed;
          color: white;
          font-size: 10px;
          font-weight: 800;
        }

        .product-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          font-size: 10px;
          font-weight: 800;
        }

        .deal-badge {
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          font-size: 10px;
          font-weight: 900;
        }

        .empty-box {
          padding: 80px 20px;
          border-radius: 20px;
          border: 1px solid #1e293b;
          background: #08111f;
          text-align: center;
        }
      `}</style>
    </main>
  );
}