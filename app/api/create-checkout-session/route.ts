import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY

    if (!secretKey) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY is missing in .env.local' },
        { status: 500 }
      )
    }

    // ✅ ПОПРАВКА: Избришан apiVersion за да се избегне TypeScript грешка
    // Stripe автоматски ќе ја користи точната верзија за инсталираниот пакет
    const stripe = new Stripe(secretKey)

    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim() : ''

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const priceId = process.env.STRIPE_PRICE_USD

    if (!priceId) {
      return NextResponse.json(
        { error: 'STRIPE_PRICE_USD is missing in .env.local' },
        { status: 500 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        product: 'smartpick-ai',
        plan: 'premium',
      },
      success_url: `${siteUrl}/?success=true`,
      cancel_url: `${siteUrl}/?canceled=true`,
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('STRIPE CHECKOUT ERROR:', error)
    const message = error instanceof Error ? error.message : 'Unknown Stripe error'

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}