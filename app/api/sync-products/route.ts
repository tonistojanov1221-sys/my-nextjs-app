import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// This is our "automatic" list of products.
// For now we use mock data, but later this will come from the real APIs.
const mockProducts = [
  {
    title: 'Xiaomi Smart Band 8',
    description: 'Advanced fitness tracker with AMOLED display and 16 days battery life.',
    price: 35.99,
    category: 'Electronics',
    tag: 'BEST SELLER',
    store: 'AliExpress',
    affiliate_url: 'https://aliexpress.com/item/xiaomi-band-8',
    badge: 'HOT',
    is_sponsored: false
  },
  {
    title: 'Robot Vacuum Cleaner X10',
    description: 'Smart robot vacuum with room mapping and self-emptying.',
    price: 249.00,
    category: 'Home & Kitchen',
    tag: 'NEW ARRIVAL',
    store: 'Temu',
    affiliate_url: 'https://temu.com/robot-vacuum-x10',
    badge: 'NEW',
    is_sponsored: true
  },
  {
    title: 'Wholesale Bluetooth Earbuds (100 pcs)',
    description: 'Wholesale wireless earbuds. Ideal for resale.',
    price: 450.00,
    category: 'Electronics',
    tag: 'WHOLESALE',
    store: 'Alibaba',
    affiliate_url: 'https://alibaba.com/wholesale-earbuds',
    badge: 'B2B',
    is_sponsored: false
  },
  {
    title: 'Kindle Paperwhite 16GB',
    description: 'The best e-reader on the market with a waterproof display.',
    price: 139.99,
    category: 'Electronics',
    tag: 'TOP RATED',
    store: 'Amazon',
    affiliate_url: 'https://amazon.com/kindle-paperwhite',
    badge: 'SALE',
    is_sponsored: false
  },
  {
    title: 'Gaming Mechanical Keyboard RGB',
    description: 'Mechanical keyboard with RGB lighting and fast switches.',
    price: 59.50,
    category: 'Computers & Accessories',
    tag: 'GAMING',
    store: 'AliExpress',
    affiliate_url: 'https://aliexpress.com/gaming-keyboard',
    badge: 'HOT',
    is_sponsored: false
  }
]

export async function GET() {
  try {
    // This command automatically inserts all products from the list into the database
    const { data, error } = await supabase
      .from('products')
      .insert(mockProducts)
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${data.length} new products to the database!`,
      products: data
    })

  } catch (error) {
    console.error('Sync script error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}