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
 * Dark-first civic tokens — sky blue accent (readable on dark).
 * Light tokens exist but the app runs dark-only.
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
    surface: "#0A0D12",
    surfaceAlt: "#141A22",
    textPrimary: "#F4F7FA",
    textSecondary: "#A8B3C2",
    accent: "#60A5FA",
    accentContrast: "#0B0F14",
    warning: "#FB923C",
    border: "#2E3848",
  },
};
