import { extendTheme } from "@mui/material/styles";
import { tokens } from "./tokens";

const contentScale = "var(--content-font-scale, 0.9375)";

declare module "@mui/material/styles" {
  interface Palette {
    warningSurface: string;
  }

  interface PaletteOptions {
    warningSurface?: string;
  }
}

export const appTheme = extendTheme({
  cssVarPrefix: "eptruth",
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: {
          main: tokens.light.accent,
          light: "#3B82F6",
          dark: "#1D4ED8",
          contrastText: tokens.light.accentContrast,
        },
        background: {
          default: tokens.light.surface,
          paper: tokens.light.surfaceAlt,
        },
        text: {
          primary: tokens.light.textPrimary,
          secondary: tokens.light.textSecondary,
        },
        warning: {
          main: tokens.light.warning,
          light: "#EA580C",
          /** Dark orange fill: white text meets WCAG 2.2 AA for small UI labels (4.5:1). */
          dark: "#9A3412",
          contrastText: "#FFFFFF",
        },
        divider: tokens.light.border,
        warningSurface: tokens.light.warning,
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: tokens.dark.accent,
          light: "#93C5FD",
          /** Deeper blue for fills where white label text is required (see FactCard pills). */
          dark: "#2563EB",
          contrastText: tokens.dark.accentContrast,
        },
        background: {
          default: tokens.dark.surface,
          paper: tokens.dark.surfaceAlt,
        },
        text: {
          primary: tokens.dark.textPrimary,
          secondary: tokens.dark.textSecondary,
        },
        warning: {
          main: tokens.dark.warning,
          light: "#FDBA74",
          dark: "#9A3412",
          contrastText: "#FFFFFF",
        },
        divider: tokens.dark.border,
        warningSurface: tokens.dark.warning,
      },
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: `calc(clamp(2.125rem, 5vw, 3.25rem) * ${contentScale})`,
      lineHeight: 1.08,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontWeight: 700,
      fontSize: `calc(clamp(1.5rem, 3.2vw, 2.125rem) * ${contentScale})`,
      lineHeight: 1.15,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontWeight: 600,
      fontSize: `calc(1.25rem * ${contentScale})`,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    /** In-card section titles (Learn subheads, data-centers cards); rem scales with user font preferences. */
    h4: {
      fontWeight: 600,
      fontSize: `calc(1.25rem * ${contentScale})`,
      lineHeight: 1.35,
      letterSpacing: "-0.01em",
    },
    h5: {
      fontWeight: 600,
      fontSize: `calc(1.1875rem * ${contentScale})`,
      lineHeight: 1.35,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
      fontSize: `calc(1.125rem * ${contentScale})`,
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: `calc(0.9375rem * ${contentScale})`,
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
    },
    body1: {
      lineHeight: 1.65,
      fontSize: `calc(1.0625rem * ${contentScale})`,
    },
    body2: {
      lineHeight: 1.6,
      fontSize: `calc(0.875rem * ${contentScale})`,
    },
    caption: {
      fontSize: `calc(0.75rem * ${contentScale})`,
      lineHeight: 1.5,
      letterSpacing: "0.02em",
    },
    overline: {
      fontWeight: 700,
      letterSpacing: "0.14em",
      fontSize: `calc(0.6875rem * ${contentScale})`,
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 14,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          textRendering: "optimizeLegibility",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingLeft: `max(${theme.spacing(2.5)}, env(safe-area-inset-left, 0px))`,
          paddingRight: `max(${theme.spacing(2.5)}, env(safe-area-inset-right, 0px))`,
          [theme.breakpoints.up("sm")]: {
            paddingLeft: `max(${theme.spacing(3)}, env(safe-area-inset-left, 0px))`,
            paddingRight: `max(${theme.spacing(3)}, env(safe-area-inset-right, 0px))`,
          },
          [theme.breakpoints.up("md")]: {
            paddingLeft: `max(${theme.spacing(4)}, env(safe-area-inset-left, 0px))`,
            paddingRight: `max(${theme.spacing(4)}, env(safe-area-inset-right, 0px))`,
          },
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 9999,
          paddingInline: 22,
          minHeight: 44,
          boxShadow: "none",
        },
        containedPrimary: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        outlined: {
          borderWidth: 1.5,
          "&:hover": {
            borderWidth: 1.5,
          },
        },
        sizeLarge: {
          paddingInline: 28,
          minHeight: 48,
          fontSize: "1rem",
        },
        sizeSmall: {
          minHeight: 36,
          paddingInline: 14,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: "none",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: Number(theme.shape.borderRadius),
          backgroundImage: "none",
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2.5),
          "&:last-child": {
            paddingBottom: theme.spacing(2.5),
          },
          [theme.breakpoints.up("sm")]: {
            padding: theme.spacing(3),
            "&:last-child": {
              paddingBottom: theme.spacing(3),
            },
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 9999,
        },
      },
    },
    /** Keeps outlined fields visually aligned with cards (14px); avoids notch/label clashes from overly round corners. */
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: Number(theme.shape.borderRadius),
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "none",
        },
      },
    },
  },
});
