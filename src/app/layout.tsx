import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LeadPopup from "@/components/LeadPopup";
import ProfessorChat from "@/components/ProfessorChat";
import { getMenuCategories } from "@/lib/api";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: 'Código Fluente — Cursos Gratuitos de Programação',
    template: '%s | Código Fluente',
  },
  description: 'Aulas gratuitas de programação, DevOps, IA e Data Science. Django, Python, Go, Kubernetes, React e muito mais.',
  keywords: ['programação', 'cursos gratuitos', 'django', 'python', 'kubernetes', 'devops', 'react', 'golang'],
  authors: [{ name: 'Toti Cavalcanti' }],
  creator: 'Código Fluente',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://www.codigofluente.com.br',
    siteName: 'Código Fluente',
    title: 'Código Fluente — Cursos Gratuitos de Programação',
    description: 'Aulas gratuitas de programação, DevOps, IA e Data Science.',
    images: [
      {
        url: 'https://pub-7deede0db74e4001bd7334a7b1a70353.r2.dev/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Código Fluente',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Código Fluente — Cursos Gratuitos de Programação',
    description: 'Aulas gratuitas de programação, DevOps, IA e Data Science.',
    images: ['https://pub-7deede0db74e4001bd7334a7b1a70353.r2.dev/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getMenuCategories();

  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={`${jetbrainsMono.variable} font-mono bg-background text-foreground antialiased`}>
        <Navbar categories={categories} />
        <LeadPopup />
        <main className="min-h-screen">
          {children}
        </main>
        <ProfessorChat />
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