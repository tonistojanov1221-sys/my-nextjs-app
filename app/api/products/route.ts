import { NextResponse } from 'next/server';

// Примерочни податоци (mock data)
const mockProducts = [
  {
    id: 1,
    title: "Portable Blender USB Rechargeable",
    description: "Mini portable blender for smoothies and shakes, USB rechargeable, perfect for travel",
    price: 24.99,
    category: "Home Appliances",
    tag: "blender",
    store: "AliExpress",
    affiliate_url: "https://aliexpress.com",
    badge: "NEW"
  },
  {
    id: 2,
    title: "Smart Watch Ultra 2026",
    description: "Premium smartwatch with health monitoring, GPS, and 7-day battery life",
    price: 199.99,
    category: "Electronics",
    tag: "smartwatch",
    store: "Amazon",
    affiliate_url: "https://amazon.com",
    badge: "AI Choice"
  },
  {
    id: 3,
    title: "Wireless Earbuds Pro",
    description: "High-quality wireless earbuds with noise cancellation and 30h battery",
    price: 89.99,
    category: "Audio & Video",
    tag: "earbuds",
    store: "Temu",
    affiliate_url: "https://temu.com",
    badge: "BEST SELLER"
  },
  {
    id: 4,
    title: "Gaming Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with blue switches for gaming",
    price: 59.99,
    category: "Gaming Accessories",
    tag: "keyboard",
    store: "AliExpress",
    affiliate_url: "https://aliexpress.com"
  },
  {
    id: 5,
    title: "4K Webcam with Microphone",
    description: "Professional 4K webcam with built-in noise-canceling microphone",
    price: 79.99,
    category: "Computer & Office",
    tag: "webcam",
    store: "Amazon",
    affiliate_url: "https://amazon.com",
    badge: "NEW"
  },
  {
    id: 6,
    title: "Laptop Stand Aluminum",
    description: "Ergonomic aluminum laptop stand, adjustable height and angle",
    price: 34.99,
    category: "Computer & Office",
    tag: "stand",
    store: "Temu",
    affiliate_url: "https://temu.com"
  }
];

export async function GET() {
  try {
    // Врати ги примерочните податоци
    return NextResponse.json({ 
      products: mockProducts,
      success: true 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      products: [],
      error: 'Failed to fetch products' 
    }, { status: 500 });
  }
}