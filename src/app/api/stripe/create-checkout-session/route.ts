import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// STRIPE SETUP INSTRUCTIONS:
// 1. Go to https://dashboard.stripe.com/products
// 2. Create a new product called "ReWork Pro"
// 3. Add a recurring price of $3.00/month
// 4. Copy the price ID (starts with price_) to STRIPE_PRICE_ID in .env
// 5. Go to Developers > Webhooks, add endpoint: https://app.rework.solutions/api/stripe/webhook
// 6. Select events: checkout.session.completed, customer.subscription.deleted, customer.subscription.updated
// 7. Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET in .env

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-02-25.clover',
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, plan: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.plan === 'PREMIUM') {
      return NextResponse.json({ error: 'User already has Pro plan' }, { status: 400 })
    }

    const priceId = process.env.STRIPE_PRICE_ID
    if (!priceId) {
      return NextResponse.json({
        error: 'Stripe price ID not configured. Please add STRIPE_PRICE_ID to your .env file.'
      }, { status: 500 })
    }

    // Check if user already has a Stripe customer ID
    let customerId: string
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true }
    })

    if (existingUser?.stripeCustomerId) {
      customerId = existingUser.stripeCustomerId
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Save the customer ID to the database
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}