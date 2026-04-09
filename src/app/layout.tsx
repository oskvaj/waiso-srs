import "@/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { fonts, getThemeVars, type ThemeMode, type ThemeName } from "./theme";

const THEME: ThemeName = "honeybee";
const MODE: ThemeMode = "light";

export const metadata: Metadata = {
  title: "Waiso",
  description: "Spaced repetition learning platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const themeVars = getThemeVars(THEME, MODE);

  return (
    <html lang="en" className={`${fonts.classes}`}>
      <body
        className="font-theme-body bg-theme-page text-theme-text antialiased"
        style={themeVars as React.CSSProperties}
      >
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
