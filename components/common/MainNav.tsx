"use client";

import enDict from "@/dictionaries/en.json";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getMainNavItems } from "@/lib/navigation/main-nav-items";
import { tokens } from "@/theme/tokens";
import ContentFontScaleControl from "@/components/common/ContentFontScaleControl";

const t = enDict;
const navItems = getMainNavItems(t.nav);

/** Patriotic accent stripe + navy field — readable on the dark nav bar. */
const electionCtaSx = {
  fontWeight: 700,
  color: "#FFFFFF !important",
  bgcolor: "#002868",
  position: "relative",
  overflow: "hidden",
  boxShadow: "none",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: "linear-gradient(90deg, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)",
  },
  "&:hover": {
    bgcolor: "#1a3a7a",
    color: "#FFFFFF !important",
    boxShadow: "none",
  },
  "&:focusVisible": {
    color: "#FFFFFF !important",
  },
} as const;

export default function MainNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      className="print-hide"
      sx={(theme) => ({
        zIndex: theme.zIndex.appBar,
        bgcolor: "transparent",
        backgroundImage: "none",
        boxShadow: "none",
        border: "none",
      })}
    >
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 1.5, sm: 2 },
          pb: { xs: 1, sm: 1.25 },
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            gap: 2,
            justifyContent: "space-between",
            minHeight: { xs: 56, sm: 60 },
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1, sm: 0.75 },
            borderRadius: 1,
            bgcolor: alpha(tokens.dark.surfaceAlt, 0.88),
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${alpha(tokens.dark.border, 0.7)}`,
            boxShadow: `0 1px 0 ${alpha("#ffffff", 0.04)}`,
          }}
        >
          <Link
            href="/"
            underline="none"
            sx={{
              minWidth: 0,
              color: tokens.dark.textPrimary,
              "& .nav-tagline": {
                color: tokens.dark.textSecondary,
              },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: "var(--font-outfit), var(--font-plus-jakarta), sans-serif",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                fontSize: { xs: "1.1rem", sm: "1.2rem" },
              }}
              noWrap
            >
              {t.nav.siteName}
            </Typography>
            <Typography variant="caption" display="block" noWrap className="nav-tagline" sx={{ lineHeight: 1.35 }}>
              {t.nav.siteTagline}
            </Typography>
          </Link>

          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ display: { xs: "none", md: "flex" } }} component="nav" aria-label="Main navigation">
              <Stack direction="row" spacing={0.25} flexWrap="wrap" useFlexGap alignItems="center">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      component={NextLink}
                      href={item.href}
                      color="inherit"
                      size="small"
                      sx={(theme) => ({
                        borderRadius: 9999,
                        px: 1.5,
                        fontWeight: 600,
                        color: active ? "text.primary" : tokens.dark.textSecondary,
                        bgcolor: active ? alpha(theme.palette.primary.main, 0.16) : "transparent",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, active ? 0.22 : 0.1),
                          color: "text.primary",
                        },
                      })}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Stack>
            </Box>
            <Button
              component={NextLink}
              href="/election"
              variant="contained"
              size="small"
              aria-label={t.nav.localElection2026Aria}
              aria-current={pathname === "/election" ? "page" : undefined}
              sx={{
                ...electionCtaSx,
                display: { xs: "none", md: "inline-flex" },
                flexShrink: 0,
              }}
            >
              {t.nav.localElection2026}
            </Button>
            <Button
              component={NextLink}
              href="/take-action"
              variant="contained"
              size="small"
              aria-current={pathname === "/take-action" ? "page" : undefined}
              sx={(theme) => ({
                display: { xs: "none", md: "inline-flex" },
                flexShrink: 0,
                fontWeight: 700,
                color: `${theme.palette.primary.contrastText} !important`,
                "&:hover": { color: `${theme.palette.primary.contrastText} !important` },
                "&:focusVisible": { color: `${theme.palette.primary.contrastText} !important` },
              })}
            >
              {t.nav.takeAction}
            </Button>
            <IconButton
              edge="end"
              aria-label={t.nav.openMenu}
              onClick={() => setOpen(true)}
              sx={{
                display: { md: "none" },
                color: tokens.dark.textSecondary,
              }}
            >
              <MenuRoundedIcon />
            </IconButton>
          </Stack>
        </Toolbar>
        <Box sx={{ display: { xs: "none", md: "flex" }, justifyContent: "flex-end", pt: 1 }}>
          <ContentFontScaleControl label={t.nav.textSize} />
        </Box>
      </Container>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 300 } }}
        ModalProps={{
          keepMounted: true,
          disableScrollLock: true,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box component="nav" aria-label="Main navigation" sx={{ pt: 2 }}>
            <List disablePadding>
              {navItems.map((item) => (
                <ListItemButton key={item.href} component={NextLink} href={item.href} onClick={() => setOpen(false)} selected={pathname === item.href}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
          </Box>
          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.25 }}>
            <Button
              component={NextLink}
              href="/election"
              variant="contained"
              fullWidth
              onClick={() => setOpen(false)}
              aria-label={t.nav.localElection2026Aria}
              sx={electionCtaSx}
            >
              {t.nav.localElection2026}
            </Button>
            <Button
              component={NextLink}
              href="/take-action"
              variant="contained"
              fullWidth
              onClick={() => setOpen(false)}
              sx={(theme) => ({
                fontWeight: 700,
                color: `${theme.palette.primary.contrastText} !important`,
                "&:hover": { color: `${theme.palette.primary.contrastText} !important` },
                "&:focusVisible": { color: `${theme.palette.primary.contrastText} !important` },
              })}
            >
              {t.nav.takeAction}
            </Button>
          </Box>
          <Box sx={{ mt: "auto", p: 2, pt: 0 }}>
            <ContentFontScaleControl label={t.nav.textSize} />
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
