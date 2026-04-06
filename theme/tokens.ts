export type ThemeMode = "light" | "dark";

export type ThemeTokens = {
  surface: string;
  surfaceAlt: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentContrast: string;
  warning: string;
  border: string;
};

/**
 * Flat civic UI tokens — cool neutrals + one confident accent (2026-style clarity, not default MUI teal).
 */
export const tokens: Record<ThemeMode, ThemeTokens> = {
  light: {
    surface: "#F3F5F9",
    surfaceAlt: "#FFFFFF",
    textPrimary: "#0A0F1A",
    textSecondary: "#5B6472",
    accent: "#2563EB",
    accentContrast: "#FFFFFF",
    warning: "#C2410C",
    border: "#E2E8F0",
  },
  dark: {
    surface: "#0B0F14",
    surfaceAlt: "#121820",
    textPrimary: "#F1F5F9",
    textSecondary: "#94A3B8",
    accent: "#60A5FA",
    accentContrast: "#0B0F14",
    warning: "#FB923C",
    border: "#2A3441",
  },
};
