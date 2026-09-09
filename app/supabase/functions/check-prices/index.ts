import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // Fetch all active price alerts
    const { data: alerts, error: alertsError } = await supabaseClient
      .from('price_alerts')
      .select('*, products(title, price, affiliate_url)')

    if (alertsError) throw alertsError

    let triggeredCount = 0

    for (const alert of alerts) {
      const currentPrice = alert.products?.price
      if (currentPrice && currentPrice <= alert.target_price) {
        // Target price reached or beaten!
        console.log(`Alert triggered for ${alert.user_email}: Product ${alert.products.title} is now $${currentPrice}`)
        triggeredCount++
        
        // Here you can integrate an email service like Resend or SendGrid to notify the user
      }
    }

    return new Response(
      JSON.stringify({ success: true, checked: alerts.length, triggered: triggeredCount }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})