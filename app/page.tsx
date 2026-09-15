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

  const storesRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const stores = ['All', 'Amazon', 'AliExpress', 'Temu', 'Alibaba', 'Banggood', 'CJ Affiliate', 'Awin'];

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
      const matchesQuery = !query || product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query) || product.category.toLowerCase().includes(query) || product.tag.toLowerCase().includes(query);
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
    if (!url) { alert('Affiliate link is not available yet.'); return; }
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const handleSetAlert = useCallback((title: string) => { alert(`Price alert set for "${title}".`); }, []);
  const handleSignIn = useCallback(() => { alert('Sign in is coming soon.'); }, []);

  const getRecommendations = useCallback((message: string) => {
    const text = message.toLowerCase();
    const priceMatch = text.match(/\$?(\d+(\.\d+)?)/);
    const maxPrice = priceMatch ? parseFloat(priceMatch[1]) : null;
    const words = text.replace(/[^a-z0-9\s.]/g, ' ').split(/\s+/).filter((word) => word.length > 2);
    return products.map((product) => {
      const haystack = `${product.title} ${product.description} ${product.category} ${product.tag} ${product.store}`.toLowerCase();
      let score = 0;
      words.forEach((word) => { if (haystack.includes(word)) score++; });
      if (maxPrice !== null && product.price <= maxPrice) score++;
      if (maxPrice !== null && product.price > maxPrice) score -= 2;
      return { product, score };
    }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map((item) => item.product);
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
      reply = "Here are my recommendations:\n\n" + matches.map((product) => `• ${product.title} — $${product.price.toFixed(2)} (${product.store})`).join('\n');
    }
    setChatMessages((prev) => [...prev, userMessage, { role: 'assistant', text: reply }]);
    setChatInput('');
  }, [chatInput, getRecommendations]);

  const scrollStores = (direction: 'left' | 'right') => {
    if (storesRef.current) {
      storesRef.current.scrollBy({
        left: direction === 'left' ? -350 : 350,
        behavior: 'smooth',
      });
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({
        left: direction === 'left' ? -350 : 350,
        behavior: 'smooth',
      });
    }
  };

  // ============================================
  // STORE LOGOS - VISTINSKI BRENDIRANI LOGOA
  // ============================================
  const storeLogoUrl = (store: string) => {
    const logos: Record<string, string> = {
      Amazon: 'https://cdn.simpleicons.org/amazon/FF9900',
      AliExpress: 'https://cdn.simpleicons.org/aliexpress/FF4747',
      Temu: 'https://cdn.simpleicons.org/temu/FF6B00',
      Alibaba: 'https://cdn.simpleicons.org/alibabadotcom/FF6A00',
      Banggood: 'https://cdn.simpleicons.org/banggood/FF6B00',
      'CJ Affiliate': 'https://cdn.simpleicons.org/cj/FF6600',
      Awin: 'https://cdn.simpleicons.org/awin/0073FF',
    };
    return logos[store] || null;
  };

  const categoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      All: '▦', Electronics: '◈', 'Home Appliances': '⌂', 'Computer & Office': '⌨',
      'Home & Garden': '⌂', 'Sports & Entertainment': '⚽', 'Toys & Hobbies': '♟',
      'Beauty & Health': '✦', 'Jewelry & Accessories': '◇', 'Phones & Telecommunications': '☎',
      'Consumer Electronics': '◉', 'Lights & Lighting': '☼', Watches: '◷',
      "Men's Clothing": '♙', "Women's Clothing": '♕', Shoes: '◈', 'Bags & Luggage': '▢',
      'Mother & Kids': '♧', 'Automobiles & Motorcycles': '⚙', 'Tools & Home Improvement': '⚒',
      Furniture: '▤', 'Kitchen & Dining': '♨', 'Bedding & Bath': '▱', 'Home Decor': '✧',
      'Pet Supplies': '●', 'Office & School Supplies': '▤', 'Security & Protection': '⬟',
      'Garden Supplies': '❀', 'Musical Instruments': '♫', 'Video Games': '▰',
      'Camera & Photo': '◎', 'Smart Devices': '◉', 'Audio & Video': '▶',
      'Gaming Accessories': '⌘', 'Fitness Equipment': '♧', 'Outdoor & Camping': '△',
      'Travel & Luggage': '✈', 'Personal Care': '✦', 'Hair Care': '✦', Makeup: '✦',
      'Skin Care': '✦', 'Health Care': '♥', 'Baby Products': '●',
    };
    return icons[category] || '•';
  };

  return (
    <main className="min-h-screen bg-[#0A0D14] text-white overflow-x-hidden font-sans">
      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-700/20 blur-[160px]" />
        <div className="absolute top-[500px] -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-700/10 blur-[160px]" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0D14]/90 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 h-[72px] flex items-center gap-5">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-fuchsia-600 flex items-center justify-center text-xl shadow-lg">
              🛍️
            </div>
            <h1 className="text-xl font-black tracking-tight">
              SmartPick <span className="bg-gradient-to-r from-blue-400 to-fuchsia-400 bg-clip-text text-transparent">Pro</span>
            </h1>
          </div>

          <div className="hidden md:block flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium products..."
                className="w-full h-11 rounded-full bg-[#12161F] border border-white/10 px-5 pr-12 text-sm outline-none focus:border-indigo-500/50 transition"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">⌕</span>
            </div>
          </div>

          <div className="ml-auto flex gap-3 items-center">
            <button onClick={() => setIsChatOpen(true)} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-600 text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2">
              <span className="text-xs">✨</span> AI Shopper
            </button>
            <button onClick={handleSignIn} className="hidden sm:block px-5 py-2.5 rounded-xl bg-[#12161F] border border-white/10 text-sm font-bold hover:bg-white/5 transition">
              Sign In
            </button>
          </div>
        </div>
        <div className="md:hidden px-4 pb-3">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-3 rounded-xl bg-[#12161F] border border-white/10 outline-none"
          />
        </div>
      </header>

      <div className="relative z-10">
        {/* HERO */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold">Live Tracking</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">Monitoring 40+ Categories</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
                ULTIMATE{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  PRICE TRACKING
                </span>{' '}
                &{' '}
                <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  DEAL FINDER
                </span>
              </h2>

              <p className="mt-6 text-lg text-slate-300 font-semibold max-w-md">
                Never Overpay Again. Track Prices & Save Big.
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8 text-sm text-slate-300 font-medium">
                <span className="flex items-center gap-2"><span className="text-emerald-400">⚡</span> Real-time Deals</span>
                <span className="flex items-center gap-2"><span className="text-emerald-400">🛡️</span> Trusted Stores</span>
                <span className="flex items-center gap-2"><span className="text-emerald-400">🌍</span> Global Shipping</span>
                <span className="flex items-center gap-2"><span className="text-emerald-400">🤖</span> AI-Powered</span>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-[480px]">
                <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-[100px]" />
                <div className="relative rounded-3xl border border-blue-500/20 bg-[#12161F] p-5 rotate-[-1deg] shadow-2xl shadow-blue-900/20">
                  <div className="flex gap-2 mb-4">
                    <span className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                  </div>
                  <div className="rounded-2xl bg-[#0A0D14] p-5 border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-400 text-xs font-medium">Best Deal</span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        Save 42%
                      </span>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-5xl border border-white/5">
                        🎧
                      </div>
                      <div>
                        <h3 className="text-lg font-black">Premium Headphones</h3>
                        <p className="line-through text-slate-500 mt-1 text-xs">$149.99</p>
                        <p className="text-3xl font-black text-white">$89.99</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STORE BAR - BELA POZADINA + VISTINSKI LOGOA */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 mb-10">
          <div className="rounded-2xl bg-[#12161F] border border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-300">Shop from Top Stores</h3>
              <span className="text-[11px] text-slate-500">Get the best deals from these trusted global marketplaces</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollStores('left')}
                className="w-9 h-9 rounded-lg bg-[#0A0D14] border border-white/10 flex items-center justify-center hover:bg-white/5 transition shrink-0 text-slate-400 z-10"
              >
                ←
              </button>

              <div
                ref={storesRef}
                className="flex-1 min-w-0 overflow-x-auto py-1 hide-scrollbar"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div className="flex gap-3 flex-nowrap w-max">
                  {stores.map((store) => (
                    <button
                      key={store}
                      onClick={() => setSelectedStore(store)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border transition shrink-0 text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                        selectedStore === store
                          ? 'bg-gradient-to-r from-blue-600 to-fuchsia-600 border-transparent shadow-lg text-white'
                          : 'bg-white border-transparent text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {storeLogoUrl(store) ? (
                        <img
                          src={storeLogoUrl(store) as string}
                          alt={store}
                          className="w-5 h-5 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold ${
                          selectedStore === store ? 'bg-white/20 text-white' : 'bg-slate-900 text-white'
                        }`}>
                          SP
                        </span>
                      )}
                      <span className={`font-bold text-xs whitespace-nowrap ${
                        selectedStore === store ? 'text-white' : 'text-slate-900'
                      }`}>
                        {store === 'All' ? 'All Stores' : store}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => scrollStores('right')}
                className="w-9 h-9 rounded-lg bg-[#0A0D14] border border-white/10 flex items-center justify-center hover:bg-white/5 transition shrink-0 text-slate-400 z-10"
              >
                →
              </button>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 mb-10">
          <div className="rounded-2xl bg-gradient-to-r from-[#2D1B69] to-[#1A0B3B] border border-purple-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">✉️</div>
              <div>
                <h3 className="text-base font-bold text-white">Get Weekly Top Deals Directly In Your Inbox</h3>
                <p className="text-xs text-purple-200/70 mt-0.5">Join 50,000+ smart shoppers. No spam, unsubscribe anytime.</p>
              </div>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 md:w-56 h-11 rounded-xl bg-white/10 border border-white/20 px-4 text-sm outline-none focus:border-purple-400 text-white placeholder:text-purple-200/50"
              />
              <button type="submit" className="px-5 h-11 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-600 font-bold text-xs shadow-lg whitespace-nowrap">
                Subscribe Now
              </button>
            </form>
          </div>
        </section>

        {/* CATEGORY BAR */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black flex items-center gap-2"><span className="text-blue-400">▦</span> Shop by Category</h2>
            <span className="text-[11px] text-slate-500 bg-[#12161F] px-3 py-1 rounded-full border border-white/5">{categories.length} Categories</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollCategories('left')}
              className="w-9 h-9 rounded-lg bg-[#12161F] border border-white/10 flex items-center justify-center hover:bg-white/5 transition shrink-0 text-slate-400 z-10"
            >
              ←
            </button>

            <div
              ref={categoriesRef}
              className="flex-1 min-w-0 overflow-x-auto py-1 hide-scrollbar"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="flex gap-2 flex-nowrap w-max">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition text-xs whitespace-nowrap shrink-0 hover:-translate-y-0.5 ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                        : 'bg-[#12161F] border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span>{categoryIcon(cat)}</span>
                    <span className="font-semibold">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => scrollCategories('right')}
              className="w-9 h-9 rounded-lg bg-[#12161F] border border-white/10 flex items-center justify-center hover:bg-white/5 transition shrink-0 text-slate-400 z-10"
            >
              →
            </button>
          </div>
        </section>

        {/* PRODUCTS GRID */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 pb-24">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black flex items-center gap-2"><span className="text-amber-400">🔥</span> Featured Deals</h3>
            <span className="text-xs text-slate-500">{filteredProducts.length} items found</span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading products from Supabase...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#12161F] rounded-3xl border border-white/5">
              <p className="text-xl font-bold text-slate-300">No products found</p>
              <p className="text-slate-500 mt-2">Try changing your search or selected store/category filters.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl bg-[#12161F] border border-white/5 p-4 flex flex-col justify-between hover:border-white/10 transition group relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition z-20">
                    <button className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md text-xs font-bold text-white border border-white/10 hover:bg-white/20">
                      Edit
                    </button>
                  </div>
                  <div>
                    <div className="relative h-44 rounded-xl bg-[#0A0D14] mb-4 flex items-center justify-center overflow-hidden border border-white/5">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <span className="text-4xl">📦</span>
                      )}
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-fuchsia-600 text-[10px] font-bold shadow-lg z-10">
                          {product.badge}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-white/10 z-10">
                        {product.store}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{product.category}</span>
                    <h4 className="text-sm font-bold mt-1 line-clamp-2 leading-tight">{product.title}</h4>
                    <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">{product.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Price</span>
                      <span className="text-lg font-black">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSetAlert(product.title)}
                        className="p-2 rounded-lg bg-[#0A0D14] hover:bg-white/5 text-slate-400 transition border border-white/5"
                        title="Set Price Alert"
                      >
                        🔔
                      </button>
                      <button
                        onClick={() => handleBuyNow(product.affiliate_url)}
                        className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-fuchsia-600 font-bold text-xs shadow-lg hover:opacity-95 transition"
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
          <div className="w-full max-w-xl rounded-3xl bg-[#12161F] border border-white/10 flex flex-col h-[600px] shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0A0D14]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-fuchsia-600 flex items-center justify-center text-sm">✨</div>
                <div>
                  <h3 className="font-bold text-sm">AI Shopper Assistant</h3>
                  <p className="text-xs text-slate-400">Ask me for recommendations</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#0A0D14] text-slate-200 rounded-bl-none border border-white/5'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChat} className="p-4 border-t border-white/5 bg-[#0A0D14] flex gap-3">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="e.g. Find headphones under $100..."
                className="flex-1 h-11 rounded-xl bg-[#12161F] border border-white/10 px-4 text-sm outline-none focus:border-blue-500 transition"
              />
              <button type="submit" className="px-5 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 font-bold text-sm">
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL CSS ZA SCROLL */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}