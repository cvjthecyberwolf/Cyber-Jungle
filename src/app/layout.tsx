import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "sonner";
import { Launcher } from '@/components/ui/launcher';

export const metadata: Metadata = {
  title: 'Cyber Jungle: AI Cyber Ecosystem',
  description: 'A next-generation, AI-powered cyber ecosystem',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Launcher />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}









