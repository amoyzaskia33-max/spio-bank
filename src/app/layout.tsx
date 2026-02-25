import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Premium font: Inter with optimized loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'SPIO OS Auto-Vault',
  description: 'Premium Web OS Interface - Enterprise Grade',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased subpixel-antialiased`}>
        {children}
      </body>
    </html>
  );
}
