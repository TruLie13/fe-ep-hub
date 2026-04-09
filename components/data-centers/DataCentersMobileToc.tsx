"use client";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, ButtonBase, Link, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import type { DataCentersImpactSection } from "@/content/schema";
import { useScrollSpyActiveId } from "@/lib/hooks/useScrollSpyActiveId";

const ACTIVATION_OFFSET_PX = 112;
const DATA_CENTERS_STICKY_TOP_PX = 84;

/** Navbar Toolbar uses `borderRadius: 1`; same multiplier here for collapsed + expanded corners. */
const MAIN_NAV_SHELL_BORDER_RADIUS = 1 as const;

function navShellCornerRadius(theme: { shape: { borderRadius: number | string } }) {
  const r = theme.shape.borderRadius;
  return typeof r === "number" ? r * MAIN_NAV_SHELL_BORDER_RADIUS : r;
}

export type DataCentersMobileTocProps = {
  label: string;
  ariaLabel?: string;
  expandSectionsLabel: string;
  collapseSectionsLabel: string;
  sections: Pick<DataCentersImpactSection, "id" | "eyebrow">[];
};

export default function DataCentersMobileToc({
  label,
  ariaLabel,
  expandSectionsLabel,
  collapseSectionsLabel,
  sections,
}: DataCentersMobileTocProps) {
  const ids = sections.map((s) => s.id);
  const activeId = useScrollSpyActiveId(ids, ACTIVATION_OFFSET_PX);
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const activeSection = sections.find((s) => s.id === activeId) ?? sections[0];
  const currentLabel = activeSection?.eyebrow ?? "";

  useEffect(() => {
    if (!expanded) return;
    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root?.contains(event.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [expanded]);

  return (
    <Box
      ref={rootRef}
      component="nav"
      aria-label={ariaLabel ?? label}
      sx={{
        position: "sticky",
        top: DATA_CENTERS_STICKY_TOP_PX,
        zIndex: 3,
        mb: { xs: 4, lg: 3 },
        display: { xs: "block", lg: "none" },
        "@media print": { display: "none" },
      }}
    >
      <Box
        sx={{
          position: "relative",
          border: 1,
          borderColor: "divider",
          ...(expanded
            ? {
                borderTopLeftRadius: (theme) => navShellCornerRadius(theme),
                borderTopRightRadius: (theme) => navShellCornerRadius(theme),
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }
            : { borderRadius: MAIN_NAV_SHELL_BORDER_RADIUS }),
          borderBottom: 1,
          borderBottomColor: expanded ? "transparent" : "divider",
          bgcolor: "background.paper",
          overflow: "visible",
        }}
      >
        <ButtonBase
          component="button"
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          aria-label={`${label}, ${currentLabel}. ${expanded ? collapseSectionsLabel : expandSectionsLabel}`}
          sx={{
            width: "100%",
            display: "block",
            textAlign: "left",
            px: 2,
            py: 1.5,
            ...(expanded
              ? {
                  borderTopLeftRadius: (theme) => navShellCornerRadius(theme),
                  borderTopRightRadius: (theme) => navShellCornerRadius(theme),
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }
              : { borderRadius: MAIN_NAV_SHELL_BORDER_RADIUS }),
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: "0.12em" }}>
                {label}
              </Typography>
              <Typography variant="body2" fontWeight={600} color="primary.main">
                {currentLabel}
              </Typography>
            </Box>
            {expanded ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
          </Stack>
        </ButtonBase>
        {expanded ? (
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              left: -1,
              right: -1,
              zIndex: 4,
              border: 1,
              borderTop: 0,
              borderColor: "divider",
              borderBottomLeftRadius: (theme) => navShellCornerRadius(theme),
              borderBottomRightRadius: (theme) => navShellCornerRadius(theme),
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              bgcolor: "background.paper",
              overflow: "hidden",
            }}
          >
            <Stack
              component="ul"
              spacing={0}
              sx={{ listStyle: "none", m: 0, p: 0.75, maxHeight: 220, overflowY: "auto" }}
            >
              {sections.map((s) => {
                const active = activeId === s.id;
                return (
                  <Box key={s.id} component="li">
                    <Link
                      href={`#${s.id}`}
                      underline="none"
                      aria-current={active ? "location" : undefined}
                      onClick={() => setExpanded(false)}
                      sx={{
                        display: "block",
                        py: 1,
                        px: 1,
                        borderRadius: 1,
                        bgcolor: active ? "action.selected" : "transparent",
                      }}
                    >
                      <Typography
                        variant="overline"
                        sx={{
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          color: active ? "primary.main" : "text.secondary",
                          display: "block",
                        }}
                      >
                        {s.eyebrow}
                      </Typography>
                    </Link>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
