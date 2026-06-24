import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

// O Stripe chama essa rota automaticamente quando algo muda na assinatura
// (fim do trial, cobrança feita, cartão recusado, cancelamento, etc).
// É isso que mantém o status do cliente sempre correto no seu banco.
export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Assinatura do webhook inválida:", err);
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) {
        await prisma.subscription.update({
          where: { userId },
          data: {
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.items.data[0]?.price.id,
            status: sub.status, // trialing | active | past_due | canceled...
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) {
        await prisma.subscription.update({
          where: { userId },
          data: { status: "canceled" },
        });
      }
      break;
    }

    case "invoice.payment_failed": {
      // Cartão recusado após o trial — avise o cliente por e-mail aqui se quiser
      console.warn("Pagamento falhou para a fatura:", event.data.object);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
