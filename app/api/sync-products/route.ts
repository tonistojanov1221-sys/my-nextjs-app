import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase environment variables are missing.',
        },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const products = [
      {
        title: 'Xiaomi Smart Band 8',
        description:
          'Advanced fitness tracker with AMOLED display and 16 days battery life.',
        price: 35.99,
        category: 'Electronics',
        tag: 'BEST SELLER',
        store: 'AliExpress',
        affiliate_url: 'https://aliexpress.com',
        badge: 'HOT',
        is_sponsored: false,
      },
      {
        title: 'Wireless Earbuds Pro ANC',
        description:
          'Active noise canceling wireless earbuds with 30-hour battery life.',
        price: 89.5,
        category: 'Electronics',
        tag: 'BEST SELLER',
        store: 'AliExpress',
        affiliate_url: 'https://aliexpress.com',
        badge: 'BEST SELLER',
        is_sponsored: false,
      },
      {
        title: 'Smart Watch Ultra 2026',
        description:
          'Premium smartwatch with health monitoring and GPS.',
        price: 199.99,
        category: 'Electronics',
        tag: 'SMARTWATCH',
        store: 'AliExpress',
        affiliate_url: 'https://aliexpress.com',
        badge: 'AI Choice',
        is_sponsored: false,
      },
      {
        title: 'Portable Blender USB Rechargeable',
        description:
          'Mini portable blender for smoothies and shakes.',
        price: 24.99,
        category: 'Home Appliances',
        tag: 'BLENDER',
        store: 'AliExpress',
        affiliate_url: 'https://aliexpress.com',
        badge: 'NEW',
        is_sponsored: false,
      },
      {
        title: 'LED Desk Lamp with Wireless Charger',
        description:
          'Smart LED desk lamp with wireless phone charger.',
        price: 45,
        category: 'Home & Garden',
        tag: 'DESK LAMP',
        store: 'AliExpress',
        affiliate_url: 'https://aliexpress.com',
        badge: 'HOT',
        is_sponsored: false,
      },
    ]

    let added = 0

    for (const product of products) {
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('title', product.title)
        .maybeSingle()

      if (!existing) {
        const { error } = await supabase
          .from('products')
          .insert([product])

        if (error) {
          console.error(
            'Supabase insert error:',
            product.title,
            error.message
          )
        } else {
          added++
        }
      }
    }

    return NextResponse.json({
      success: true,
      added,
      message: `Sync completed. Added ${added} products.`,
    })
  } catch (error) {
    console.error('Sync error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}