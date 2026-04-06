"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  Box,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useScrollSpyActiveId } from "@/lib/hooks/useScrollSpyActiveId";

export type StickyInPageTocNestedItem = { id: string; label: string };

export type StickyInPageTocItem = {
  id: string;
  label: string;
  /** Optional second line (Data Centers TOC does not use this; eyebrow-only entries omit it). */
  secondary?: string;
  nested?: StickyInPageTocNestedItem[];
};

export type StickyInPageTocProps = {
  /** Heading above the list (e.g. “Contents”, “On this page”). */
  title: string;
  /** Defaults to `title` if omitted. */
  ariaLabel?: string;
  items: StickyInPageTocItem[];
  /**
   * `learn`: sticky only from `md` up (mobile TOC lives in a separate column wrapper).
   * `dataCenters`: sticky sidebar, hidden below `lg` (`display` on the same `nav` as `position: sticky`
   * so the TOC stays a direct flex child; a wrapper breaks sticky).
   */
  preset: "learn" | "dataCenters";
  /** Optional icon or element before the title (e.g. arrow on Data Centers). */
  titleAdornment?: ReactNode;
};

const ACTIVATION_OFFSET_PX = 112;

function flattenIds(items: StickyInPageTocItem[]): string[] {
  return items.flatMap((item) => [item.id, ...(item.nested?.map((n) => n.id) ?? [])]);
}

export default function StickyInPageToc({
  title,
  ariaLabel,
  items,
  preset,
  titleAdornment,
}: StickyInPageTocProps) {
  const flatIds = useMemo(() => flattenIds(items), [items]);
  const activeId = useScrollSpyActiveId(flatIds, ACTIVATION_OFFSET_PX);

  const learnNavSx: SxProps<Theme> = {
    position: { md: "sticky" },
    top: { md: 96 },
    alignSelf: "flex-start",
    maxHeight: { md: "calc(100vh - 112px)" },
    overflowY: { md: "auto" },
    pr: { md: 2 },
  };

  /** Sidebar TOC: visibility is controlled by the parent `aside` on the data-centers page, not here. */
  const dataCentersNavSx: SxProps<Theme> = {
    position: "sticky",
    top: 96,
    alignSelf: "flex-start",
    flexShrink: 0,
    width: "100%",
    maxHeight: "calc(100vh - 112px)",
    overflowY: "auto",
    pr: 2,
    minWidth: 200,
  };

  const navSx = preset === "learn" ? learnNavSx : dataCentersNavSx;

  const titleRow =
    titleAdornment != null ? (
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5 }}>
        {titleAdornment}
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
          {title}
        </Typography>
      </Stack>
    ) : (
      <Typography
        variant="overline"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: "text.secondary",
          px: 2,
          display: "block",
        }}
      >
        {title}
      </Typography>
    );

  return (
    <Box component="nav" aria-label={ariaLabel ?? title} sx={navSx}>
      {titleRow}
      <List dense disablePadding>
        {items.map((section) => {
          const isActive = activeId === section.id;
          const primarySlotProps = {
            variant: preset === "dataCenters" ? ("overline" as const) : ("body2" as const),
            fontWeight: preset === "dataCenters" ? 700 : 600,
            letterSpacing: preset === "dataCenters" ? "0.12em" : undefined,
            color:
              preset === "dataCenters"
                ? isActive
                  ? "primary.main"
                  : "text.secondary"
                : isActive
                  ? "primary.main"
                  : "text.primary",
            display: "block",
          };

          return (
            <ListItem key={section.id} disablePadding sx={{ flexDirection: "column", alignItems: "stretch" }}>
            <ListItemButton
              component={Link}
              href={`#${section.id}`}
              underline="none"
              selected={isActive}
              sx={{
                borderRadius: 1,
                py: 0.5,
                alignItems: "center",
                "&.Mui-selected": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <ListItemText
                primary={section.label}
                secondary={section.secondary}
                slotProps={{
                  primary: primarySlotProps,
                  ...(section.secondary
                    ? {
                        secondary: {
                          variant: "caption",
                          color: isActive ? "primary.main" : "text.secondary",
                          fontWeight: isActive ? 600 : 400,
                          sx: { mt: preset === "dataCenters" ? 0.25 : 0, display: "block" },
                        },
                      }
                    : {}),
                }}
              />
            </ListItemButton>
            {section.nested && section.nested.length > 0 ? (
              <List dense disablePadding sx={{ pl: 2 }}>
                {section.nested.map((sub) => (
                  <ListItem key={sub.id} disablePadding>
                    <ListItemButton
                      component={Link}
                      href={`#${sub.id}`}
                      underline="none"
                      selected={activeId === sub.id}
                      sx={{
                        borderRadius: 1,
                        py: 0.25,
                        "&.Mui-selected": {
                          bgcolor: "action.selected",
                        },
                      }}
                    >
                      <ListItemText
                        primary={sub.label}
                        slotProps={{
                          primary: {
                            variant: "caption",
                            fontWeight: activeId === sub.id ? 600 : 400,
                            color: activeId === sub.id ? "primary.main" : "text.secondary",
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : null}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
