"use client";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import AgendaModal, { type AgendaModalLabels } from "./AgendaModal";
import {
  buildIcs,
  isVirtualMeetingLocation,
  type SerializedEvent,
} from "./meeting-utils";

export type { SerializedEvent } from "./meeting-utils";

export type MeetingCardLabels = {
  agenda: string;
  minutes: string;
  video: string;
  viewDetails: string;
  cancelled: string;
  agendaItems: string;
  addToCalendar: string;
  share: string;
  copied: string;
} & AgendaModalLabels;

type Props = {
  event: SerializedEvent;
  labels: MeetingCardLabels;
  dateLabel: string;
  past?: boolean;
  cancelled?: boolean;
};

export default function MeetingCard({
  event,
  labels,
  dateLabel,
  past,
  cancelled,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddToCalendar = useCallback(() => {
    const ics = buildIcs(event);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.EventBodyName.replace(/\s+/g, "-")}-${event.EventDate.slice(0, 10)}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [event]);

  const [copiedTip, setCopiedTip] = useState(false);

  const handleShare = useCallback(async () => {
    const title = `El Paso ${event.EventBodyName} — ${dateLabel}`;
    const time = event.EventTime ? ` at ${event.EventTime}` : "";
    const loc = event.EventLocation
      ? `, ${event.EventLocation.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}`
      : "";
    const text = `El Paso ${event.EventBodyName}${time}${loc}`;
    const pageUrl = `${window.location.origin}/city-meetings`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: pageUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n${pageUrl}`);
      setCopiedTip(true);
      setTimeout(() => setCopiedTip(false), 2000);
    }
  }, [event, dateLabel]);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          opacity: cancelled ? 0.6 : 1,
          transition: "border-color 160ms ease, transform 160ms ease",
          "&:hover": {
            borderColor: "primary.main",
            transform: past || cancelled ? "none" : "translateY(-2px)",
          },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
            "&:hover": { transform: "none" },
          },
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Stack spacing={2} sx={{ flex: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              alignItems="center"
            >
              <Chip
                size="small"
                label={event.EventBodyName}
                variant="outlined"
                color="primary"
              />
              {cancelled ? (
                <Chip size="small" label={labels.cancelled} color="error" />
              ) : null}
            </Stack>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ color: "text.primary" }}
              >
                <CalendarMonthRoundedIcon
                  sx={{ fontSize: 18, color: "primary.main" }}
                />
                <Typography variant="subtitle2">{dateLabel}</Typography>
              </Stack>

              {event.EventTime ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <ScheduleRoundedIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {event.EventTime}
                  </Typography>
                </Stack>
              ) : null}

              {event.EventLocation ? (
                isVirtualMeetingLocation(event.EventLocation) ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    sx={{ color: "text.secondary" }}
                  >
                    <LocationOnRoundedIcon
                      sx={{
                        fontSize: 18,
                        color: "text.secondary",
                        mt: 0.25,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {event.EventLocation.toLowerCase()}
                    </Typography>
                  </Stack>
                ) : (
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.EventLocation + ", El Paso, TX")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="text.secondary"
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <LocationOnRoundedIcon
                      sx={{
                        fontSize: 18,
                        color: "text.secondary",
                        mt: 0.25,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {event.EventLocation.toLowerCase()}
                    </Typography>
                  </Link>
                )
              ) : null}

            </Stack>

            {!cancelled ? (
              <Button
                size="small"
                variant="outlined"
                onClick={() => setModalOpen(true)}
                startIcon={<ListAltRoundedIcon />}
                sx={{ borderRadius: 9999, alignSelf: "flex-start" }}
              >
                {labels.agendaItems}
              </Button>
            ) : null}

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              {!past && !cancelled ? (
                <Button
                  size="small"
                  variant="text"
                  onClick={handleAddToCalendar}
                  startIcon={<EventRoundedIcon />}
                  sx={{ borderRadius: 9999 }}
                >
                  {labels.addToCalendar}
                </Button>
              ) : null}
              <Tooltip
                title={copiedTip ? labels.copied : ""}
                open={copiedTip}
                arrow
                disableInteractive
              >
                <Button
                  size="small"
                  variant="text"
                  onClick={handleShare}
                  startIcon={<ShareRoundedIcon />}
                  sx={{ borderRadius: 9999, ml: !past && !cancelled ? 0 : undefined }}
                >
                  {labels.share}
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <AgendaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        eventId={event.EventId}
        bodyName={event.EventBodyName}
        dateLabel={dateLabel}
        agendaPdfUrl={event.EventAgendaFile}
        labels={labels}
      />
    </>
  );
}
