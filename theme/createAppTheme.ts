import { extendTheme } from "@mui/material/styles";
import { tokens } from "./tokens";

const contentScale = "var(--content-font-scale, 1)";
const fontSans = "var(--font-plus-jakarta), system-ui, -apple-system, sans-serif";
const fontDisplay = "var(--font-outfit), var(--font-plus-jakarta), system-ui, sans-serif";

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
        error: {
          main: "#F87171",
          light: "#FCA5A5",
          dark: "#B91C1C",
          contrastText: tokens.dark.accentContrast,
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
    fontFamily: fontSans,
    h1: {
      fontFamily: fontDisplay,
      fontWeight: 700,
      fontSize: `calc(clamp(2.25rem, 5.2vw, 3.5rem) * ${contentScale})`,
      lineHeight: 1.08,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontFamily: fontDisplay,
      fontWeight: 700,
      fontSize: `calc(clamp(1.625rem, 3.4vw, 2.25rem) * ${contentScale})`,
      lineHeight: 1.15,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: fontDisplay,
      fontWeight: 600,
      fontSize: `calc(1.3125rem * ${contentScale})`,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontFamily: fontDisplay,
      fontWeight: 600,
      fontSize: `calc(1.25rem * ${contentScale})`,
      lineHeight: 1.35,
      letterSpacing: "-0.01em",
    },
    h5: {
      fontFamily: fontDisplay,
      fontWeight: 600,
      fontSize: `calc(1.1875rem * ${contentScale})`,
      lineHeight: 1.35,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontFamily: fontDisplay,
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
      /* Slightly above pre-refresh size — Plus Jakarta reads smaller optically than Geist */
      fontSize: `calc(1.1875rem * ${contentScale})`,
    },
    body2: {
      lineHeight: 1.6,
      fontSize: `calc(1rem * ${contentScale})`,
    },
    caption: {
      fontSize: `calc(0.875rem * ${contentScale})`,
      lineHeight: 1.5,
      letterSpacing: "0.01em",
    },
    overline: {
      fontWeight: 600,
      letterSpacing: "0.08em",
      fontSize: `calc(0.8125rem * ${contentScale})`,
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
          backgroundColor: tokens.dark.surface,
          backgroundImage: [
            "radial-gradient(ellipse 110% 70% at 8% -15%, rgba(96, 165, 250, 0.06), transparent 55%)",
            "radial-gradient(ellipse 80% 50% at 100% 0%, rgba(46, 56, 72, 0.45), transparent 50%)",
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
          ].join(", "),
          backgroundAttachment: "fixed",
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
          fontSize: "1.0625rem",
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
