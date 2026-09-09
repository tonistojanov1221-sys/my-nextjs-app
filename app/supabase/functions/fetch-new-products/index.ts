import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // Пример за автоматско додавање на нови производи кои паѓаат во тренд
    const sampleNewProducts = [
      {
        title: 'AI Smart Fitness Ring Gen 3',
        description: 'Advanced health tracking, sleep monitoring and 7-day battery life.',
        price: 199.99,
        category: 'Sports',
        affiliate_url: 'https://example.com/smart-ring'
      },
      {
        title: 'Ultra-Wide Curved Gaming Monitor 34"',
        description: '1ms response time, 165Hz refresh rate for ultimate gaming performance.',
        price: 349.99,
        category: 'Gaming',
        affiliate_url: 'https://example.com/gaming-monitor'
      }
    ]

    // Внесување во базата само ако производот веќе не постои
    for (const prod of sampleNewProducts) {
      const { data: existing } = await supabaseClient
        .from('products')
        .select('id')
        .eq('title', prod.title)
        .single()

      if (!existing) {
        await supabaseClient.from('products').insert([prod])
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Products automatically synced and updated!' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})