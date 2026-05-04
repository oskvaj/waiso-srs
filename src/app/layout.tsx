import "@/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { fonts, getThemeVars, type ThemeMode, type ThemeName } from "./theme";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const THEME: ThemeName = "honeybee";
const MODE: ThemeMode = "light";

export const metadata: Metadata = {
  title: "Waiso",
  description: "Spaced repetition learning platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const themeVars = getThemeVars(THEME, MODE);

  return (
    <html lang="en" className={cn(fonts.classes, "font-sans", geist.variable)}>
      <body
        className="font-theme-body bg-theme-page text-theme-text antialiased"
        style={themeVars}
      >
        <ThemeProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
