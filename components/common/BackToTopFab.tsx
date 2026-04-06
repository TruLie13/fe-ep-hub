"use client";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fab, Zoom } from "@mui/material";
import useScrollTrigger from "@mui/material/useScrollTrigger";

export type BackToTopFabProps = {
  /** Pass from server layout (`dict().common.backToTop`); client components cannot import `dict()` (server-only). */
  ariaLabel: string;
};

/**
 * Fixed round control after the user scrolls past a small threshold (all viewports).
 * Uses MUI `Fab` and `KeyboardArrowUpIcon`.
 */
export default function BackToTopFab({ ariaLabel }: BackToTopFabProps) {
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 280 });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={scrolled}>
      <Fab
        color="primary"
        size="medium"
        aria-label={ariaLabel}
        onClick={handleClick}
        className="print-hide"
        sx={{
          position: "fixed",
          right: 16,
          bottom: 24,
          zIndex: (th) => th.zIndex.fab,
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
}
