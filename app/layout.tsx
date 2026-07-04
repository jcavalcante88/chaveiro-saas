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
        url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Chaveiro Pro - Sistema de Gestão de Estoque e Vendas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chaveiro Pro — Gestão Completa",
    description: "Sistema profissional para chaveiros gerenciar estoque e vendas. 15 dias grátis!",
    images: ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1200&h=630&fit=crop"],
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