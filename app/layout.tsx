import type React from "react";
import type { Metadata } from "next";
import { Inter, VT323 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const vt323 = VT323({
  weight: "400", // VT323 has only one weight
  subsets: ["latin"],
  variable: "--font-vt323", // Define a CSS variable
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Photo Booth",
  description: "Take fun photos with AI-powered filters!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={vt323.variable}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
