import type { Metadata, Viewport } from 'next';
import './globals.css';
import ContextualHeader from '@/components/navigation/ContextualHeader';
import SwipeBackWrapper from '@/components/navigation/SwipeBackWrapper';

export const metadata: Metadata = {
  title: 'Drive Partners & SmartHaul OS | In-Cab System',
  description: 'Commercial HGV Navigation, Compliance & Cockpit OS',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-slate-950 text-slate-100">
      <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        <ContextualHeader />
        <SwipeBackWrapper>
          {children}
        </SwipeBackWrapper>
      </body>
    </html>
  );
}
