import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('🤖 Auto-sync започна...')

    const productsToAdd = [
      {
        title: 'Xiaomi Smart Band 8 Fitness Tracker',
        price: 35.99,
        badge: 'HOT',
        affiliate_url: 'https://www.aliexpress.com/item/1005005234567890.html',
        description: 'Advanced fitness tracker with AMOLED display, heart rate monitoring, and 16-day battery life',
        category: 'Electronics',
        image_url: 'https://ae01.alicdn.com/kf/S1234567890.jpg'
      },
      {
        title: 'Wireless Earbuds Pro ANC',
        price: 89.50,
        badge: 'BEST SELLER',
        affiliate_url: 'https://www.aliexpress.com/item/1005004987654321.html',
        description: 'Active noise canceling wireless earbuds with 30-hour battery life and premium sound quality',
        category: 'Electronics',
        image_url: 'https://ae01.alicdn.com/kf/S0987654321.jpg'
      },
      {
        title: 'Smart Watch Ultra 2026',
        price: 199.99,
        badge: 'AI Choice',
        affiliate_url: 'https://www.aliexpress.com/item/1005006789012345.html',
        description: 'Premium smartwatch with health monitoring, GPS, and 7-day battery life',
        category: 'Electronics',
        image_url: 'https://ae01.alicdn.com/kf/S6789012345.jpg'
      },
      {
        title: 'Portable Blender USB Rechargeable',
        price: 24.99,
        badge: 'NEW',
        affiliate_url: 'https://www.aliexpress.com/item/1005007890123456.html',
        description: 'Mini portable blender for smoothies and shakes, USB rechargeable, perfect for travel',
        category: 'Home Appliances',
        image_url: 'https://ae01.alicdn.com/kf/S7890123456.jpg'
      },
      {
        title: 'LED Desk Lamp with Wireless Charger',
        price: 45.00,
        badge: 'HOT',
        affiliate_url: 'https://www.aliexpress.com/item/1005008901234567.html',
        description: 'Smart LED desk lamp with wireless phone charger, 5 brightness levels, eye protection',
        category: 'Home & Garden',
        image_url: 'https://ae01.alicdn.com/kf/S8901234567.jpg'
      }
    ]

    let addedCount = 0
    let skippedCount = 0
    let priceChangedCount = 0

    for (const product of productsToAdd) {
      const { data: existing } = await supabase
        .from('products')
        .select('id, price')
        .ilike('title', product.title)
        .single()

      if (!existing) {
        const { error } = await supabase
          .from('products')
          .insert([{
            ...product,
            created_at: new Date().toISOString()
          }])

        if (error) {
          console.error('❌ Грешка:', product.title, error.message)
        } else {
          console.log('✅ Додаден:', product.title)
          addedCount++
        }
      } else {
        if (existing.price !== product.price) {
          await supabase
            .from('price_history')
            .insert([{
              product_id: existing.id,
              old_price: existing.price,
              new_price: product.price
            }])

          await supabase
            .from('products')
            .update({ price: product.price })
            .eq('id', existing.id)

          console.log('💰 Цена променета:', product.title, existing.price, '→', product.price)
          priceChangedCount++

          const { data: alerts } = await supabase
            .from('price_alerts')
            .select('user_email, target_price')
            .eq('product_id', existing.id)
            .eq('notified', false)
            .lte('target_price', product.price)

          if (alerts && alerts.length > 0) {
            console.log(' Испрати известувања до', alerts.length, 'корисници')
          }
        } else {
          console.log('⏭️ Без промени:', product.title)
          skippedCount++
        }
      }
    }

    console.log(`📊 Резултат: Додадени ${addedCount}, Прескокнати ${skippedCount}, Промени на цени ${priceChangedCount}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        added: addedCount,
        skipped: skippedCount,
        priceChanges: priceChangedCount
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('❌ Грешка:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})