import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Cria uma sessão de assinatura no Stripe.
// O cartão é coletado AGORA, mas a primeira cobrança só acontece
// depois de 15 dias (trial_period_days), exatamente como Netflix/Spotify fazem.
export async function POST() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = session.user.id;

  let subscription = await prisma.subscription.findUnique({ where: { userId } });

  // Garante que o cliente existe no Stripe
  let stripeCustomerId = subscription?.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: { userId },
    });
    stripeCustomerId = customer.id;
    await prisma.subscription.update({
      where: { userId },
      data: { stripeCustomerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    metadata: { userId },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?assinatura=sucesso`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?assinatura=cancelada`,
  });

  return NextResponse.redirect(checkoutSession.url!, 303);
}
