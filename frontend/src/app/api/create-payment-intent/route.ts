import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe Secret Key is not configured on the server.' }, { status: 401 });
  }

  try {
    const { amount, metadata } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Некорректная сумма платежа' }, { status: 400 });
    }

    // Create a PaymentIntent with the final total formatted in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents 
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: metadata || {},
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Stripe API error:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка обработки платежа' },
      { status: 500 }
    );
  }
}
