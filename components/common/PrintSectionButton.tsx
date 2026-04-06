"use client";

import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import { Button } from "@mui/material";

type PrintSectionButtonProps = {
  sectionId: string;
  label?: string;
};

/**
 * Focuses a printable region (by id) and opens the browser print dialog.
 */
export default function PrintSectionButton({ sectionId, label = "Print this section" }: PrintSectionButtonProps) {
  return (
    <Button
      type="button"
      variant="outlined"
      size="small"
      startIcon={<PictureAsPdfRoundedIcon />}
      onClick={() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => window.print(), 300);
      }}
    >
      {label}
    </Button>
  );
}
