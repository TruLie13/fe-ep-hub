"use client";

import { Box, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import Link from "next/link";
import { DataCenterSectionIcon } from "@/components/data-centers/dataCenterSectionIcon";

export type FactCardProps = {
  label: string;
  title: string;
  description: string;
  tone?: "default" | "primary" | "warning";
  /** When set, the whole card is a link (e.g. `/data-centers#section-id`). */
  href?: string;
  /** Same keys as data center section `icon` (e.g. `water`, `bolt`). */
  iconKey?: string | null;
};

/** WCAG 2.2 AA: ≥4.5:1 for normal text; pills use dark fills + white text (not mid-tone `main` + auto contrastText). */
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

/** Flat fact card: label as a simple tag, no heavy filled chips. */
export default function FactCard({ label, title, description, tone = "default", href, iconKey }: FactCardProps) {
  const body = (
    <CardContent sx={{ p: 2.5 }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1.5} alignSelf="flex-start" sx={{ flexWrap: "wrap", gap: 1.5 }}>
          {iconKey ? (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                bgcolor: "action.hover",
                color: "primary.main",
              }}
              aria-hidden
            >
              <DataCenterSectionIcon iconKey={iconKey} sx={{ fontSize: 22, m: 0 }} />
            </Box>
          ) : null}
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
        </Stack>
        <Typography component="h3" variant="h6">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.primary", opacity: 0.82 }}>
          {description}
        </Typography>
      </Stack>
    </CardContent>
  );

  return (
    <Card variant="outlined" sx={{ height: "100%", overflow: "visible" }}>
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
