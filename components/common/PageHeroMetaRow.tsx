import { Stack } from "@mui/material";
import type { ReactNode } from "react";

export type PageHeroMetaRowProps = {
  children: ReactNode;
};

/** Wraps tertiary hero actions (print, source links) in a consistent row below the subtitle. */
export default function PageHeroMetaRow({ children }: PageHeroMetaRowProps) {
  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1} sx={{ pt: 0.5 }}>
      {children}
    </Stack>
  );
}
