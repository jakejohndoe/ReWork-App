import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

// STRIPE WEBHOOK SETUP:
// 1. Go to https://dashboard.stripe.com/webhooks
// 2. Add endpoint: https://app.rework.solutions/api/stripe/webhook
// 3. Select events:
//    - checkout.session.completed
//    - customer.subscription.deleted
//    - customer.subscription.updated
// 4. Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET in .env

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-02-25.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        if (userId) {
          // Update user to PREMIUM plan
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: 'PREMIUM',
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: session.line_items?.data?.[0]?.price?.id || null,
              stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            }
          })

          console.log(`User ${userId} upgraded to PREMIUM plan`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by stripeCustomerId and downgrade to FREE
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId }
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: 'FREE',
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            }
          })

          console.log(`User ${user.id} downgraded to FREE plan`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by stripeCustomerId
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId }
        })

        if (user) {
          // Update subscription details
          const status = subscription.status
          const plan = status === 'active' ? 'PREMIUM' : 'FREE'

          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan,
              stripeCurrentPeriodEnd: (subscription as any).current_period_end
                ? new Date((subscription as any).current_period_end * 1000)
                : null,
            }
          })

          console.log(`User ${user.id} subscription updated, status: ${status}`)
        }
        break
      }

      default:
        console.log(`Unhandled webhook event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}