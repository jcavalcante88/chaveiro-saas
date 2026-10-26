import { prisma } from "@/lib/prisma";
import { sincronizarPix } from "@/lib/pix";

export type AcessoStatus = {
  liberado: boolean;
  motivo: "trialing" | "active" | "trial_expirado" | "sem_assinatura" | "pagamento_pendente" | "cancelado" | "pix" | "pix_vencido";
  diasRestantesTrial: number | null;
};

// Usado dentro das páginas do dashboard (Server Component) para decidir
// se o usuário pode usar o sistema ou se deve ser mandado pra tela de cobrança.
export async function checkAcesso(userId: string): Promise<AcessoStatus> {
  const acesso = await calcularAcesso(userId);
  if (acesso.liberado) return acesso;

  // Bloqueado: confere no Stripe se chegou um Pix que o webhook ainda não
  // registrou (o Pix é aprovado alguns segundos depois do checkout).
  try {
    if (await sincronizarPix(userId)) return calcularAcesso(userId);
  } catch (err) {
    console.error("Acesso: falha ao conferir Pix no Stripe", err);
  }
  return acesso;
}

async function calcularAcesso(userId: string): Promise<AcessoStatus> {
  const sub = await prisma.subscription.findUnique({ where: { userId } });

  if (!sub) {
    return { liberado: false, motivo: "sem_assinatura", diasRestantesTrial: null };
  }

  const agora = new Date();

  if (sub.status === "trialing" && sub.trialEndsAt) {
    const msRestante = sub.trialEndsAt.getTime() - agora.getTime();
    const diasRestantes = Math.ceil(msRestante / (1000 * 60 * 60 * 24));
    if (msRestante > 0) {
      return { liberado: true, motivo: "trialing", diasRestantesTrial: diasRestantes };
    }
    return { liberado: false, motivo: "trial_expirado", diasRestantesTrial: 0 };
  }

  if (sub.status === "active") {
    return { liberado: true, motivo: "active", diasRestantesTrial: null };
  }

  if (sub.status === "pix") {
    if (sub.currentPeriodEnd && sub.currentPeriodEnd > agora) {
      return { liberado: true, motivo: "pix", diasRestantesTrial: null };
    }
    return { liberado: false, motivo: "pix_vencido", diasRestantesTrial: null };
  }

  if (sub.status === "past_due") {
    return { liberado: false, motivo: "pagamento_pendente", diasRestantesTrial: null };
  }

  return { liberado: false, motivo: "cancelado", diasRestantesTrial: null };
}
