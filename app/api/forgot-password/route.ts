import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Não revelamos se o email existe ou não (segurança)
    if (!user) {
      return NextResponse.json(
        { message: "Se o email existir, um link de reset será enviado" },
        { status: 200 }
      );
    }

    // Gera um token seguro
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Expira em 1 hora

    // Salva o token no banco
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Envia o email
    await sendPasswordResetEmail(email, `/reset-password?token=${resetToken}`);

    return NextResponse.json(
      { message: "Se o email existir, um link de reset será enviado" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao enviar email de reset:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
