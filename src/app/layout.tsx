import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HealConnect — Discover Verified Psychiatrists & Book Consultations',
  description:
    'Find and connect directly with board-certified psychiatrists. View transparent consultation fees, specialties, and schedule offline consultations easily via phone or email.',
  keywords: [
    'psychiatrist',
    'mental health',
    'therapy',
    'ADHD psychiatrist',
    'depression specialist',
    'anxiety consultation',
    'telehealth psychiatry',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
