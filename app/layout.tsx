import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Chaveiro Pro — Sistema de Gestão de Estoque e Vendas para Chaveiros",
  description: "Gerencie seu estoque de chaves, ferramentas e produtos com facilidade. Sistema completo de vendas, relatórios e controle financeiro. 15 dias grátis!",
  openGraph: {
    title: "Chaveiro Pro — Gestão Completa para seu Negócio",
    description: "Sistema profissional de gestão de estoque e vendas específico para chaveiros e serralherias. Controle total com 15 dias de teste grátis.",
    url: process.env.NEXTAUTH_URL || "https://chaveiro-saas.vercel.app",
    siteName: "Chaveiro Pro",
    images: [
      {
        url: "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Chaveiro Pro - Sistema de Gestão de Estoque e Vendas",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chaveiro Pro — Gestão Completa para seu Negócio",
    description: "Sistema profissional de gestão de estoque e vendas específico para chaveiros e serralherias. Controle total com 15 dias de teste grátis.",
    images: ["https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=630&fit=crop"],
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