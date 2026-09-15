import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/nav-bar';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Project Management System',
  description: 'Project Management System for Full Stack Developer',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-y-scroll`}
    >
      <ClerkProvider>
        <body className="min-h-full flex flex-col">
          <div>
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">{children}</main>
            <Toaster />
          </div>
        </body>
      </ClerkProvider>
    </html>
  );
}
