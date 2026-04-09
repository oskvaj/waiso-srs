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
      "--color-text": "#2C2418",
      "--color-muted": "#7A6E58",
      "--color-disabled": "#A89E88",
      "--color-inverse": "#FAF8F2",
      "--color-page": "#F8F5EE",
      "--color-card": "#F2EFE8",
      "--color-raised": "#FAF8F2",
      "--color-border": "#E8E0D0",
      "--color-shadow": "rgba(0,0,0,0.08)",
      "--color-primary": "#2D6B4A",
      "--color-subtle": "#E8F0E8",
      "--color-action": "#D4A020",
      "--color-success": "#3A8050",
      "--color-danger": "#C45030",
    },

    dark: {
      "--color-text": "#E8E0D4",
      "--color-muted": "#A89880",
      "--color-disabled": "#6E6050",
      "--color-inverse": "#2C2418",
      "--color-page": "#2A2520",
      "--color-card": "#35302A",
      "--color-raised": "#403A32",
      "--color-border": "#4A4238",
      "--color-shadow": "rgba(0,0,0,0.15)",
      "--color-primary": "#50B878",
      "--color-subtle": "#303828",
      "--color-action": "#E8B840",
      "--color-success": "#60C078",
      "--color-danger": "#E07050",
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
