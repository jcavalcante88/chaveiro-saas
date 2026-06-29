import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Chaveiro Pro — Gestão de Estoque e Vendas",
  description: "Sistema de gestão de estoque e vendas para chaveiros e serralherias",
  openGraph: {
    title: "Chaveiro Pro",
    description: "Gerencie seu estoque e vendas com facilidade 🔑",
    url: process.env.NEXTAUTH_URL || "https://chaveiro-pro.vercel.app",
    siteName: "Chaveiro Pro",
    images: [
      {
        url: "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Chaveiro Pro - Gestão de Estoque",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chaveiro Pro",
    description: "Gerencie seu estoque e vendas com facilidade 🔑",
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