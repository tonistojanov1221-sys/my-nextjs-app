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
    description: "Industry-leading noise canceling with exceptional audio quality.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Apple MacBook Air M3",
    category: "Tech",
    price: "$1,099.00",
    score: "9.7",
    description: "Ultra-fast laptop with all-day battery life.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Breville Barista Touch Espresso Machine",
    category: "Kitchen",
    price: "$799.95",
    score: "9.5",
    description: "Perfect espresso with an automated touch screen display.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Keychron K2 Wireless Keyboard",
    category: "Workspace",
    price: "$79.99",
    score: "9.3",
    description: "Mechanical keyboard with an ideal typing experience.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Kindle Paperwhite (16 GB)",
    category: "Tech",
    price: "$149.99",
    score: "9.6",
    description: "Waterproof e-reader with a glare-free display.",
    image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Ergonomic Desk Chair",
    category: "Workspace",
    price: "$249.00",
    score: "9.2",
    description: "Maximum back support for long hours of work.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "PlayStation 5 Slim Console",
    category: "Gaming",
    price: "$499.00",
    score: "9.9",
    description: "Ultimate gaming experience with an ultra-high speed SSD.",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Logitech MX Master 3S Mouse",
    category: "Workspace",
    price: "$99.99",
    score: "9.8",
    description: "Precise wireless mouse for ultimate productivity.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Ninja Air Fryer Pro",
    category: "Kitchen",
    price: "$119.99",
    score: "9.4",
    description: "Healthy cooking with rapid air circulation.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Apple iPhone 15 Pro Max",
    category: "Mobile",
    price: "$1,199.00",
    score: "9.8",
    description: "Titanium design with a powerful pro camera system.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Garmin Forerunner 265",
    category: "Sports",
    price: "$449.99",
    score: "9.6",
    description: "Advanced GPS running smartwatch with a vibrant AMOLED display.",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Dyson V15 Detect Cordless Vacuum",
    category: "Home",
    price: "$749.99",
    score: "9.7",
    description: "Powerful cordless vacuum with laser detection for microscopic dust.",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Sonos Era 300 Smart Speaker",
    category: "Audio",
    price: "$449.00",
    score: "9.5",
    description: "Spacious sound with Dolby Atmos support for an immersive audio experience.",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Bowflex SelectTech 552 Dumbbells",
    category: "Sports",
    price: "$399.00",
    score: "9.8",
    description: "Adjustable dumbbells that replace 15 sets of weights in one compact design.",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "DJI Mini 4 Pro Drone",
    category: "Drones",
    price: "$759.00",
    score: "9.8",
    description: "Advanced mini drone with 4K camera and omnidirectional obstacle sensing.",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Apple Watch Series 10",
    category: "Tech",
    price: "$399.00",
    score: "9.7",
    description: "Најтенок и најнапреден паметен часовник од Apple со поголем екран.",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Nintendo Switch OLED Model",
    category: "Gaming",
    price: "$349.99",
    score: "9.6",
    description: "Vibrant 7-inch OLED screen gaming console for home and portable play.",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Instant Pot Pro 10-in-1 Pressure Cooker",
    category: "Kitchen",
    price: "$149.99",
    score: "9.5",
    description: "Multi-use programmable pressure cooker, slow cooker, and air fryer combo.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Anker MagGo Power Bank",
    category: "Trending",
    price: "$89.99",
    score: "9.7",
    description: "Qi2 certified wireless portable charger with a built-in foldable kickstand.",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Amazon Echo Show 5",
    category: "Smart Home",
    price: "$89.99",
    score: "9.4",
    description: "Compact smart display with Alexa and clear sound to manage your day.",
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Philips Hue White & Color LED Bulb Starter Kit",
    category: "Smart Home",
    price: "$199.99",
    score: "9.6",
    description: "Smart lighting system with millions of colors controllable via app or voice.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Fitbit Charge 6 Advanced Fitness Tracker",
    category: "Fitness",
    price: "$159.95",
    score: "9.5",
    description: "Advanced health tracker with built-in GPS, Google apps, and heart rate monitoring.",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Garmin Dash Cam 67W",
    category: "Automotive",
    price: "$259.99",
    score: "9.7",
    description: "Compact dash camera with wide 180-degree field of view and voice control.",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "ThisWorx Portable Car Vacuum Cleaner",
    category: "Automotive",
    price: "$39.99",
    score: "9.1",
    description: "High-power 12V mini handheld vacuum designed specifically for cars.",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "NOCO Boost Plus GB40 Jump Starter",
    category: "Automotive",
    price: "$99.95",
    score: "9.9",
    description: "Ultra-safe 1000A 12V lithium portable car battery jump starter box.",
    image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Meguiar's Complete Car Care Kit",
    category: "Automotive",
    price: "$49.99",
    score: "9.5",
    description: "Comprehensive 5-piece surface preparation and detailing cleaning kit.",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Anker Roav Smart Car Charger",
    category: "Automotive",
    price: "$25.99",
    score: "9.3",
    description: "Dual USB car charger with PowerIQ technology for fast device charging on the go.",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Coleman Sundome 4-Person Tent",
    category: "Outdoor",
    price: "$99.99",
    score: "9.6",
    description: "Weather-resistant outdoor camping dome tent with weatherTec system.",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Yeti Hopper Flip 12 Portable Cooler",
    category: "Outdoor",
    price: "$250.00",
    score: "9.8",
    description: "Leak-proof, tough-as-nails soft cooler to keep drinks icy cold anywhere.",
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Hydro Flask Wide Mouth Bottle",
    category: "Outdoor",
    price: "$44.95",
    score: "9.7",
    description: "Insulated stainless steel water bottle keeping liquids cold for up to 24 hours.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Black Diamond Storm 400 Headlamp",
    category: "Outdoor",
    price: "$49.95",
    score: "9.5",
    description: "Waterproof high-performance headlamp for night hiking, climbing, and camping.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Osprey Atmos AG 65 Backpack",
    category: "Outdoor",
    price: "$320.00",
    score: "9.9",
    description: "Anti-gravity suspension multi-day backpacking pack for ultimate load comfort.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
  },
  // Нови производи
  {
    name: "JBL Flip 6 Portable Bluetooth Speaker",
    category: "Audio",
    price: "$129.95",
    score: "9.6",
    description: "Bold sound portable waterproof speaker with deep bass and party boost.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Razer DeathAdder V3 Pro Wireless Mouse",
    category: "Gaming",
    price: "$149.99",
    score: "9.8",
    description: "Ultra-lightweight ergonomic esports wireless gaming mouse with 30K optical sensor.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Nespresso VertuoPlus Coffee and Espresso Maker",
    category: "Kitchen",
    price: "$169.00",
    score: "9.5",
    description: "Single-serve coffee and espresso system with centrifusion technology.",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Logitech C920x HD Pro Webcam",
    category: "Workspace",
    price: "$69.99",
    score: "9.4",
    description: "Full HD 1080p video calling and recording with stereo audio.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Apple iPad Air 11-inch (M2)",
    category: "Tech",
    price: "$599.00",
    score: "9.8",
    description: "Immersive Liquid Retina display powered by the breakthrough M2 chip.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Anker Prime 240W 4-Port GaN Desktop Charger",
    category: "Trending",
    price: "$199.99",
    score: "9.7",
    description: "High-speed multi-device charging station for laptops, tablets, and phones simultaneously.",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80"
  }
];

const categories = ["All", "Tech", "Kitchen", "Workspace", "Gaming", "Mobile", "Sports", "Home", "Audio", "Drones", "Trending", "Smart Home", "Fitness", "Automotive", "Outdoor"];

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
            Smart live product recommendations
          </h2>
          <p className="text-slate-600 text-base">
            Search for any product — the system automatically generates direct Amazon recommendations with your affiliate protection.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Type any product (e.g., Laptop, Smartwatch, Blender)..."
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
                    Buy on Amazon (Affiliate)
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            No products found matching your search.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-8 mt-16 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2">
        <p>SmartPick AI is a participant in the Amazon Services LLC Associates Program. All purchases go directly through Amazon with protected Affiliate ID (<span className="font-mono font-bold text-slate-700">tonistojanov2-20</span>).</p>
        <p>© 2026 SmartPick AI. All rights reserved.</p>
      </footer>
    </div>
  );
}