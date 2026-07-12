"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import Link from "next/link";
import { DataCenterSectionIcon } from "@/components/data-centers/dataCenterSectionIcon";

export type FactCardProps = {
  label: string;
  title: string;
  description: string;
  tone?: "default" | "primary" | "warning";
  /** When set, the whole card is a link (e.g. `/data-center#section-id`). */
  href?: string;
  /** Same keys as data center section `icon` (e.g. `water`, `bolt`). */
  iconKey?: string | null;
  ctaLabel?: string;
  /** Wide editorial layout for the lead fact on Home. */
  featured?: boolean;
};

/** WCAG 2.2 AA: ≥4.5:1 for normal text; pills use dark fills + white text. */
function badgeStyles(tone: FactCardProps["tone"], theme: Theme) {
  if (tone === "warning") {
    return {
      bgcolor: theme.palette.warning.dark,
      color: "#FFFFFF",
    };
  }
  if (tone === "primary") {
    return {
      bgcolor: theme.palette.primary.dark,
      color: "#FFFFFF",
    };
  }
  return {
    bgcolor: theme.palette.action.selected,
    color: theme.palette.text.primary,
    border: "1px solid",
    borderColor: theme.palette.divider,
  };
}

/** Fact card with optional featured (wide) layout. Icons and badges stay. */
export default function FactCard({
  label,
  title,
  description,
  tone = "default",
  href,
  iconKey,
  ctaLabel = "Read full section",
  featured = false,
}: FactCardProps) {
  const iconWell = iconKey ? (
    <Box
      sx={{
        width: featured ? 52 : 40,
        height: featured ? 52 : 40,
        borderRadius: 2,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        bgcolor: "action.hover",
        color: "primary.main",
        border: "1px solid",
        borderColor: "divider",
      }}
      aria-hidden
    >
      <DataCenterSectionIcon iconKey={iconKey} sx={{ fontSize: featured ? 28 : 22, m: 0 }} />
    </Box>
  ) : null;

  const badge = (
    <Box
      component="span"
      sx={(theme) => ({
        px: 1.25,
        py: 0.5,
        borderRadius: 9999,
        fontSize: "0.8125rem",
        lineHeight: 1.25,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        ...badgeStyles(tone, theme),
      })}
    >
      {label}
    </Box>
  );

  const body = (
    <CardContent
      sx={{
        p: featured ? { xs: 2.5, md: 3.5 } : 2.5,
        height: "100%",
        ...(featured
          ? {
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, md: 4 },
              alignItems: { md: "center" },
            }
          : null),
      }}
    >
      {featured ? (
        <>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ flexShrink: 0, minWidth: { md: 160 } }}
          >
            {iconWell}
            {badge}
          </Stack>
          <Stack spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component="h3"
              variant="h4"
              sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" }, maxWidth: "28ch" }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "text.primary", opacity: 0.88, maxWidth: "62ch" }}
            >
              {description}
            </Typography>
          </Stack>
          {href ? (
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ color: "primary.main", flexShrink: 0, alignSelf: { xs: "flex-start", md: "center" } }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {ctaLabel}
              </Typography>
              <ArrowForwardRoundedIcon sx={{ fontSize: "1rem" }} />
            </Stack>
          ) : null}
        </>
      ) : (
        <Stack spacing={2} sx={{ height: "100%" }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            alignSelf="flex-start"
            sx={{ flexWrap: "wrap", gap: 1.5 }}
          >
            {iconWell}
            {badge}
          </Stack>
          <Typography component="h3" variant="h6">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.primary", opacity: 0.82, flex: 1 }}>
            {description}
          </Typography>
          {href ? (
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ pt: 0.5, color: "primary.main", mt: "auto" }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {ctaLabel}
              </Typography>
              <ArrowForwardRoundedIcon sx={{ fontSize: "1rem" }} />
            </Stack>
          ) : null}
        </Stack>
      )}
    </CardContent>
  );

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        overflow: "visible",
        ...(featured
          ? {
              bgcolor: "background.paper",
              borderColor: "divider",
            }
          : null),
      }}
    >
      {href ? (
        <CardActionArea
          component={Link}
          href={href}
          aria-label={`${label}: ${title}. ${description}`}
          sx={{ alignItems: "stretch", height: "100%" }}
        >
          {body}
        </CardActionArea>
      ) : (
        body
      )}
    </Card>
  );
}
