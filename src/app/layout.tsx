import type { Metadata, Viewport } from "next";
import { Unbounded, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { MobileHeader } from "@/components/layout/mobile-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { OfflineIndicator } from "@/components/offline-indicator";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { AuthGate } from "@/components/auth-gate";
import { FloatingActionButton } from "@/components/widgets/floating-action-button";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#C45C32" },
    { media: "(prefers-color-scheme: dark)", color: "#1F1814" },
  ],
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Brazil Trip Planner",
  description: "Plan your adventure across Brazil - January to February 2026",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Brazil Trip",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${unbounded.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Providers>
              <AuthGate>
                <OfflineIndicator />
                <MobileHeader />
                <Header />
                <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">{children}</main>
                <FloatingActionButton />
                <BottomNav />
              </AuthGate>
            </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
