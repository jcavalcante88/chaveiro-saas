import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Pix não tem renovação automática: cada pagamento libera 1 mês de acesso.
// O fim do acesso é recalculado a partir de todos os Pix aprovados do cliente
// no Stripe, então chamar isto várias vezes (webhook, volta do checkout,
// tela bloqueada) nunca soma o mesmo pagamento duas vezes.
export async function fimDoPix(customerId: string): Promise<Date | null> {
  const pagos = [];
  for await (const pi of stripe.paymentIntents.list({ customer: customerId, limit: 100 })) {
    if (pi.status === "succeeded" && pi.metadata?.tipo === "pix") pagos.push(pi);
  }
  pagos.sort((a, b) => a.created - b.created);

  let fim: Date | null = null;
  for (const pi of pagos) {
    const meses = Number(pi.metadata?.meses) || 1;
    const pago = new Date(pi.created * 1000);
    // Pagou antes de acabar o mês anterior: soma a partir do fim, sem perder dias.
    const base: Date = fim && fim > pago ? new Date(fim) : pago;
    base.setMonth(base.getMonth() + meses);
    fim = base;
  }
  return fim;
}

// Grava no banco o acesso pago via Pix. Não mexe em quem assina no cartão.
export async function sincronizarPix(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub?.stripeCustomerId || sub.status === "active") return false;

  const fim = await fimDoPix(sub.stripeCustomerId);
  if (!fim || fim <= new Date()) return false;

  await prisma.subscription.update({
    where: { userId },
    data: { status: "pix", currentPeriodEnd: fim },
  });
  return true;
}
