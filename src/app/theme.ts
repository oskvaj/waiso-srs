import { Outfit, Nunito } from "next/font/google";

const outfitFont = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const nunitoFont = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
});

export const fonts = {
  heading: outfitFont,
  body: nunitoFont,
  classes: `${outfitFont.variable} ${nunitoFont.variable}`,
};

const themeColors = {
  honeybee: {
    light: {
      "--app-text": "#2C2418",
      "--app-muted": "#7A6E58",
      "--app-disabled": "#A89E88",
      "--app-inverse": "#FAF8F2",
      "--app-page": "#F2EFE8",
      "--app-card": "#F8F5EE",
      "--app-raised": "#FAF8F2",
      "--app-border": "#E8E0D0",
      "--app-shadow": "rgba(0,0,0,0.08)",
      "--app-primary": "#2D6B4A",
      "--app-subtle": "#E8F0E8",
      "--app-action": "#D4A020",
      "--app-success": "#3A8050",
      "--app-danger": "#C45030",
    },
    dark: {
      "--app-text": "#E8E0D4",
      "--app-muted": "#A89880",
      "--app-disabled": "#6E6050",
      "--app-inverse": "#2C2418",
      "--app-page": "#2A2520",
      "--app-card": "#35302A",
      "--app-raised": "#403A32",
      "--app-border": "#4A4238",
      "--app-shadow": "rgba(0,0,0,0.15)",
      "--app-primary": "#50B878",
      "--app-subtle": "#303828",
      "--app-action": "#E8B840",
      "--app-success": "#60C078",
      "--app-danger": "#E07050",
    },
  },
};

export type ThemeName = keyof typeof themeColors;
export type ThemeMode = "light" | "dark";

export function getThemeVars(
  name: ThemeName,
  mode: ThemeMode,
): Record<string, string> {
  return themeColors[name][mode];
}

export { themeColors };
