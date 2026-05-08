import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LeadPopup from "@/components/LeadPopup";
import { getMenuCategories } from "@/lib/api";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Código Fluente - Cursos de Programação Gratuitos",
  description: "Aprenda programação, data science, machine learning e muito mais com cursos práticos e gratuitos.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getMenuCategories();

  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} font-mono bg-background text-foreground antialiased`}>
        <Navbar categories={categories} />
        <LeadPopup />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t border-white/10 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Código Fluente. Todos os direitos reservados.
            </p>
            <p className="text-neon-cyan/50 text-[10px] mt-2 tracking-[0.2em] font-bold">
              01000011 01001111 01000100 01001001 01000111 01001111
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
