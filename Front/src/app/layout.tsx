import type { Metadata } from "next";
import { Inter, Kantumruy_Pro } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Header } from "@/components/shared/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const kantumruy = Kantumruy_Pro({ subsets: ["khmer"], variable: "--font-kantumruy" });

export const metadata: Metadata = {
  title: "Mongkol — Cambodian Digital Wedding & Event Platform",
  description: "Create elegant Khmer wedding invitations, manage guest RSVPs, banquet seating, and digital QR check-in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${kantumruy.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              <main className="flex-1 flex flex-col">{children}</main>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
