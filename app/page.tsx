"use client";

import { useState } from "react";

interface Product {
  name: string;
  category: string;
  price: string;
  score: string;
  description: string;
  image: string;
}

const initialProducts: Product[] = [
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Tech",
    price: "$398.00",
    score: "9.8",
    description: "Врвно поништување на бучава и исклучителен аудио квалитет.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Apple MacBook Air M3",
    category: "Tech",
    price: "$1,099.00",
    score: "9.7",
    description: "Ултра брз лаптоп со целодневен век на батеријата.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Breville Barista Touch Espresso Machine",
    category: "Kitchen",
    price: "$799.95",
    score: "9.5",
    description: "Совршено еспресо со автоматски екран на допир.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Keychron K2 Wireless Keyboard",
    category: "Workspace",
    price: "$79.99",
    score: "9.3",
    description: "Механичка тастатура со идеално искуство за пишување.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Kindle Paperwhite (16 GB)",
    category: "Tech",
    price: "$149.99",
    score: "9.6",
    description: "Водоотпорен е-читач со екран без отсјај.",
    image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Ergonomic Desk Chair",
    category: "Workspace",
    price: "$249.00",
    score: "9.2",
    description: "Максимална поддршка за грбот за долги часови работа.",
    image: "https://images.unsplash.com/photo-1580481077494-e3299ac25694?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "PlayStation 5 Slim Console",
    category: "Gaming",
    price: "$499.00",
    score: "9.9",
    description: "Врвно гејминг искуство со ултра брз SSD диск.",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Logitech MX Master 3S Mouse",
    category: "Workspace",
    price: "$99.99",
    score: "9.8",
    description: "Прецизно безжично глувче за врвна продуктивност.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Ninja Air Fryer Pro",
    category: "Kitchen",
    price: "$119.99",
    score: "9.4",
    description: "Здраво готвење со циркулација на врел воздух.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Apple iPhone 15 Pro Max",
    category: "Mobile",
    price: "$1,199.00",
    score: "9.8",
    description: "Титаниумско куќиште и врвен систем на камери.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Garmin Forerunner 265",
    category: "Sports",
    price: "$449.99",
    score: "9.6",
    description: "Напреден GPS паметен часовник за трчање со AMOLED екран.",
    image: "https://images.unsplash.com/photo-1510017801934-a99b1f71d6b4?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Dyson V15 Detect Cordless Vacuum",
    category: "Home",
    price: "$749.99",
    score: "9.7",
    description: "Моќен безжичен правосмукач со ласерско откривање на микро-прашина.",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Sonos Era 300 Smart Speaker",
    category: "Audio",
    price: "$449.00",
    score: "9.5",
    description: "Просторен звук со поддршка за Dolby Atmos за врвно аудио искуство.",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Bowflex SelectTech 552 Dumbbells",
    category: "Sports",
    price: "$399.00",
    score: "9.8",
    description: "Прилагодливи тегови кои заменуваат 15 пара тегови во еден сет.",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80"
  }
];

const categories = ["All", "Tech", "Kitchen", "Workspace", "Gaming", "Mobile", "Sports", "Home", "Audio"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = initialProducts.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getAmazonLink = (productName: string) => {
    const query = encodeURIComponent(productName);
    return `https://www.amazon.com/s?k=${query}&tag=tonistojanov2-20`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black tracking-tight text-indigo-600">SmartPick</h1>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">AI Engine</span>
        </div>
        <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          Store ID: <span className="font-mono font-bold text-slate-700">tonistojanov2-20</span>
        </div>
      </header>

      {/* Main Hero */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Паметни препораки за производи во живо
          </h2>
          <p className="text-slate-600 text-base">
            Пребарај било кој производ — системот автоматски генерира директни Amazon препораки со твојата партнерска заштита.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Напиши било кој производ (на пр. Laptop, Smartwatch, Blender)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-4 rounded-xl border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder-slate-400 bg-white"
          />
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              {/* Image Container */}
              <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Card Content */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                  <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md">
                    {product.category}
                  </span>
                </div>

                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-bold text-lg text-slate-900 leading-snug">{product.name}</h3>
                  <span className="text-indigo-600 font-extrabold text-base whitespace-nowrap">{product.price}</span>
                </div>

                <p className="text-slate-600 text-sm mb-4 flex-grow">{product.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <div className="text-xs text-slate-500">
                    Score: <span className="font-bold text-slate-700">{product.score}</span>
                  </div>
                  <a
                    href={getAmazonLink(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    Купи на Amazon (Affiliate)
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            Нема пронајдено производи што одговараат на вашето пребарување.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-8 mt-16 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2">
        <p>SmartPick AI е учесник во Amazon Services LLC Associates Program. Сите купувања одат директно преку Amazon со заштитен Affiliate ID (<span className="font-mono font-bold text-slate-700">tonistojanov2-20</span>).</p>
        <p>© 2026 SmartPick AI. Сите права се задржани.</p>
      </footer>
    </div>
  );
}