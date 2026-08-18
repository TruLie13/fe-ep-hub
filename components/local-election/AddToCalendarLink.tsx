"use client";

import EventRoundedIcon from "@mui/icons-material/EventRounded";
import { Link } from "@mui/material";
import {
  buildAllDayIcs,
  downloadIcsFile,
  type AllDayCalendarEvent,
} from "@/lib/local-election/calendar";

type AddToCalendarLinkProps = {
  event: AllDayCalendarEvent;
  label: string;
  ariaLabel: string;
};

export default function AddToCalendarLink({ event, label, ariaLabel }: AddToCalendarLinkProps) {
  return (
    <Link
      component="button"
      type="button"
      onClick={() => downloadIcsFile(buildAllDayIcs(event), event.filename)}
      aria-label={ariaLabel}
      color="primary"
      underline="hover"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.35,
        fontWeight: 600,
        fontSize: "inherit",
        verticalAlign: "baseline",
        textUnderlineOffset: "0.2em",
        border: 0,
        bgcolor: "transparent",
        cursor: "pointer",
        p: 0,
      }}
    >
      <EventRoundedIcon sx={{ fontSize: "1rem" }} aria-hidden />
      {label}
    </Link>
  );
}
