import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020617",
};

export const metadata: Metadata = {
  title: "SmartHaul OS",
  description: "Next-Gen Fleet Management & In-Cab Operations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-slate-950 text-slate-100">
      <body className="min-h-dvh antialiased flex flex-col">{children}</body>
    </html>
  );
}
