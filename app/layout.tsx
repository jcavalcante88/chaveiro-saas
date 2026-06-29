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
        url: `${process.env.NEXTAUTH_URL || "https://chaveiro-saas.vercel.app"}/api/og`,
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
    images: [`${process.env.NEXTAUTH_URL || "https://chaveiro-saas.vercel.app"}/api/og`],
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