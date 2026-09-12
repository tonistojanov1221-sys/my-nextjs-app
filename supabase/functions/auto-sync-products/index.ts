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

    // Вистински производи од AliExpress/Amazon (примери)
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
        title: 'Robot Vacuum Cleaner X10',
        price: 249.00,
        badge: 'NEW',
        affiliate_url: 'https://www.amazon.com/dp/B0TEST123',
        description: 'Smart robot vacuum with mapping, auto-empty station, and app control',
        category: 'Home Appliances',
        image_url: 'https://m.media-amazon.com/images/I/test123.jpg'
      },
      {
        title: 'Gaming Mechanical Keyboard RGB',
        price: 59.50,
        badge: 'HOT',
        affiliate_url: 'https://www.aliexpress.com/item/1005003456789012.html',
        description: 'Mechanical gaming keyboard with RGB backlight, blue switches, and anti-ghosting',
        category: 'Computer & Office',
        image_url: 'https://ae01.alicdn.com/kf/S3456789012.jpg'
      },
      {
        title: 'Smart Watch Ultra 2026',
        price: 199.99,
        badge: 'AI Choice',
        affiliate_url: 'https://www.aliexpress.com/item/1005006789012345.html',
        description: 'Premium smartwatch with health monitoring, GPS, and 7-day battery life',
        category: 'Electronics',
        image_url: 'https://ae01.alicdn.com/kf/S6789012345.jpg'
      }
    ]

    // Провери за дупликати и додади ги производите
    let addedCount = 0
    let skippedCount = 0

    for (const product of productsToAdd) {
      // Провери дали веќе постои производ со ист наслов
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .ilike('title', product.title)
        .single()

      if (!existing) {
        // Додади го производот ако не постои
        const { error } = await supabase
          .from('products')
          .insert([{
            ...product,
            created_at: new Date().toISOString()
          }])

        if (error) {
          console.error(' Грешка при додавање:', product.title, error.message)
        } else {
          console.log('✅ Додаден:', product.title)
          addedCount++
        }
      } else {
        console.log('⏭️ Веќе постои:', product.title)
        skippedCount++
      }
    }

    console.log(`📊 Резултат: Додадени ${addedCount}, Прескокнати ${skippedCount}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        added: addedCount,
        skipped: skippedCount 
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