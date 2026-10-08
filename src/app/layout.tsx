import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CockpitBottomDock } from "@/components/navigation/CockpitBottomDock";
import { VipPreviewBanner } from "@/components/navigation/VipPreviewBanner";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#040711",
};

export const metadata: Metadata = {
  title: "Drive Partners • UK Freight & Logistics OS",
  description: "Next-Gen Fleet Management, In-Cab Operations & Direct Haulage Exchange",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-slate-950 text-slate-100">
      <body className="min-h-dvh antialiased flex flex-col bg-cockpit-grid pb-20 sm:pb-16">
        <VipPreviewBanner />
        {children}
        <CockpitBottomDock />
      </body>
    </html>
  );
}
