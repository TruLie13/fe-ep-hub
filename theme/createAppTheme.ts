import { extendTheme } from "@mui/material/styles";
import { tokens } from "./tokens";

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
      fontSize: "clamp(2.125rem, 5vw, 3.25rem)",
      lineHeight: 1.08,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "clamp(1.5rem, 3.2vw, 2.125rem)",
      lineHeight: 1.15,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    body1: {
      lineHeight: 1.65,
      fontSize: "1.0625rem",
    },
    body2: {
      lineHeight: 1.6,
    },
    overline: {
      fontWeight: 700,
      letterSpacing: "0.14em",
      fontSize: "0.6875rem",
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
