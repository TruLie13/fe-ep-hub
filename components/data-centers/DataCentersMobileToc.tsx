"use client";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, ButtonBase, Collapse, Link, Stack, Typography } from "@mui/material";
import { useEffect, useId, useRef, useState } from "react";
import type { DataCentersImpactSection } from "@/content/schema";
import { useScrollSpyActiveId } from "@/lib/hooks/useScrollSpyActiveId";

const ACTIVATION_OFFSET_PX = 112;

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
  const panelId = useId();

  const activeSection = sections.find((s) => s.id === activeId) ?? sections[0];
  const currentLabel = activeSection?.eyebrow ?? "";

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!expanded) return;
      const root = rootRef.current;
      if (!root?.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!expanded) return;
      const root = rootRef.current;
      if (!root?.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("focusin", onFocusIn, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("focusin", onFocusIn, true);
    };
  }, [expanded]);

  return (
    <Box
      ref={rootRef}
      component="nav"
      aria-label={ariaLabel ?? label}
      sx={{
        position: "sticky",
        top: 96,
        zIndex: 1,
        mb: { xs: 4, lg: 3 },
        display: { xs: "block", lg: "none" },
        "@media print": { display: "none" },
      }}
    >
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "background.paper",
          overflow: "hidden",
        }}
      >
        <ButtonBase
          component="div"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={`${label}, ${currentLabel}. ${expanded ? collapseSectionsLabel : expandSectionsLabel}`}
          sx={{
            width: "100%",
            display: "block",
            textAlign: "left",
            px: 2,
            py: 1.5,
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
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Stack
            id={panelId}
            component="ul"
            spacing={0}
            sx={{ listStyle: "none", m: 0, p: 0, pb: 1, px: 2, maxHeight: 280, overflowY: "auto" }}
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
        </Collapse>
      </Box>
    </Box>
  );
}
