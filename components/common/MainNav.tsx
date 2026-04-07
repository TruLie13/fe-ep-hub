"use client";

import enDict from "@/dictionaries/en.json";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
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
          sx={() => {
            const specular = 0.05;
            const glassSheen = `linear-gradient(155deg, ${alpha("#ffffff", 0.05)} 0%, transparent 55%)`;
            return {
              position: "relative",
              gap: 2,
              justifyContent: "space-between",
              minHeight: { xs: 56, sm: 60 },
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1, sm: 0.75 },
              borderRadius: 1,
              overflow: "hidden",
              isolation: "isolate",
              bgcolor: alpha(tokens.dark.surface, 0.52),
              backgroundImage: glassSheen,
              backdropFilter: "blur(32px) saturate(150%)",
              WebkitBackdropFilter: "blur(32px) saturate(150%)",
              border: `1px solid ${alpha(tokens.dark.border, 0.55)}`,
              boxShadow: [
                `inset 0 1px 0 ${alpha("#ffffff", specular)}`,
                `inset 0 -1px 0 ${alpha("#000000", 0.42)}`,
                `0 12px 40px -12px ${alpha("#000000", 0.45)}`,
                `0 4px 16px -6px ${alpha("#000000", 0.3)}`,
              ].join(", "),
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                pointerEvents: "none",
                background: `linear-gradient(180deg, ${alpha("#ffffff", 0.04)} 0%, transparent 52%)`,
                opacity: 0.85,
              },
              "& > *": {
                position: "relative",
                zIndex: 1,
              },
            };
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
            <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }} noWrap>
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
                        color: active ? "primary.main" : tokens.dark.textSecondary,
                        bgcolor: active ? alpha(theme.palette.primary.main, 0.26) : "transparent",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, active ? 0.3 : 0.14),
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
              href="/take-action"
              variant="contained"
              size="small"
              aria-current={pathname === "/take-action" ? "page" : undefined}
              sx={(theme) => ({
                display: { xs: "none", md: "inline-flex" },
                flexShrink: 0,
                fontWeight: 700,
                color: `${theme.palette.common.black} !important`,
                "&:hover": { color: `${theme.palette.common.black} !important` },
                "&:focusVisible": { color: `${theme.palette.common.black} !important` },
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
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              {t.nav.menu}
            </Typography>
          </Box>
          <Divider />
          <List disablePadding>
            {navItems.map((item) => (
              <ListItemButton key={item.href} component={NextLink} href={item.href} onClick={() => setOpen(false)} selected={pathname === item.href}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ p: 2 }}>
            <Button
              component={NextLink}
              href="/take-action"
              variant="contained"
              fullWidth
              onClick={() => setOpen(false)}
              sx={(theme) => ({
                fontWeight: 700,
                color: `${theme.palette.common.black} !important`,
                "&:hover": { color: `${theme.palette.common.black} !important` },
                "&:focusVisible": { color: `${theme.palette.common.black} !important` },
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
