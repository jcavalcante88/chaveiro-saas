import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Chaveiro Pro — Gestão de Estoque e Vendas",
  description: "Sistema de gestão de estoque e vendas para chaveiros. 15 dias grátis, sem cartão de crédito. Comece agora!",
  openGraph: {
    title: "Chaveiro Pro — Gestão Completa",
    description: "Sistema profissional para chaveiros gerenciar estoque e vendas. 15 dias grátis!",
    images: [
      {
        url: "https://chaveiro-saas.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chaveiro Pro - Sistema de Gestão de Estoque e Vendas",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}