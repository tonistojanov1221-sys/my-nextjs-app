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

    // Пример: Додавање на нови производи
    const productsToAdd = [
      {
        title: `Auto Product ${Date.now()}`,
        price: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
        badge: 'AUTO',
        affiliate_url: 'https://example.com'
      }
    ]

    const { data, error } = await supabase
      .from('products')
      .insert(productsToAdd)
      .select()

    if (error) throw error

    console.log('✅ Додадени производи:', data?.length)

    return new Response(
      JSON.stringify({ success: true, count: data?.length }),
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