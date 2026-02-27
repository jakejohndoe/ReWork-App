import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

// TODO: Add your Stripe webhook secret to .env
// STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
// Get this from Stripe Dashboard > Webhooks > Endpoint details

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-02-25.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'

export async function POST(request: NextRequest) {
  // TODO: Complete webhook implementation after Prisma schema migration
  console.log('Stripe webhook received but not yet fully implemented')

  // For now, just verify the signature and return success
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log(`Received webhook event: ${event.type}`)

    // Log event for manual processing during development
    console.log('Webhook event data:', JSON.stringify(event.data, null, 2))

    return NextResponse.json({ received: true, note: 'Webhook logged but not processed - schema migration pending' })
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
}